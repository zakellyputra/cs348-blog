package com.zakellyputra.cs348.cs348_database.dto;

import java.time.LocalDateTime;
import java.util.List;

public record PostSummaryResponse(
    Integer postId,
    String title,
    String authorName,
    int viewCount,
    LocalDateTime createdAt,
    List<TagResponse> tags
) {}
