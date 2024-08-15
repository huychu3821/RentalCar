package com.example.rentailcarmanagement.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TransactionHistoryRequest {

    private LocalDate fromDate;

    private LocalDate toDate;

    private Integer page;

    private Integer size;

}
