package com.zakellyputra.cs348.cs348_database.dto;

import java.util.List;

public record CreatePostRequest(
    String title,
    String body,
    Integer authorId,
    List<Integer> tagIds
) {}
