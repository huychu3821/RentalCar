package com.example.rentailcarmanagement.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class HistoryResponse {
    private LocalDate fromDate;

    private LocalDate toDate;

    private Integer page;

    private Integer size;

    private Integer totalPage;

    private List<TransactionHistoryResponse> transactionHistoryResponses;
}
