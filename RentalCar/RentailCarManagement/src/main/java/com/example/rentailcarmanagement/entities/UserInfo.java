package com.example.rentailcarmanagement.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "UserInfo")
public class UserInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    //, unique = true
    private String name;

    @Column(nullable = false)
    private String phone;

    private LocalDate dob;

    private String nationalId;

    private String driverLicense;

    private String detailAddress;

    private boolean isUpdated = false;

    @ManyToOne
    @JoinColumn(name = "ward_id")
    private Ward ward;

    @OneToOne(mappedBy = "userInfo", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Account account;

}
