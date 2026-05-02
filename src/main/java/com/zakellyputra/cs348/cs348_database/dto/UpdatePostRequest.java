package com.zakellyputra.cs348.cs348_database.dto;

import java.util.List;

public record UpdatePostRequest(
    String title,
    String body,
    List<Integer> tagIds
) {}
