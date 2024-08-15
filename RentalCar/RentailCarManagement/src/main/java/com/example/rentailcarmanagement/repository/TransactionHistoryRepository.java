package com.example.rentailcarmanagement.repository;

import com.example.rentailcarmanagement.entities.TransactionHistory;
import com.example.rentailcarmanagement.entities.Wallet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface TransactionHistoryRepository extends BaseRepository<TransactionHistory, Integer> {

    Page<TransactionHistory> findByTransactionDateBetweenAndWallet(LocalDateTime fromDate, LocalDateTime toDate, Wallet wallet, Pageable pageable);
}
