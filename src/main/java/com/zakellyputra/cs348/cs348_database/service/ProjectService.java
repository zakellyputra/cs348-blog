package com.zakellyputra.cs348.cs348_database.service;

import com.zakellyputra.cs348.cs348_database.dto.ProjectRequest;
import com.zakellyputra.cs348.cs348_database.dto.ProjectResponse;
import com.zakellyputra.cs348.cs348_database.model.Project;
import com.zakellyputra.cs348.cs348_database.model.enums.ProjectStatus;
import com.zakellyputra.cs348.cs348_database.repository.ProjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> listProjects(ProjectStatus status) {
        List<Project> projects = (status != null)
                ? projectRepository.findByStatus(status)
                : projectRepository.findAllByOrderByCreatedAtDesc();
        return projects.stream().map(this::toProjectResponse).toList();
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        Project project = new Project();
        applyRequest(project, request);
        Project saved = projectRepository.save(project);
        return toProjectResponse(saved);
    }

    @Transactional
    public ProjectResponse updateProject(Integer id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        applyRequest(project, request);
        Project saved = projectRepository.save(project);
        return toProjectResponse(saved);
    }

    @Transactional
    public void deleteProject(Integer id) {
        if (!projectRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
        }
        projectRepository.deleteById(id);
    }

    private void applyRequest(Project project, ProjectRequest request) {
        project.setTitle(request.title());
        project.setDescription(request.description());
        project.setRepoUrl(request.repoUrl());
        project.setLiveUrl(request.liveUrl());
        project.setTechStack(request.techStack());
        project.setStatus(request.status());
        project.setSource(request.source());
    }

    private ProjectResponse toProjectResponse(Project project) {
        return new ProjectResponse(
                project.getProjectId(), project.getTitle(), project.getDescription(),
                project.getRepoUrl(), project.getLiveUrl(), project.getTechStack(),
                project.getStatus(), project.getSource(),
                project.getCreatedAt(), project.getUpdatedAt());
    }
}
