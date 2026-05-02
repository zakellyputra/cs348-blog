package com.zakellyputra.cs348.cs348_database.controller;

import com.zakellyputra.cs348.cs348_database.dto.CreateTagRequest;
import com.zakellyputra.cs348.cs348_database.dto.TagResponse;
import com.zakellyputra.cs348.cs348_database.service.TagService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<List<TagResponse>> listTags(
            @RequestParam(defaultValue = "all") String type) {
        return ResponseEntity.ok(tagService.listTags(type));
    }

    @PostMapping
    public ResponseEntity<TagResponse> createTag(@RequestBody CreateTagRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tagService.createTag(request));
    }
}
