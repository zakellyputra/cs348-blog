package com.zakellyputra.cs348.cs348_database.dto;

import java.time.LocalDateTime;

public record CommentResponse(
    Integer commentId,
    String body,
    String username,
    LocalDateTime createdAt
) {}
