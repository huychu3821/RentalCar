package com.example.rentailcarmanagement.entities.token;

import ch.qos.logback.classic.spi.LoggingEventVO;
import com.example.rentailcarmanagement.entities.Account;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
public class ResetPasswordToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String token;
    private String email;
    private LocalDateTime expiryTime = LocalDateTime.now().plusHours(24);
    public boolean isExpired(){
        return LocalDateTime.now().isAfter(expiryTime);
    }
}
