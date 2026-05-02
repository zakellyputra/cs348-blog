package com.zakellyputra.cs348.cs348_database.dto;

import java.util.List;

public record ReportResponse(
    List<PostSummaryResponse> posts,
    ReportStats stats
) {
    public record ReportStats(
        int totalPosts,
        double avgViews,
        double avgComments,
        String mostActiveAuthor
    ) {}
}
