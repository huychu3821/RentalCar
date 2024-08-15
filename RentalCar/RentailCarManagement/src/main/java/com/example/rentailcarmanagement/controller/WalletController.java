package com.example.rentailcarmanagement.controller;

import com.example.rentailcarmanagement.payload.Response;
import com.example.rentailcarmanagement.payload.request.TransactionHistoryRequest;
import com.example.rentailcarmanagement.payload.request.TransactionRequest;
import com.example.rentailcarmanagement.service.WalletService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/wallet")
@Slf4j
public class WalletController {

    @Autowired
    WalletService walletService;

    @PostMapping("/save-wallet")
    public ResponseEntity<?> save() {
        return walletService.saveWallet();
    }

    @GetMapping("/get")
    public ResponseEntity<?> getWallet() {
        return walletService.getWallet();
    }

    @PostMapping("/get-transaction")
    public ResponseEntity<?> getTransaction(@RequestBody TransactionHistoryRequest transactionHistoryRequest) {
        return ResponseEntity.ok(Response.builder()
                .status(HttpStatus.OK.value())
                .isSuccess(true)
                .body(walletService.getTransaction(transactionHistoryRequest))
                .build());
    }

    @PostMapping("save-transaction")
    public ResponseEntity<?> saveTransaction(@RequestBody TransactionRequest transactionRequest) {
        return walletService.saveTransaction(transactionRequest);
    }


}
