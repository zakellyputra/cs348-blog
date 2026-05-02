package com.zakellyputra.cs348.cs348_database.controller;

import com.zakellyputra.cs348.cs348_database.dto.ReportResponse;
import com.zakellyputra.cs348.cs348_database.service.PostService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/report")
public class ReportController {

    private final PostService postService;

    public ReportController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<ReportResponse> getReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Integer tagId,
            @RequestParam(required = false) Integer authorId) {
        return ResponseEntity.ok(postService.getReport(startDate, endDate, tagId, authorId));
    }
}
