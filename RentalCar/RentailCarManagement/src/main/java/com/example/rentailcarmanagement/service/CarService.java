package com.example.rentailcarmanagement.service;

import com.example.rentailcarmanagement.payload.request.AddCarRequest;
import com.example.rentailcarmanagement.payload.request.CarStatusRequest;
import com.example.rentailcarmanagement.payload.response.CarResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

public interface CarService {

    CarResponse getCarById(long id);

    ResponseEntity<?> searchBySelectedDate(String location, LocalDateTime start, LocalDateTime end,
                                  Integer page, Integer size, String sort);

    ResponseEntity<?> getOwnerCars(String userId, Integer page, Integer size, String sort);

    ResponseEntity<?> addACar(AddCarRequest addCarRequest,
                              MultipartFile registrationPaper,
                              MultipartFile certificateOfInspection,
                              MultipartFile insurance,
                              MultipartFile imageFront,
                              MultipartFile imageBack,
                              MultipartFile imageLeft,
                              MultipartFile imageRight);

    ResponseEntity<?> editCarInfo(long id,
                                  AddCarRequest addCarRequest,
                                  MultipartFile imageFront,
                                  MultipartFile imageBack,
                                  MultipartFile imageLeft,
                                  MultipartFile imageRight);

    ResponseEntity<?> changeCarStatus(long id, CarStatusRequest carStatusRequest);
}
