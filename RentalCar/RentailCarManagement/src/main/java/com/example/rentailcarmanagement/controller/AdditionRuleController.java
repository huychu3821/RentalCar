package com.example.rentailcarmanagement.controller;

import com.example.rentailcarmanagement.payload.Response;
import com.example.rentailcarmanagement.service.AdditionRuleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("addition")
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class AdditionRuleController {

    @Autowired
    AdditionRuleService additionRuleService;

    @GetMapping("/addition-function")
    public ResponseEntity<?> getAllAdditionFunction() {
        return ResponseEntity.ok(
                Response.builder()
                        .status(HttpStatus.OK.value())
                        .isSuccess(true)
                        .body(additionRuleService.getAllAdditionFunction())
                        .build()
        );
    }

    @GetMapping("/term-use")
    public ResponseEntity<?> getTermOfUse() {
        return ResponseEntity.ok(
                Response.builder()
                        .status(HttpStatus.OK.value())
                        .isSuccess(true)
                        .body(additionRuleService.getAllTermOfUse())
                        .build()
        );
    }
}
