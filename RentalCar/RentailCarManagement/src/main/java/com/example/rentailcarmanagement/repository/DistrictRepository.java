package com.example.rentailcarmanagement.repository;

import com.example.rentailcarmanagement.entities.District;
import com.example.rentailcarmanagement.entities.Province;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DistrictRepository extends BaseRepository<District, Integer>{

    Optional<District> findByProvinceAndName(Province province, String name);
}
