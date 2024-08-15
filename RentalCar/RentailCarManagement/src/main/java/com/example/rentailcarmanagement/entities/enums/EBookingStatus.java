package com.example.rentailcarmanagement.entities.enums;

public enum EBookingStatus {

    PENDING_DEPOSIT("Pending Deposit"),
    PENDING_PAYMENT("Pending Payment"),
    CONFIRMED("Confirmed"),
    IN_PROGRESS("In-progress"),
    CANCELLED("Cancelled"),
    COMPLETED("Completed");
    public final String label;

    EBookingStatus(String label) {
        this.label = label;
    }
}
