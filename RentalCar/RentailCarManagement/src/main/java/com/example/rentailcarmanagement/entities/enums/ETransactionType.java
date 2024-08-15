package com.example.rentailcarmanagement.entities.enums;

import lombok.Getter;

@Getter
public enum ETransactionType {

    WITHDRAWAL("Withdraw"),
    TOP_UP("Top-up"),
    PAY_DEPOSIT("Pay deposit"),
    RECEIVE_DEPOSIT("Receive deposit"),
    REFUND_DEPOSIT("Refund deposit"),
    OFFSET_FINAL_PAYMENT("Offset final payment");

    private final String label;

    ETransactionType(String label) {
        this.label = label;
    }
}
