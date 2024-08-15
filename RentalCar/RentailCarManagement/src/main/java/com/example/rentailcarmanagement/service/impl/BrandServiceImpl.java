package com.example.rentailcarmanagement.service.impl;

import com.example.rentailcarmanagement.payload.Response;
import com.example.rentailcarmanagement.payload.response.BrandResponse;
import com.example.rentailcarmanagement.payload.response.ModelResponse;
import com.example.rentailcarmanagement.repository.BrandRepository;
import com.example.rentailcarmanagement.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    @Autowired
    public BrandServiceImpl(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @Override
    public ResponseEntity<?> getAllBrands() {
        List<BrandResponse> brandResponseList = brandRepository.findAll()
                .stream()
                .map(brand -> BrandResponse.builder()
                        .id(brand.getId())
                        .name(brand.getName())
                        .modelResponses(
                                brand.getModels().stream()
                                        .map(model -> ModelResponse.builder()
                                                .id(model.getId())
                                                .name(model.getName())
                                                .build())
                                        .toList()
                        )
                        .build())
                .toList();
        return ResponseEntity.ok(Response.builder()
                .status(HttpStatus.OK.value())
                .isSuccess(true)
                .body(brandResponseList)
                .build());
    }
}
