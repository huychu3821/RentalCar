package com.example.rentailcarmanagement.repository;

import com.example.rentailcarmanagement.entities.token.ResetPasswordToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResetPasswordTokenRepository extends BaseRepository<ResetPasswordToken, Integer> {
    ResetPasswordToken findByToken(String token);
}
