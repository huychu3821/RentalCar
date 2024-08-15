package com.example.rentailcarmanagement.repository;

import com.example.rentailcarmanagement.entities.Booking;
import com.example.rentailcarmanagement.entities.Car;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends BaseRepository<Booking, Long> {
    @Query(value = "SELECT  * FROM Booking WHERE account_id = :accountId", nativeQuery = true)
    List<Booking> findByAccountId(String accountId);

    List<Booking> findByCarOrderByIdDesc(Car car);
}
