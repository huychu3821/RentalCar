package com.example.rentailcarmanagement.payload.response;

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
public class WalletResponse {

    private Integer id;

    private BigDecimal balance;

    private String accountId;
}
