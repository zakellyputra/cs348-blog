package com.zakellyputra.cs348.cs348_database.service;

import com.zakellyputra.cs348.cs348_database.dto.BookRequest;
import com.zakellyputra.cs348.cs348_database.dto.BookResponse;
import com.zakellyputra.cs348.cs348_database.model.Book;
import com.zakellyputra.cs348.cs348_database.model.enums.BookStatus;
import com.zakellyputra.cs348.cs348_database.repository.BookRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Transactional(readOnly = true)
    public List<BookResponse> listBooks(BookStatus status) {
        List<Book> books = (status != null)
                ? bookRepository.findByStatus(status)
                : bookRepository.findAllByOrderByCreatedAtDesc();
        return books.stream().map(this::toBookResponse).toList();
    }

    @Transactional
    public BookResponse createBook(BookRequest request) {
        Book book = new Book();
        applyRequest(book, request);
        Book saved = bookRepository.save(book);
        return toBookResponse(saved);
    }

    @Transactional
    public BookResponse updateBook(Integer id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));
        applyRequest(book, request);
        Book saved = bookRepository.save(book);
        return toBookResponse(saved);
    }

    @Transactional
    public void deleteBook(Integer id) {
        if (!bookRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found");
        }
        bookRepository.deleteById(id);
    }

    private void applyRequest(Book book, BookRequest request) {
        book.setTitle(request.title());
        book.setAuthor(request.author());
        book.setStatus(request.status());
        book.setRating(request.rating());
        book.setNotes(request.notes());
        book.setYearRead(request.yearRead());
        book.setCoverUrl(request.coverUrl());
    }

    private BookResponse toBookResponse(Book book) {
        return new BookResponse(
                book.getBookId(), book.getTitle(), book.getAuthor(),
                book.getStatus(), book.getRating(), book.getNotes(),
                book.getYearRead(), book.getCoverUrl(),
                book.getCreatedAt(), book.getUpdatedAt());
    }
}
