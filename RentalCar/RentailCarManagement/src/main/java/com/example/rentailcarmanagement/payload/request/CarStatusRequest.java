package com.example.rentailcarmanagement.payload.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CarStatusRequest {
    private String status;
}
