package com.zakellyputra.cs348.cs348_database.repository;

import com.zakellyputra.cs348.cs348_database.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Integer> {
    List<Tag> findByIsAuto(boolean isAuto);
    Optional<Tag> findByTagName(String tagName);
}
