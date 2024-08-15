package com.example.rentailcarmanagement.exception;

public class ForbiddenError  extends RuntimeException {
    public ForbiddenError(String message) {
        super(message);
    }
}