package com.zakellyputra.cs348.cs348_database.dto;

import com.zakellyputra.cs348.cs348_database.model.enums.BookStatus;

public record BookRequest(
    String title,
    String author,
    BookStatus status,
    Integer rating,
    String notes,
    Integer yearRead,
    String coverUrl
) {}
