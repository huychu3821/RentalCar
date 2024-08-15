package com.example.rentailcarmanagement.payload.response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TermOfUseResponse {
    private Integer id;

    private String name;

    private String symbol;
}
