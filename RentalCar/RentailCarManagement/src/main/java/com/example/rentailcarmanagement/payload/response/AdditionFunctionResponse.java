package com.example.rentailcarmanagement.payload.response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AdditionFunctionResponse {

    private Integer id;

    private String name;

    private String symbol;
}
