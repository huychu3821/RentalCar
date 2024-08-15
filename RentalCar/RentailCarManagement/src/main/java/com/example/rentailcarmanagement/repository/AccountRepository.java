package com.example.rentailcarmanagement.repository;

import com.example.rentailcarmanagement.entities.Account;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends BaseRepository<Account, String> {
    Optional<Account> findByEmail(String email);
}
