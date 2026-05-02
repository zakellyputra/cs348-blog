package com.zakellyputra.cs348.cs348_database.controller;

import com.zakellyputra.cs348.cs348_database.dto.CommentResponse;
import com.zakellyputra.cs348.cs348_database.dto.CreateCommentRequest;
import com.zakellyputra.cs348.cs348_database.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/api/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> addComment(@PathVariable Integer postId,
                                                       @RequestBody CreateCommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.addComment(postId, request));
    }

    @GetMapping("/api/posts/{postId}/comments")
    public ResponseEntity<List<CommentResponse>> listComments(@PathVariable Integer postId) {
        return ResponseEntity.ok(commentService.listComments(postId));
    }

    @DeleteMapping("/api/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Integer id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
