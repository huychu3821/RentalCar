package com.example.rentailcarmanagement.controller;

import com.example.rentailcarmanagement.payload.Response;
import com.example.rentailcarmanagement.payload.request.AddCarRequest;
import com.example.rentailcarmanagement.payload.request.CarStatusRequest;
import com.example.rentailcarmanagement.security.service.UserDetailsImpl;
import com.example.rentailcarmanagement.service.BookingService;
import com.example.rentailcarmanagement.service.CarService;
import com.example.rentailcarmanagement.service.FeedbackService;
import com.example.rentailcarmanagement.service.impl.FeedbackServiceImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static com.example.rentailcarmanagement.utils.SecurityUtils.getUser;

@RestController
@RequestMapping("/api/owner")
@Slf4j
public class OwnerController {

    private final ObjectMapper objectMapper;

    private final CarService carService;

    private final BookingService bookingService;
    private final FeedbackService feedbackService;

    @Autowired
    public OwnerController(ObjectMapper objectMapper, CarService carService, BookingService bookingService, FeedbackService feedbackServiceImpl) {
        this.objectMapper = objectMapper;
        this.carService = carService;
        this.bookingService = bookingService;
        this.feedbackService = feedbackServiceImpl;
    }


    @PostMapping("/add-car")
    public ResponseEntity<?> addCar(@RequestPart("data") String data, @RequestPart("registrationPaper") MultipartFile registrationPaper, @RequestPart("certificateOfInspection") MultipartFile certificateOfInspection, @RequestPart("insurance") MultipartFile insurance, @RequestPart("imageFront") MultipartFile imageFront, @RequestPart("imageBack") MultipartFile imageBack, @RequestPart("imageLeft") MultipartFile imageLeft, @RequestPart("imageRight") MultipartFile imageRight) {
        try {
            AddCarRequest userRequest = objectMapper.readValue(data, AddCarRequest.class);
            return carService.addACar(userRequest, registrationPaper, certificateOfInspection, insurance, imageFront, imageBack, imageLeft, imageRight);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Response.builder().status(HttpStatus.BAD_REQUEST.value()).isSuccess(false).body(e.getMessage()).build());
        }
    }

    @PatchMapping("/edit-car-information/{carId}")
    public ResponseEntity<?> editCarInformation(@PathVariable("carId") int carId, @RequestPart(value = "data", required = false) String data, @RequestPart(value = "imageFront", required = false) MultipartFile imageFront, @RequestPart(value = "imageBack", required = false) MultipartFile imageBack, @RequestPart(value = "imageLeft", required = false) MultipartFile imageLeft, @RequestPart(value = "imageRight", required = false) MultipartFile imageRight) {
        try {
            AddCarRequest userRequest = objectMapper.readValue(data, AddCarRequest.class);
            return carService.editCarInfo(carId, userRequest, imageFront, imageBack, imageLeft, imageRight);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Response.builder().status(HttpStatus.BAD_REQUEST.value()).isSuccess(false).body(e.getMessage()).build());
        }
    }

    @PatchMapping("/change-car-status/{carId}")
    public ResponseEntity<?> changeCarStatus(@PathVariable("carId") int carId, @RequestBody CarStatusRequest carStatusRequest) {
        try {
            return carService.changeCarStatus(carId, carStatusRequest);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Response.builder().status(HttpStatus.BAD_REQUEST.value()).isSuccess(false).body(e.getMessage()).build());
        }
    }

    @PostMapping("/confirm-deposit/{carId}/{bookingId}")
    public ResponseEntity<?> confirmDeposit(@PathVariable("carId") long carId,
                                            @PathVariable("bookingId") long bookingId) {
        try {
            return bookingService.confirmDeposit(carId, bookingId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .isSuccess(false)
                            .body(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/confirm-payment/{carId}/{bookingId}")
    public ResponseEntity<?> confirmPayment(@PathVariable("carId") long carId,
                                            @PathVariable("bookingId") long bookingId) {
        try {
            return bookingService.confirmPayment(carId, bookingId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .isSuccess(false)
                            .body(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/cars")
    @PreAuthorize("hasAuthority('OWNER')")
    public ResponseEntity<?> getOwnerCars(@RequestParam(value = "page", defaultValue = "1") int page, @RequestParam(value = "size", defaultValue = "10") int size, @RequestParam(value = "sort", defaultValue = "newest_to_latest") String sort) {
        String uid = ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();

        return carService.getOwnerCars(uid, page, size, sort);
    }

    @GetMapping("/cars/{carId}")
    @PreAuthorize("hasAnyAuthority('OWNER', 'CUSTOMER')")
    public ResponseEntity<?> getCarReviews(@PathVariable(value = "carId") Long carId, @RequestParam(value = "rate", defaultValue = "0") Double rate,
                                           @RequestParam(value = "page", defaultValue = "1") int page, @RequestParam(value = "size", defaultValue = "10") int size, @RequestParam(value = "sort", defaultValue = "newest_to_latest") String sort) {
        return feedbackService.getCarReviews(carId, rate, page, size, sort);
    }

    @GetMapping("/cars/{carId}/count-review")
    @PreAuthorize("hasAnyAuthority('OWNER', 'CUSTOMER')")
    public ResponseEntity<?> countReview(@PathVariable(value = "carId") Long carId) {
        return feedbackService.countReview(carId);
    }

    @GetMapping("/rating")
    @PreAuthorize("hasAnyAuthority('OWNER', 'CUSTOMER')")
    public ResponseEntity<?> getOwnerRating(){
        return feedbackService.getUserFeedback(getUser().getId());
    }
}
