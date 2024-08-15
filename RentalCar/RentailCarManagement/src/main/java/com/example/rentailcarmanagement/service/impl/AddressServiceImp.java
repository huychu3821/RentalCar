package com.example.rentailcarmanagement.service.impl;

import com.example.rentailcarmanagement.payload.Response;
import com.example.rentailcarmanagement.payload.response.DistrictResponse;
import com.example.rentailcarmanagement.payload.response.ProvinceResponse;
import com.example.rentailcarmanagement.payload.response.WardResponse;
import com.example.rentailcarmanagement.repository.DistrictRepository;
import com.example.rentailcarmanagement.repository.ProvinceRepository;
import com.example.rentailcarmanagement.repository.WardRepository;
import com.example.rentailcarmanagement.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class AddressServiceImp implements AddressService {

    @Autowired
    ProvinceRepository provinceRepository;

    @Autowired
    DistrictRepository districtRepository;

    @Autowired
    WardRepository wardRepository;

    @Override
    public ResponseEntity<?> getAllAddresses() {
        List<ProvinceResponse> provinceResponseList = provinceRepository.findAll()
                .stream()
                .map(province -> ProvinceResponse.builder()
                        .id(province.getId())
                        .name(province.getName())
                        .districtResponses(
                                province.getDistricts().stream()
                                        .map(district -> DistrictResponse.builder()
                                                .id(district.getId())
                                                .name(district.getName())
                                                .wardResponses(district.getWards().stream()
                                                        .map(ward -> WardResponse.builder()
                                                                .id(ward.getId())
                                                                .name(ward.getName())
                                                                .build())
                                                        .toList()
                                                )
                                                .build())
                                        .toList()
                        )
                        .build())
                .toList();
        return ResponseEntity.ok(Response.builder()
                .status(HttpStatus.OK.value())
                .isSuccess(true)
                .body(provinceResponseList)
                .build());
    }

}
