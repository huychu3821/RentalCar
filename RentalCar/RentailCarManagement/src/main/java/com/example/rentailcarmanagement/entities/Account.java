package com.example.rentailcarmanagement.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "Account")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true)
    private String email;

    private String password;

    @OneToOne
    @JoinColumn(name = "userInfo_id")
    private UserInfo userInfo;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    List<Booking> bookings;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    List<Car> cars;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    private Wallet wallet;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(  name = "account_role",
            joinColumns = @JoinColumn(name = "account_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private List<Role> roles;
}
