package com.zakellyputra.cs348.cs348_database.dto;

import java.time.LocalDateTime;
import java.util.List;

public record PostResponse(
    Integer postId,
    String title,
    String body,
    String authorName,
    Integer authorId,
    int viewCount,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    List<TagResponse> tags,
    List<CommentResponse> comments
) {}
