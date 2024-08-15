package com.example.rentailcarmanagement.controller;

import com.example.rentailcarmanagement.service.AddressService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/address")
@Slf4j
public class AddressController {

    @Autowired
    AddressService addressService;

    @GetMapping()
    public ResponseEntity<?> getAllAddresses() {
        return addressService.getAllAddresses();
    }
}
