package com.example.rentailcarmanagement.repository;

import com.example.rentailcarmanagement.entities.Province;
import jakarta.persistence.Tuple;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProvinceRepository extends BaseRepository<Province, Integer> {
    Optional<Province> findByName(String name);

    @Query(value = "SELECT TOP 6 province.name AS province_id, COUNT(car.id) AS car_count\n" +
            "FROM car\n" +
            "JOIN ward ON car.ward_id = ward.id\n" +
            "JOIN district ON ward.district_id = district.id\n" +
            "JOIN province ON district.province_id = province.id\n" +
            "GROUP BY province.id, province.name\n" +
            "ORDER BY car_count DESC", nativeQuery = true)
    List<Tuple> findTopProvincesWithMostCars();
}
