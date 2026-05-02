package com.zakellyputra.cs348.cs348_database.repository;

import com.zakellyputra.cs348.cs348_database.model.Project;
import com.zakellyputra.cs348.cs348_database.model.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
    List<Project> findByStatus(ProjectStatus status);
    List<Project> findAllByOrderByCreatedAtDesc();
}
