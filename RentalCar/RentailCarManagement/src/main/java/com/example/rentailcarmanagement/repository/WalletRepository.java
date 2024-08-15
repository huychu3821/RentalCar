package com.example.rentailcarmanagement.repository;

import com.example.rentailcarmanagement.entities.Account;
import com.example.rentailcarmanagement.entities.Wallet;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletRepository extends BaseRepository<Wallet, Integer>{

    Optional<Wallet> findByAccount(Account account);
}
