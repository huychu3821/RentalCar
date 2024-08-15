package com.example.rentailcarmanagement.service;

import com.example.rentailcarmanagement.entities.TransactionHistory;
import com.example.rentailcarmanagement.entities.Booking;
import com.example.rentailcarmanagement.entities.token.ResetPasswordToken;

public interface MailSendingService {
    void sendResetPasswordMail(ResetPasswordToken resetPasswordToken);
    void successfulBooking(Booking booking);

    void sendUpdateWallet(TransactionHistory saveTransaction);

    void sendCancelBookingEmail(TransactionHistory saveTransaction);
    void sendReturnCarMail(Booking booking);
}
