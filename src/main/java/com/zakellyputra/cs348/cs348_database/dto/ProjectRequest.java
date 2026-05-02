package com.zakellyputra.cs348.cs348_database.dto;

import com.zakellyputra.cs348.cs348_database.model.enums.ProjectSource;
import com.zakellyputra.cs348.cs348_database.model.enums.ProjectStatus;

public record ProjectRequest(
    String title,
    String description,
    String repoUrl,
    String liveUrl,
    String techStack,
    ProjectStatus status,
    ProjectSource source
) {}
