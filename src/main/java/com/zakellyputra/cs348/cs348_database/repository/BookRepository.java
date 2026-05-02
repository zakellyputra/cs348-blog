package com.zakellyputra.cs348.cs348_database.repository;

import com.zakellyputra.cs348.cs348_database.model.Book;
import com.zakellyputra.cs348.cs348_database.model.enums.BookStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Integer> {
    List<Book> findByStatus(BookStatus status);
    List<Book> findAllByOrderByCreatedAtDesc();
}
