package com.example.rentailcarmanagement.exception;


public class ServerError extends RuntimeException {
    public ServerError(String message) {
        super(message);
    }
}