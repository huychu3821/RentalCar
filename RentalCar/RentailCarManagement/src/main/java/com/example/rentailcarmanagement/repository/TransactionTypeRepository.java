package com.example.rentailcarmanagement.repository;

import com.example.rentailcarmanagement.entities.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransactionTypeRepository extends JpaRepository<TransactionType, Integer> {

    @Query(value = "select t.id,\n" +
            "       t.e_transaction_type,\n" +
            "       t.created_by,\n" +
            "       t.created_date,\n" +
            "       t.last_modified_by,\n" +
            "       t.last_modified_date\n" +
            "from transaction_type t where t.e_transaction_type = :eTransactionType;",
            nativeQuery = true)
    Optional<TransactionType> findByETransactionType(@Param("eTransactionType") String eTransactionType);
}
