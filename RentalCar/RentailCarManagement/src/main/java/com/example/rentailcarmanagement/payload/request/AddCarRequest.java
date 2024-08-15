package com.example.rentailcarmanagement.payload.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AddCarRequest {
    private String licensePlate;

    private String color;

    private String brand;

    private String model;

    private String productionYear;

    private String numberOfSeats;

    private String transmissionType;

    private String fuelType;

    private String mileage;

    private String fuelConsumption;

    private String address;

    private String description;

    private String[] additionRules;

    private String price;

    private String deposit;

    private String specify;

    private String city;

    private String district;

    private String ward;
}
