package com.example.rentailcarmanagement.payload.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BookingResponse {
    private Long id;

    private String bookingNumber;

    private Long carId;//

    private LocalDateTime endDate;

    private LocalDateTime startDate;

    private BigDecimal totalAmount;

    private String paymentMethod;//

    private BigDecimal basePrice;

    private BigDecimal deposit;

    private String status;//

    private String carName; //

    private String name;

    private String phone;

    private LocalDate dob;

    private String nationalId;

    private String detailAddress;

    private String ward;

    private String district;

    private String license;

    private String city;

    private String email;

    private String nameDriver;

    private String phoneDriver;

    private LocalDate dobDriver;

    private String nationalIdDriver;

    private String detailAddressDriver;

    private String wardDriver;

    private String districtDriver;

    private String driverLicense;

    private String cityDriver;

    private String emailDriver;
}
