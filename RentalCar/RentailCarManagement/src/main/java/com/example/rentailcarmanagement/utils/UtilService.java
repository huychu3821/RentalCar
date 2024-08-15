package com.example.rentailcarmanagement.utils;

import com.example.rentailcarmanagement.entities.District;
import com.example.rentailcarmanagement.entities.Province;
import com.example.rentailcarmanagement.entities.Ward;
import com.example.rentailcarmanagement.exception.BadRequest;
import com.example.rentailcarmanagement.repository.DistrictRepository;
import com.example.rentailcarmanagement.repository.ProvinceRepository;
import com.example.rentailcarmanagement.repository.WardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class UtilService {

    @Autowired
    private WardRepository wardRepository;

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private ProvinceRepository provinceRepository;

    public Ward findWardByDistrictAndProvinceAndName(String provinceName, String districtName, String wardName) {
        District district = findDistrictByProvinceAndName(provinceName, districtName);
        return wardRepository.findByDistrictAndName(district, wardName)
                .orElseThrow(() -> new BadRequest("Not found ward"));
    }

    public District findDistrictByProvinceAndName(String provinceName, String districtName) {
        Province province = findProvinceByName(provinceName);
        return districtRepository.findByProvinceAndName(province, districtName)
                .orElseThrow(() -> new BadRequest("Not found district"));
    }

    public Province findProvinceByName(String name) {
        return provinceRepository.findByName(name)
                .orElseThrow(() -> new BadRequest("Not found province"));
    }

    public String convertFromLocalDateTimeToString(LocalDateTime localDateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        return localDateTime.format(formatter);
    }
}
