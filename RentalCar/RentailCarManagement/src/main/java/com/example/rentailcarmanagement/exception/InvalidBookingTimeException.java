package com.example.rentailcarmanagement.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InvalidBookingTimeException extends RuntimeException{
    @Serial
    private static final long serialVersionUID = 1L;

    private String message;
}
