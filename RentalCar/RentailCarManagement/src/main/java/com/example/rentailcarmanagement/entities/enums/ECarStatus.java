package com.example.rentailcarmanagement.entities.enums;

public enum ECarStatus {
    AVAILABLE("Available"),
    BOOKED("Booked"),
    STOPPED("Stopped");

    public final String label;

    ECarStatus(String label) {
        this.label = label;
    }
}
