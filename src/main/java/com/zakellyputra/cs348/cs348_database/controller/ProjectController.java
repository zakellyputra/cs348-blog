package com.zakellyputra.cs348.cs348_database.controller;

import com.zakellyputra.cs348.cs348_database.dto.ProjectRequest;
import com.zakellyputra.cs348.cs348_database.dto.ProjectResponse;
import com.zakellyputra.cs348.cs348_database.model.enums.ProjectStatus;
import com.zakellyputra.cs348.cs348_database.service.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> listProjects(
            @RequestParam(required = false) ProjectStatus status) {
        return ResponseEntity.ok(projectService.listProjects(status));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody ProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Integer id,
                                                          @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Integer id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
