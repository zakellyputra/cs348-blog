package com.zakellyputra.cs348.cs348_database.repository;

import com.zakellyputra.cs348.cs348_database.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByPostPostIdOrderByCreatedAtAsc(Integer postId);
}
