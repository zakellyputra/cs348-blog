package com.zakellyputra.cs348.cs348_database.controller;

import com.zakellyputra.cs348.cs348_database.dto.BookRequest;
import com.zakellyputra.cs348.cs348_database.dto.BookResponse;
import com.zakellyputra.cs348.cs348_database.model.enums.BookStatus;
import com.zakellyputra.cs348.cs348_database.service.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<List<BookResponse>> listBooks(
            @RequestParam(required = false) BookStatus status) {
        return ResponseEntity.ok(bookService.listBooks(status));
    }

    @PostMapping
    public ResponseEntity<BookResponse> createBook(@RequestBody BookRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.createBook(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> updateBook(@PathVariable Integer id,
                                                    @RequestBody BookRequest request) {
        return ResponseEntity.ok(bookService.updateBook(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Integer id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}
