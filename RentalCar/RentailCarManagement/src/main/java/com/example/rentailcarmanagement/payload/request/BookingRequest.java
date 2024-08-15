package com.example.rentailcarmanagement.payload.request;

import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BookingRequest {
    private Long carId;

    private Long id;

    private String startDate;

    private String endDate;

    private String paymentMethod;

    private String email;

    private String name;

    private String phone;

    private LocalDate dob;

    private String nationalId;

    private String detailAddress;

    private String ward;

    private String district;

    private String city;

    private String driverLicense;

    private String nameDriver;

    private String phoneDriver;

    private LocalDate dobDriver;

    private String nationalIdDriver;

    private String detailAddressDriver;

    private String wardDriver;

    private String districtDriver;

    private String driverLicenseDriver;

    private String cityDriver;

    private String emailDriver;
}
