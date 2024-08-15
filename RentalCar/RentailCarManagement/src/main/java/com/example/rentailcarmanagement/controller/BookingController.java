package com.example.rentailcarmanagement.controller;

import com.example.rentailcarmanagement.entities.Booking;
import com.example.rentailcarmanagement.payload.Response;
import com.example.rentailcarmanagement.payload.request.BookingRequest;
import com.example.rentailcarmanagement.payload.response.BookingResponse;
import com.example.rentailcarmanagement.service.BookingService;
import com.example.rentailcarmanagement.service.impl.BookingServiceImpl;
import com.example.rentailcarmanagement.utils.Constant;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static com.example.rentailcarmanagement.utils.SecurityUtils.getUser;

@RestController
@RequestMapping("/api/booking")
@Slf4j
public class BookingController {
    private final ObjectMapper objectMapper;
    private final BookingService bookingService;

    public BookingController(ObjectMapper objectMapper, BookingServiceImpl bookingService) {
        this.objectMapper = objectMapper;
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<?> addBooking(@RequestPart("data") String jsonRequest,
                                        @RequestPart(value = "file", required = false) MultipartFile file,
                                        @RequestPart(value = "fileDriver", required = false) MultipartFile fileDriver) {
        Map<Object, Object> error = new HashMap<>();
        try {
            BookingRequest bookingRequest = objectMapper.readValue(jsonRequest, BookingRequest.class);
            if (bookingRequest.getPhone().isEmpty() || bookingRequest.getNationalId().isEmpty() || bookingRequest.getPhoneDriver().isEmpty() || bookingRequest.getNationalIdDriver().isEmpty()) {
                log.info(Constant.ME016);
                error.put("error", Constant.ME016);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Response.builder()
                                .status(HttpStatus.BAD_REQUEST.value())
                                .isSuccess(false)
                                .error(error)
                                .body(null)
                                .build());
            }
            if (!bookingRequest.getPhone().matches(Constant.PHONE_REGEX) || !bookingRequest.getPhoneDriver().matches(Constant.PHONE_REGEX)) {
                log.info(Constant.ME017);
                error.put("error", Constant.ME017);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Response.builder()
                                .status(HttpStatus.BAD_REQUEST.value())
                                .isSuccess(false)
                                .body(null)
                                .error(error)
                                .build());
            }
            LocalDateTime start, end;
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("uuuu-MM-dd HH:mm")
                        .withResolverStyle(ResolverStyle.STRICT);
                start = LocalDateTime.parse(bookingRequest.getStartDate(), formatter);
                end = LocalDateTime.parse(bookingRequest.getEndDate(), formatter);
            } catch (DateTimeParseException e) {
                error.put("error", e.getMessage());
                log.info("Booking time error");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        Response.builder()
                                .status(HttpStatus.BAD_REQUEST.value())
                                .isSuccess(false)
                                .body(null)
                                .error(error)
                                .build());
            }
            BookingResponse bookingResponse = bookingService.addBooking(bookingRequest, file, fileDriver, start, end);
            log.info("Booking added successful");
            return ResponseEntity.status(HttpStatus.OK).body(
                    Response.builder()
                            .status(HttpStatus.OK.value())
                            .isSuccess(true)
                            .body(bookingResponse)
                            .error(error)
                            .build()
            );
        } catch (JsonProcessingException e) {
            log.info(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Response.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .isSuccess(false)
                    .body(e.getMessage())
                    .build());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Map<Object, Object> error = new HashMap<>();
        Optional<Booking> bookingOptional = bookingService.findById(id);
        if (bookingOptional.isEmpty()) {
            error.put("error", "Booking not found");
            log.info("Booking not found");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .isSuccess(false)
                            .body(null)
                            .error(error)
                            .build()
            );
        }
        return ResponseEntity.status(HttpStatus.OK).body(
                Response.builder()
                        .status(HttpStatus.OK.value())
                        .isSuccess(true)
                        .body(BookingServiceImpl.bookingResponseMapper(bookingOptional.get()))
                        .error(error)
                        .build()
        );
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable Long id,
                                           @RequestPart("data") String jsonRequest,
                                           @RequestPart(value = "file", required = false) MultipartFile file,
                                           @RequestPart(value = "fileDriver", required = false) MultipartFile fileDriver) {
        Map<Object, Object> error = new HashMap<>();
        Optional<Booking> bookingOptional = bookingService.findById(id);
        if (bookingOptional.isEmpty()) {
            error.put("error", "Booking not found");
            log.info("Booking not found");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .isSuccess(false)
                            .body(null)
                            .error(error)
                            .build()
            );
        }
        try {
            BookingRequest bookingRequest = objectMapper.readValue(jsonRequest, BookingRequest.class);
            if (bookingRequest.getPhone().isEmpty() || bookingRequest.getNationalId().isEmpty() || bookingRequest.getPhoneDriver().isEmpty() || bookingRequest.getNationalIdDriver().isEmpty()) {
                log.info(Constant.ME016);
                error.put("error", Constant.ME016);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Response.builder()
                                .status(HttpStatus.BAD_REQUEST.value())
                                .isSuccess(false)
                                .error(error)
                                .body(null)
                                .build());
            }
            if (!bookingRequest.getPhone().matches(Constant.PHONE_REGEX) || !bookingRequest.getPhoneDriver().matches(Constant.PHONE_REGEX)) {
                log.info(Constant.ME017);
                error.put("error", Constant.ME017);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Response.builder()
                                .status(HttpStatus.BAD_REQUEST.value())
                                .isSuccess(false)
                                .body(null)
                                .error(error)
                                .build());
            }
            BookingResponse bookingResponse = bookingService.updateBooking(bookingRequest, id, file, fileDriver);
            log.info("Booking updated successful");
            return ResponseEntity.status(HttpStatus.OK).body(
                    Response.builder()
                            .status(HttpStatus.OK.value())
                            .isSuccess(true)
                            .body(bookingResponse)
                            .error(error)
                            .build()
            );
        } catch (JsonProcessingException e) {
            log.info(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Response.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .isSuccess(false)
                    .body(e.getMessage())
                    .build());
        }
    }

    @GetMapping("/user")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<?> getUserBooking(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "newest_to_latest") String sort) {

        return bookingService.getUserBooking(getUser().getId(), page, size, sort);
    }

    @GetMapping("/car-id/{carId}")
    public ResponseEntity<?> getBookingByCarId(@PathVariable Long carId) {
        BookingResponse bookingResponse = bookingService.findByCar(carId);
        return ResponseEntity.ok(Response.builder()
                .status(HttpStatus.OK.value())
                .isSuccess(true)
                .body(bookingResponse)
                .build());
    }

    @PostMapping("/confirm-pick-up/{id}")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id) {
        Map<Object, Object> error = new HashMap<>();
        Optional<Booking> bookingOptional = bookingService.findById(id);
        if (bookingOptional.isEmpty()) {
            error.put("error", "Booking not found");
            log.info("Booking not found");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .isSuccess(false)
                            .body(null)
                            .error(error)
                            .build()
            );
        }
        bookingService.confirmPickUp(bookingOptional.get());
        log.info("Customer confirmed pick-up car");
        return ResponseEntity.status(HttpStatus.OK).body(
                Response.builder()
                        .status(HttpStatus.OK.value())
                        .isSuccess(true)
                        .body(null)
                        .error(error)
                        .build()
        );
    }

    @PostMapping("cancel-booking")
    public ResponseEntity<?> cancelBooking(@RequestParam(name = "booking-id") Long bookingId) {
        return bookingService.cancelBooking(bookingId);
    }

    @PostMapping("/return-car/{id}")
    public ResponseEntity<?> returnCar(@PathVariable Long id) {
        Map<Object, Object> error = new HashMap<>();
        Optional<Booking> bookingOptional = bookingService.findById(id);
        if (bookingOptional.isEmpty()) {
            error.put("error", "Booking not found");
            log.info("Booking not found");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .isSuccess(false)
                            .body(null)
                            .error(error)
                            .build()
            );
        }
        Booking booking = bookingOptional.get();
        if (booking.getAccount().getWallet().getBalance().compareTo(booking.getTotalAmount().subtract(booking.getDeposit())) < 0) {
            bookingService.pendingPayment(bookingOptional.get());
            error.put("error", Constant.ME012);
            log.info(Constant.ME012);
            return ResponseEntity.status(HttpStatus.OK).body(
                    Response.builder()
                            .status(HttpStatus.OK.value())
                            .isSuccess(true)
                            .body(null)
                            .error(error)
                            .build()
            );
        }
        bookingService.returnCar(bookingOptional.get());
        log.info("Customer returned car");
        return ResponseEntity.status(HttpStatus.OK).body(
                Response.builder()
                        .status(HttpStatus.OK.value())
                        .isSuccess(true)
                        .body(null)
                        .error(error)
                        .build()
        );
    }
}
