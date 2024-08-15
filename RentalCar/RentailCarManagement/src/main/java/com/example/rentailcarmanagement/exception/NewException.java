package com.example.rentailcarmanagement.exception;

import java.util.Comparator;

public class NewException extends RuntimeException {
    private Integer Integer;
    public NewException(java.lang.Integer integer) {
        Integer = integer;
    }
}
