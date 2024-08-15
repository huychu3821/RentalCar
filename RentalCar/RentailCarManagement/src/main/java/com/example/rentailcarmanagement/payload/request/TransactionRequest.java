package com.example.rentailcarmanagement.payload.request;

import com.example.rentailcarmanagement.entities.enums.EChangeType;
import com.example.rentailcarmanagement.entities.enums.ETransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TransactionRequest {

    private BigDecimal changeAmount;

    private EChangeType changeType;

    private ETransactionType transactionType;

    private Long bookingId;

    private String accountId;
}
