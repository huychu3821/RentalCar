package com.example.rentailcarmanagement.payload.response;

import com.example.rentailcarmanagement.entities.enums.EChangeType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TransactionHistoryResponse {

    private Integer transactionId;

    private BigDecimal changeAmount;

    private EChangeType changeType;

    private TransactionTypeResponse transactionType;

    private LocalDateTime transactionDate;

    private Long bookingId;

    private String carName;

}
