package com.example.rentailcarmanagement.service.impl;

import com.example.rentailcarmanagement.entities.Account;
import com.example.rentailcarmanagement.entities.Booking;
import com.example.rentailcarmanagement.entities.TransactionHistory;
import com.example.rentailcarmanagement.entities.TransactionType;
import com.example.rentailcarmanagement.entities.Wallet;
import com.example.rentailcarmanagement.entities.enums.EChangeType;
import com.example.rentailcarmanagement.entities.enums.ETransactionType;
import com.example.rentailcarmanagement.exception.BadRequest;
import com.example.rentailcarmanagement.exception.InvalidDateException;
import com.example.rentailcarmanagement.exception.NotFound;
import com.example.rentailcarmanagement.exception.WalletNotFoundException;
import com.example.rentailcarmanagement.payload.Response;
import com.example.rentailcarmanagement.payload.request.TransactionHistoryRequest;
import com.example.rentailcarmanagement.payload.request.TransactionRequest;
import com.example.rentailcarmanagement.payload.response.HistoryResponse;
import com.example.rentailcarmanagement.payload.response.TransactionHistoryResponse;
import com.example.rentailcarmanagement.payload.response.TransactionResponse;
import com.example.rentailcarmanagement.payload.response.TransactionTypeResponse;
import com.example.rentailcarmanagement.payload.response.WalletResponse;
import com.example.rentailcarmanagement.repository.AccountRepository;
import com.example.rentailcarmanagement.repository.BookingRepository;
import com.example.rentailcarmanagement.repository.TransactionHistoryRepository;
import com.example.rentailcarmanagement.repository.TransactionTypeRepository;
import com.example.rentailcarmanagement.repository.WalletRepository;
import com.example.rentailcarmanagement.service.MailSendingService;
import com.example.rentailcarmanagement.service.WalletService;
import com.example.rentailcarmanagement.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class WalletServiceImp implements WalletService {

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    WalletRepository walletRepository;

    @Autowired
    TransactionHistoryRepository transactionHistoryRepository;

    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    TransactionTypeRepository transactionTypeRepository;

    @Autowired
    MailSendingService mailSendingService;

    @Override
    public ResponseEntity<?> saveWallet() {
        Account account = accountRepository.findById(SecurityUtils.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("Not_found_user"));
        Wallet savedWallet = save(account);
        return ResponseEntity.ok(
                Response.builder()
                        .status(HttpStatus.OK.value())
                        .isSuccess(true)
                        .body(WalletResponse.builder()
                                .id(savedWallet.getId())
                                .balance(savedWallet.getBalance())
                                .accountId(account.getId())
                                .build())
                        .build()
        );
    }


    @Override
    public ResponseEntity<?> getWallet() {
        Account account = accountRepository.findByEmail(SecurityUtils.getUser().getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Not_found_user"));

        Wallet wallet = walletRepository.findByAccount(account)
                .orElseThrow(() -> new WalletNotFoundException("Not_found_wallet"));

        return ResponseEntity.ok(
                Response.builder()
                        .status(HttpStatus.OK.value())
                        .isSuccess(true)
                        .body(WalletResponse.builder()
                                .id(wallet.getId())
                                .balance(wallet.getBalance())
                                .accountId(account.getId())
                                .build())
                        .build()
        );
    }

    @Override
    public HistoryResponse getTransaction(TransactionHistoryRequest transactionHistoryRequest) {

        Account account = accountRepository.findByEmail(SecurityUtils.getUser().getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Not_found_user"));

        Wallet wallet = walletRepository.findByAccount(account)
                .orElseThrow(() -> new WalletNotFoundException("Not_found_wallet"));

        if (transactionHistoryRequest.getToDate() == null) {
            transactionHistoryRequest.setToDate(LocalDate.now());
        }
        if (transactionHistoryRequest.getFromDate() == null) {
            transactionHistoryRequest.setFromDate(LocalDate.now().minusMonths(1L));
        }
        if (transactionHistoryRequest.getToDate().isBefore(transactionHistoryRequest.getFromDate())) {
            throw new InvalidDateException("From Date must before To Date");
        }
        if (transactionHistoryRequest.getPage() == null) {
            transactionHistoryRequest.setPage(0);
        }
        if (transactionHistoryRequest.getSize() == null) {
            transactionHistoryRequest.setSize(10);
        }

        Pageable pageable = PageRequest.of(transactionHistoryRequest.getPage(), transactionHistoryRequest.getSize());

        Page<TransactionHistory> transactionHistoryPage = transactionHistoryRepository.findByTransactionDateBetweenAndWallet(
                transactionHistoryRequest.getFromDate().atStartOfDay(),
                transactionHistoryRequest.getToDate().plusDays(1).atStartOfDay(),
                wallet,
                pageable);

        List<TransactionHistoryResponse> transactionHistoryResponses = transactionHistoryPage.getContent()
                .stream()
                .map(transactionHistory -> TransactionHistoryResponse.builder()
                        .transactionId(transactionHistory.getId())
                        .changeAmount(transactionHistory.getChangeAmount())
                        .changeType(transactionHistory.getChangeType())
                        .transactionType(TransactionTypeResponse.builder()
                                .id(transactionHistory.getTransactionType().getId())
                                .eTransactionType(transactionHistory.getTransactionType().getETransactionType().getLabel())
                                .build())
                        .transactionDate(transactionHistory.getTransactionDate())
                        .bookingId(transactionHistory.getBooking() != null ? transactionHistory.getBooking().getId() : null)
                        .carName(transactionHistory.getBooking() != null ?
                                transactionHistory.getBooking().getCar().getModel().getBrand().getName() + " " + transactionHistory.getBooking().getCar().getModel().getName()
                                : null)

                        .build())
                .toList();
        return HistoryResponse.builder()
                .fromDate(transactionHistoryRequest.getFromDate())
                .toDate(transactionHistoryRequest.getToDate())
                .page(transactionHistoryRequest.getPage())
                .size(transactionHistoryRequest.getSize())
                .totalPage(transactionHistoryPage.getTotalPages())
                .transactionHistoryResponses(transactionHistoryResponses)
                .build();
    }

    @Override
    public ResponseEntity<?> saveTransaction(TransactionRequest transactionRequest) {
        Account account = accountRepository.findById(transactionRequest.getAccountId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Wallet wallet = walletRepository.findByAccount(account)
                .orElseThrow(() -> new WalletNotFoundException("Wallet not found"));

        if (transactionRequest.getChangeType().equals(EChangeType.DECREASE) &&
                transactionRequest.getChangeAmount().compareTo(wallet.getBalance()) > 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .isSuccess(false)
                            .body("Change amount is higher than balance can handle")
                            .build()
            );
        }

        TransactionType transactionType = transactionTypeRepository.findByETransactionType(transactionRequest.getTransactionType().toString())
                .orElseThrow(() -> new BadRequest("Transaction type not found"));

        TransactionHistory transactionHistory = TransactionHistory.builder()
                .changeAmount(transactionRequest.getChangeAmount())
                .changeType(transactionRequest.getChangeType())
                .transactionDate(LocalDateTime.now())
                .transactionType(transactionType)
                .wallet(wallet)
                .build();

        if (transactionRequest.getBookingId() != null) {
            Booking booking = bookingRepository.findById(transactionRequest.getBookingId())
                    .orElseThrow(() -> new NotFound("Not found booking"));
            transactionHistory.setBooking(booking);
        }
        if (transactionRequest.getChangeType().equals(EChangeType.INCREASE)) {
            if (transactionRequest.getTransactionType().equals(ETransactionType.RECEIVE_DEPOSIT)) {
                wallet.setDepositBalance(wallet.getDepositBalance().add(transactionRequest.getChangeAmount()));
            } else {
                wallet.setBalance(wallet.getBalance().add(transactionRequest.getChangeAmount()));
            }
        } else {
            if (transactionRequest.getTransactionType().equals(ETransactionType.REFUND_DEPOSIT)) {
                wallet.setDepositBalance(wallet.getDepositBalance().subtract(transactionRequest.getChangeAmount()));
            } else {
                wallet.setBalance(wallet.getBalance().subtract(transactionRequest.getChangeAmount()));
            }
        }

        TransactionHistory saveTransaction = transactionHistoryRepository.save(transactionHistory);
        Wallet saveWallet = walletRepository.save(wallet);
        TransactionResponse response = TransactionResponse.builder()
                .changeAmount(saveTransaction.getChangeAmount())
                .changeType(saveTransaction.getChangeType())
                .bookingId(saveTransaction.getBooking() != null ? saveTransaction.getBooking().getId() : null)
                .accountId(saveTransaction.getWallet().getAccount().getId())
                .balance(saveWallet.getBalance())
                .build();
        if(transactionRequest.getTransactionType().equals(ETransactionType.REFUND_DEPOSIT)) {
            mailSendingService.sendCancelBookingEmail(saveTransaction);
        } else {
            mailSendingService.sendUpdateWallet(saveTransaction);
        }


        return ResponseEntity.ok(
                Response.builder()
                        .status(HttpStatus.OK.value())
                        .isSuccess(true)
                        .body(response)
                        .build()
        );
    }

    @Override
    public Wallet save(Account account) {
        Wallet wallet = Wallet.builder()
                .account(account)
                .balance(BigDecimal.valueOf(0))
                .depositBalance(BigDecimal.valueOf(0))
                .build();
        return walletRepository.save(wallet);
    }
}
