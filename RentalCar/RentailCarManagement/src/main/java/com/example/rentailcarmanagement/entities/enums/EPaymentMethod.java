package com.example.rentailcarmanagement.entities.enums;

public enum EPaymentMethod {
    CASH("CASH"),
    WALLET("WALLET"),
    BANK_TRANSFER("BANK_TRANSFER");

    public final String label;

    EPaymentMethod(String label) {
        this.label = label;
    }
}
