package com.zakellyputra.cs348.cs348_database.dto;

public record UserResponse(
    Integer userId,
    String username,
    String email,
    String roleName
) {}
