package com.example.rentailcarmanagement.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingListResponse {
    private String frontImage;

    private String backImage;

    private String leftImage;

    private String rightImage;

    private String name;

    private String pickUpDateTime;

    private String returnDateTime;

    private Long numberOfDays;

    private BigDecimal basePrice;

    private BigDecimal total;

    private BigDecimal deposit;

    private String bookingNumber;

    private String status;

    private Long id;
}
