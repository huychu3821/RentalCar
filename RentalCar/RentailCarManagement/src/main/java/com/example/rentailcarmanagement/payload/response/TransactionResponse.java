package com.example.rentailcarmanagement.payload.response;

import com.example.rentailcarmanagement.entities.enums.EChangeType;
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
public class TransactionResponse {
    private BigDecimal changeAmount;

    private EChangeType changeType;

    private Long bookingId;

    private String accountId;

    private BigDecimal balance;
}
