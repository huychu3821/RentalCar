package com.example.rentailcarmanagement.service;

import com.example.rentailcarmanagement.entities.Account;
import com.example.rentailcarmanagement.entities.Wallet;
import com.example.rentailcarmanagement.payload.request.TransactionHistoryRequest;
import com.example.rentailcarmanagement.payload.request.TransactionRequest;
import com.example.rentailcarmanagement.payload.response.HistoryResponse;
import org.springframework.http.ResponseEntity;

public interface WalletService {

    ResponseEntity<?> saveWallet();

    ResponseEntity<?> getWallet();

    HistoryResponse getTransaction(TransactionHistoryRequest transactionHistoryRequest);

    ResponseEntity<?> saveTransaction(TransactionRequest transactionRequest);

    Wallet save(Account account);
}
