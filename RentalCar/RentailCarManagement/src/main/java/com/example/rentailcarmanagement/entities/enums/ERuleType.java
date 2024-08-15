package com.example.rentailcarmanagement.entities.enums;

public enum ERuleType {
    ADDITION_FUNCTION("addition function"),
    TERM_OF_USE ("term of use");

    private final String label;

    ERuleType(String label) {
        this.label = label;
    }
}
