package com.example.rentailcarmanagement.payload.request;

import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UserRequest {
    private String name;

    private String phone;

    private LocalDate dob;

    private String nationalId;

    private String detailAddress;

    private String ward;

    private String district;

    private String city;
}
