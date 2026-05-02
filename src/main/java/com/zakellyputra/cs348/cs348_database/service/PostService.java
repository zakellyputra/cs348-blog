package com.zakellyputra.cs348.cs348_database.service;

import com.zakellyputra.cs348.cs348_database.dto.*;
import com.zakellyputra.cs348.cs348_database.model.Comment;
import com.zakellyputra.cs348.cs348_database.model.Post;
import com.zakellyputra.cs348.cs348_database.model.Tag;
import com.zakellyputra.cs348.cs348_database.model.User;
import com.zakellyputra.cs348.cs348_database.repository.PostRepository;
import com.zakellyputra.cs348.cs348_database.repository.TagRepository;
import com.zakellyputra.cs348.cs348_database.repository.UserRepository;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, TagRepository tagRepository,
                       UserRepository userRepository) {
        this.postRepository = postRepository;
        this.tagRepository = tagRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public PostResponse createPost(CreatePostRequest request) {
        User author = userRepository.findById(request.authorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Author not found"));

        Post post = new Post();
        post.setTitle(request.title());
        post.setBody(request.body());
        post.setAuthor(author);

        // Add manual tags
        if (request.tagIds() != null && !request.tagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(request.tagIds()));
            post.getTags().addAll(tags);
        }

        // Auto-tag with current month-year
        String monthYear = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM yyyy"));
        Tag autoTag = tagRepository.findByTagName(monthYear).orElseGet(() -> {
            Tag newTag = new Tag();
            newTag.setTagName(monthYear);
            newTag.setAuto(true);
            return tagRepository.save(newTag);
        });
        post.getTags().add(autoTag);

        Post saved = postRepository.save(post);
        return toPostResponse(saved);
    }

    @Transactional
    public PostResponse getPost(Integer id) {
        int updated = postRepository.incrementViewCount(id);
        if (updated == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }
        Post post = postRepository.findByIdWithTagsAndComments(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        return toPostResponse(post);
    }

    @Transactional(readOnly = true)
    public List<PostSummaryResponse> listPosts(String sort) {
        List<Post> posts = switch (sort) {
            case "views" -> postRepository.findAllWithTagsOrderByViewCountDesc();
            case "oldest" -> postRepository.findAllWithTagsOrderByCreatedAtAsc();
            default -> postRepository.findAllWithTagsOrderByCreatedAtDesc();
        };
        return posts.stream().map(this::toPostSummaryResponse).toList();
    }

    @Transactional
    public PostResponse updatePost(Integer id, UpdatePostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        post.setTitle(request.title());
        post.setBody(request.body());

        post.getTags().clear();
        if (request.tagIds() != null && !request.tagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(request.tagIds()));
            post.getTags().addAll(tags);
        }

        Post saved = postRepository.save(post);
        return toPostResponse(saved);
    }

    @Transactional
    public void deletePost(Integer id) {
        if (!postRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }
        postRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public ReportResponse getReport(LocalDate startDate, LocalDate endDate,
                                    Integer tagId, Integer authorId) {
        Specification<Post> spec = Specification.where(null);

        if (startDate != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("createdAt"), startDate.atStartOfDay()));
        }
        if (endDate != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThan(root.get("createdAt"), endDate.plusDays(1).atStartOfDay()));
        }
        if (authorId != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("author").get("userId"), authorId));
        }
        if (tagId != null) {
            spec = spec.and((root, query, cb) -> {
                query.distinct(true);
                Join<Post, Tag> tagJoin = root.join("tags");
                return cb.equal(tagJoin.get("tagId"), tagId);
            });
        }

        List<Post> posts = postRepository.findAll(spec);

        List<PostSummaryResponse> postDtos = posts.stream()
                .map(this::toPostSummaryResponse).toList();

        int totalPosts = posts.size();
        double avgViews = posts.stream().mapToInt(Post::getViewCount).average().orElse(0.0);
        double avgComments = posts.stream().mapToInt(p -> p.getComments().size()).average().orElse(0.0);

        String mostActiveAuthor = posts.stream()
                .collect(Collectors.groupingBy(p -> p.getAuthor().getUsername(), Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        ReportResponse.ReportStats stats = new ReportResponse.ReportStats(
                totalPosts, avgViews, avgComments, mostActiveAuthor);

        return new ReportResponse(postDtos, stats);
    }

    private PostResponse toPostResponse(Post post) {
        List<TagResponse> tags = post.getTags().stream()
                .map(t -> new TagResponse(t.getTagId(), t.getTagName(), t.isAuto()))
                .toList();
        List<CommentResponse> comments = post.getComments().stream()
                .map(c -> new CommentResponse(c.getCommentId(), c.getBody(),
                        c.getUser().getUsername(), c.getCreatedAt()))
                .toList();
        return new PostResponse(
                post.getPostId(), post.getTitle(), post.getBody(),
                post.getAuthor().getUsername(), post.getAuthor().getUserId(),
                post.getViewCount(), post.getCreatedAt(), post.getUpdatedAt(),
                tags, comments);
    }

    private PostSummaryResponse toPostSummaryResponse(Post post) {
        List<TagResponse> tags = post.getTags().stream()
                .map(t -> new TagResponse(t.getTagId(), t.getTagName(), t.isAuto()))
                .toList();
        return new PostSummaryResponse(
                post.getPostId(), post.getTitle(),
                post.getAuthor().getUsername(), post.getViewCount(),
                post.getCreatedAt(), tags);
    }
}
