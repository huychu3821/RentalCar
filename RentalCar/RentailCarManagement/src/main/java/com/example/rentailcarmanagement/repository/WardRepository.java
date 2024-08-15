package com.example.rentailcarmanagement.repository;

import com.example.rentailcarmanagement.entities.District;
import com.example.rentailcarmanagement.entities.Ward;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WardRepository extends BaseRepository<Ward, Integer> {

    Optional<Ward> findByDistrictAndName(District district, String name);
}
