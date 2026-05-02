package com.zakellyputra.cs348.cs348_database.service;

import com.zakellyputra.cs348.cs348_database.dto.CommentResponse;
import com.zakellyputra.cs348.cs348_database.dto.CreateCommentRequest;
import com.zakellyputra.cs348.cs348_database.model.Comment;
import com.zakellyputra.cs348.cs348_database.model.Post;
import com.zakellyputra.cs348.cs348_database.model.User;
import com.zakellyputra.cs348.cs348_database.repository.CommentRepository;
import com.zakellyputra.cs348.cs348_database.repository.PostRepository;
import com.zakellyputra.cs348.cs348_database.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository,
                          UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CommentResponse addComment(Integer postId, CreateCommentRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setBody(request.body());

        Comment saved = commentRepository.save(comment);
        return toCommentResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> listComments(Integer postId) {
        if (!postRepository.existsById(postId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }
        return commentRepository.findByPostPostIdOrderByCreatedAtAsc(postId).stream()
                .map(this::toCommentResponse)
                .toList();
    }

    @Transactional
    public void deleteComment(Integer commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found");
        }
        commentRepository.deleteById(commentId);
    }

    private CommentResponse toCommentResponse(Comment comment) {
        return new CommentResponse(
                comment.getCommentId(), comment.getBody(),
                comment.getUser().getUsername(), comment.getCreatedAt());
    }
}
