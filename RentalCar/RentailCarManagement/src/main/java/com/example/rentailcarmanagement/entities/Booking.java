package com.example.rentailcarmanagement.entities;

import com.example.rentailcarmanagement.entities.enums.EBookingStatus;
import com.example.rentailcarmanagement.entities.enums.EPaymentMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "Booking")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bookingNumber;

    private LocalDateTime endDate;

    private LocalDateTime startDate;

    private BigDecimal basePrice;

    private BigDecimal deposit;

    @Enumerated(EnumType.STRING)
    private EPaymentMethod paymentMethod;

    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private EBookingStatus status;

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

    private BigDecimal otherMoney;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "car_id")
    private Car car;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @OneToOne(mappedBy = "booking", fetch = FetchType.EAGER)
    private Feedback feedback;

    @OneToMany(mappedBy = "booking")
    private List<TransactionHistory> transactionHistories;
}
