package com.example.rentailcarmanagement.repository;

import com.example.rentailcarmanagement.entities.Document;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends BaseRepository<Document, Integer> {
}
