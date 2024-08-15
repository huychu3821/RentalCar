package com.example.rentailcarmanagement.payload.response;

import com.example.rentailcarmanagement.entities.enums.ECarStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CarResponse {

    private Long id;

    private String licensePlate;

    private String color;

    private Integer numberOfSeats;

    private Integer productionYear;

    private String transmissionType;

    private String fuelType;

    private String fuelConsumption;

    private Double mileage;

    private BigDecimal basePrice;

    private BigDecimal deposit;

    private String description;

    private String frontImage;

    private String backImage;

    private String leftImage;

    private String rightImage;

    private ECarStatus carStatus;

    private String address;

    private String ward;

    private String district;

    private String province;

    private String model;

    private String brand;

    private DocumentResponse document;

    private List<Integer> additionFunctions;

    private List<Integer> termOfUses;

    private Double rate;

    private Integer noOfRides;
}
