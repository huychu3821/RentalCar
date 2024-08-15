package com.example.rentailcarmanagement.controller;

import com.example.rentailcarmanagement.entities.enums.ECarStatus;
import com.example.rentailcarmanagement.exception.InvalidBookingTimeException;
import com.example.rentailcarmanagement.payload.Response;
import com.example.rentailcarmanagement.payload.request.SearchCarRequest;
import com.example.rentailcarmanagement.payload.response.CarResponse;
import com.example.rentailcarmanagement.service.CarService;
import com.example.rentailcarmanagement.utils.Constant;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.ResolverStyle;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/car")
@Slf4j
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @PreAuthorize("hasAnyAuthority('CUSTOMER', 'OWNER')")
    @GetMapping("/detail")
    public ResponseEntity<?> detail(@RequestParam("id") int id) {
        return ResponseEntity.ok(
                Response.builder()
                        .status(HttpStatus.OK.value())
                        .isSuccess(true)
                        .body(carService.getCarById(id))
                        .build()
        );
    }
    @GetMapping("/check-status")
    public ResponseEntity<?> checkStatus(@RequestParam("id") int id) {
        Map<Object, Object> error = new HashMap<>();
        CarResponse carResponse = carService.getCarById(id);
        if (carResponse.getCarStatus().equals(ECarStatus.BOOKED)){
            log.info("Car already booked!");
            error.put("error", "Car already booked!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .isSuccess(false)
                            .body(carResponse)
                            .error(error)
                            .build());
        } else if (carResponse.getCarStatus().equals(ECarStatus.STOPPED)){
            log.info("Car already stopped!");
            error.put("error", "Car already stopped!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .isSuccess(false)
                            .error(error)
                            .body(carResponse)
                            .build());
        }
        return ResponseEntity.ok(
                Response.builder()
                        .status(HttpStatus.OK.value())
                        .isSuccess(true)
                        .body(carResponse)
                        .build()
        );
    }


    @PreAuthorize("hasAuthority('CUSTOMER')")
    @PostMapping("/search")
    public ResponseEntity<?> searchCar(@Valid @RequestBody SearchCarRequest request) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("uuuu-MM-dd HH:mm")
                .withResolverStyle(ResolverStyle.STRICT);
        LocalDateTime start = LocalDateTime.parse(request.getStart(), formatter);
        LocalDateTime end = LocalDateTime.parse(request.getEnd(), formatter);

        if (start.isAfter(end) || start.isEqual(end))
            throw new InvalidBookingTimeException(Constant.ME010);

        Integer page = request.getPage() == null ? 1 : request.getPage();
        Integer size = request.getSize() == null ? 10 : request.getSize();

        return carService.searchBySelectedDate(request.getLocation(), start, end,
                page, size, request.getSort());
    }
}
