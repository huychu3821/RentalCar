package com.example.rentailcarmanagement.service;

import com.example.rentailcarmanagement.entities.Booking;
import com.example.rentailcarmanagement.payload.request.BookingRequest;
import com.example.rentailcarmanagement.payload.response.BookingResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;

public interface BookingService {
    BookingResponse addBooking(BookingRequest bookingRequest, MultipartFile fileDriver, MultipartFile file, LocalDateTime start, LocalDateTime end);

    Optional<Booking> findById(Long id);

    BookingResponse updateBooking(BookingRequest bookingRequest, Long id, MultipartFile file, MultipartFile fileDriver);

    ResponseEntity<?> getUserBooking(String userId, Integer page, Integer size, String sort);

    ResponseEntity<?> cancelBooking(Long bookingId);

    void confirmPickUp(Booking booking);
    void returnCar(Booking booking);
    void pendingPayment(Booking booking);

    ResponseEntity<?> confirmDeposit(long carId, long bookingId);

    ResponseEntity<?> confirmPayment(long carId, long bookingId);

    BookingResponse findByCar(long carId);
}
