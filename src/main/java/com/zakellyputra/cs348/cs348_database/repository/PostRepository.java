package com.zakellyputra.cs348.cs348_database.repository;

import com.zakellyputra.cs348.cs348_database.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Integer>,
                                        JpaSpecificationExecutor<Post> {

    @Query("SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.tags LEFT JOIN FETCH p.author ORDER BY p.createdAt DESC")
    List<Post> findAllWithTagsOrderByCreatedAtDesc();

    @Query("SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.tags LEFT JOIN FETCH p.author ORDER BY p.createdAt ASC")
    List<Post> findAllWithTagsOrderByCreatedAtAsc();

    @Query("SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.tags LEFT JOIN FETCH p.author ORDER BY p.viewCount DESC")
    List<Post> findAllWithTagsOrderByViewCountDesc();

    @Query("SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.tags LEFT JOIN FETCH p.author LEFT JOIN FETCH p.comments WHERE p.postId = :id")
    Optional<Post> findByIdWithTagsAndComments(Integer id);

    @Modifying
    @Query("UPDATE Post p SET p.viewCount = p.viewCount + 1 WHERE p.postId = :id")
    int incrementViewCount(@Param("id") Integer id);
}
