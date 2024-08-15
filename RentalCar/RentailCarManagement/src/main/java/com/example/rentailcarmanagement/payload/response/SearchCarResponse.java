package com.example.rentailcarmanagement.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.*;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SearchCarResponse {
    private Long carId;

    private String name;

    private String frontImage;

    private String backImage;

    private String leftImage;

    private String rightImage;

    private BigDecimal price;

    private Double rating;

    private Integer numberOfRides;

    private String location;

    private String status;

    @JsonInclude(Include.NON_NULL)
    private String bookingStatus;
}
