package com.example.rentailcarmanagement.entities;

import com.example.rentailcarmanagement.entities.enums.ECarStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "Car")
@EqualsAndHashCode(callSuper = true)
public class Car extends AbstractAuditor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @Column(columnDefinition = "NVARCHAR(255)")
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ECarStatus carStatus;

    @ManyToOne
    @JoinColumn(name = "ward_id")
    private Ward ward;

    @ManyToOne
    @JoinColumn(name = "model_id")
    private Model model;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @OneToMany(mappedBy = "car")
    @ToString.Exclude
    private List<Booking> bookings;

    @OneToOne(mappedBy = "car", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Document document;

    @ManyToMany
    @JoinTable(name = "Addition_car",
            joinColumns = @JoinColumn(name = "car_id"),
            inverseJoinColumns = @JoinColumn(name = "addition_rule_id"))
    @ToString.Exclude
    private List<AdditionRule> additionRules;
}

