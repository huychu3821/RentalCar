package com.example.rentailcarmanagement.service.impl;

import com.example.rentailcarmanagement.repository.ProvinceRepository;
import com.example.rentailcarmanagement.service.ProvinceService;
import jakarta.persistence.Tuple;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProvinceServiceImpl implements ProvinceService {

    private final ProvinceRepository provinceRepository;

    public ProvinceServiceImpl(ProvinceRepository provinceRepository) {
        this.provinceRepository = provinceRepository;
    }

    @Override
    public Map<String, String> getTopProvinces() {
        List<Tuple> topProvinces = provinceRepository.findTopProvincesWithMostCars();
        return topProvinces.stream().collect(Collectors.toMap(
                tuple -> {
                    String name = tuple.get(0).toString();
                    if (name.startsWith("Thành phố")) {
                        name = name.substring(10).trim();
                    } else if (name.startsWith("Tỉnh")) {
                        name = name.substring(4).trim();
                    }
                    return name;
                },
                tuple -> (((Number) tuple.get(1)).intValue() / 10 * 10) + "+ cars"
                ,
                (existing, replacement) -> existing,
                LinkedHashMap::new
        ));
    }
}
