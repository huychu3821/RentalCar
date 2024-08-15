package com.example.rentailcarmanagement.exception;

import com.example.rentailcarmanagement.payload.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return objectResponse(errors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> noMessageFound(HttpMessageNotReadableException ex) {
        return getResponseEntity(ex.getMessage());
    }

    @ExceptionHandler(DateTimeParseException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> invalidDateFormat(DateTimeParseException ex){
        return getResponseEntity("Invalid Date Time Format");
    }

    @ExceptionHandler({InvalidBookingTimeException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> invalidBookingTime(RuntimeException ex){
        return getResponseEntity(ex.getMessage());
    }

    @ExceptionHandler(NoneRecordFoundException.class )
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> noneRecords(RuntimeException ex){
        return getResponseEntity(ex.getMessage());
    }

    @ExceptionHandler(CarNotFoundException.class)
    public ResponseEntity<?> handleCarNotFoundException(CarNotFoundException ex) {
        return getResponseEntity(ex.getMessage());
    }

    @ExceptionHandler(WalletNotFoundException.class)
    public ResponseEntity<?> handleWalletNotFoundException(WalletNotFoundException ex) {
        return getResponseEntity(ex.getMessage());
    }

    @ExceptionHandler(InvalidDateException.class)
    public ResponseEntity<?> handleInvalidDateBetweenException(InvalidDateException ex) {
        return getResponseEntity(ex.getMessage());
    }

    @ExceptionHandler(BadRequest.class)
    public ResponseEntity<?> handleBadRequestException(BadRequest ex) {
        return getResponseEntity(ex.getMessage());
    }

    private ResponseEntity<?> getResponseEntity(String message) {
        Map<String, Object> errors = new HashMap<>();
        errors.put("message", message);
        errors.put("success", Boolean.FALSE);

        Response<Object> response = Response.builder()
                .isSuccess(false)
                .status(HttpStatus.BAD_REQUEST.value())
                .body(errors)
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<?> objectResponse(Object message) {
        Map<String, Object> errors = new HashMap<>();
        errors.put("message", message);
        errors.put("success", Boolean.FALSE);

        Response<Object> response = Response.builder()
                .isSuccess(false)
                .status(HttpStatus.BAD_REQUEST.value())
                .body(errors)
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

}
