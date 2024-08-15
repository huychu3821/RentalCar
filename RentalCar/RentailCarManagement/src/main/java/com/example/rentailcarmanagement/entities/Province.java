package com.example.rentailcarmanagement.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "Province")
@Builder
@ToString
public class Province {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", columnDefinition = "NVARCHAR(255)")
    private String name;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "province", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<District> districts;
}
