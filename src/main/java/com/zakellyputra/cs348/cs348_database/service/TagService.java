package com.zakellyputra.cs348.cs348_database.service;

import com.zakellyputra.cs348.cs348_database.dto.CreateTagRequest;
import com.zakellyputra.cs348.cs348_database.dto.TagResponse;
import com.zakellyputra.cs348.cs348_database.model.Tag;
import com.zakellyputra.cs348.cs348_database.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Transactional(readOnly = true)
    public List<TagResponse> listTags(String type) {
        List<Tag> tags = switch (type) {
            case "auto" -> tagRepository.findByIsAuto(true);
            case "manual" -> tagRepository.findByIsAuto(false);
            default -> tagRepository.findAll();
        };
        return tags.stream()
                .map(t -> new TagResponse(t.getTagId(), t.getTagName(), t.isAuto()))
                .toList();
    }

    @Transactional
    public TagResponse createTag(CreateTagRequest request) {
        Tag tag = new Tag();
        tag.setTagName(request.tagName());
        tag.setAuto(false);
        Tag saved = tagRepository.save(tag);
        return new TagResponse(saved.getTagId(), saved.getTagName(), saved.isAuto());
    }
}
