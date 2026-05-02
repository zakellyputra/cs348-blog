package com.zakellyputra.cs348.cs348_database.dto;

import com.zakellyputra.cs348.cs348_database.model.enums.BookStatus;
import java.time.LocalDateTime;

public record BookResponse(
    Integer bookId,
    String title,
    String author,
    BookStatus status,
    Integer rating,
    String notes,
    Integer yearRead,
    String coverUrl,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
