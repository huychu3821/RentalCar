package com.example.rentailcarmanagement.entities;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "Feedback")
@Builder
public class Feedback extends AbstractAuditor{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Double rate;

    private String content;

    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
}
