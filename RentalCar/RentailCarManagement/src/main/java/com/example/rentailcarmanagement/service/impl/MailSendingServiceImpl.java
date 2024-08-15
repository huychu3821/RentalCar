package com.example.rentailcarmanagement.service.impl;

import com.example.rentailcarmanagement.entities.Booking;
import com.example.rentailcarmanagement.entities.TransactionHistory;
import com.example.rentailcarmanagement.entities.token.ResetPasswordToken;
import com.example.rentailcarmanagement.service.MailSendingService;
import com.example.rentailcarmanagement.utils.Constant;
import com.example.rentailcarmanagement.utils.UtilService;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class MailSendingServiceImpl implements MailSendingService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    private final UtilService utilService;

    public MailSendingServiceImpl(JavaMailSender mailSender, TemplateEngine templateEngine, UtilService utilService) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.utilService = utilService;
    }

    @Override
    @Async
    public void sendResetPasswordMail(ResetPasswordToken resetPasswordToken) {
        try {
            Context context = new Context();
            context.setVariable("link", Constant.FE_URL + "/auth/forgot-password-token/" + resetPasswordToken.getToken());
            context.setVariable("email", resetPasswordToken.getEmail());
            String text = templateEngine.process("EM01.html", context);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setPriority(1);
            helper.setSubject("Rent-a-car Password Reset");
            helper.setFrom("beanbhlc2002@gmail.com");
            helper.setTo(resetPasswordToken.getEmail());
            helper.setText(text, true);
            mailSender.send(message);
            log.info("Forgot password mail sent!");
        } catch (Exception e) {
            log.info(e.getMessage());
        }
    }

    @Override
    @Async
    public void sendUpdateWallet(TransactionHistory saveTransaction) {
        try {
            Context context = new Context();
            context.setVariable("wallet", Constant.FE_URL + "/ewallet/get");
            context.setVariable("date", utilService.convertFromLocalDateTimeToString(saveTransaction.getTransactionDate()));
            String text = templateEngine.process("EM05.html", context);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setPriority(1);
            helper.setSubject("There’s an update to your wallet.");
            helper.setFrom("beanbhlc2002@gmail.com");
            helper.setTo(saveTransaction.getWallet().getAccount().getEmail());
            helper.setText(text, true);
            mailSender.send(message);
            log.info("Update balance wallet mail sent!");
        } catch (Exception e) {
            log.info(e.getMessage());
        }
    }

    @Override
    @Async
    public void sendCancelBookingEmail(TransactionHistory saveTransaction) {
        try {
            Context context = new Context();
            context.setVariable("name", saveTransaction.getBooking().getCar().getModel().getBrand().getName() + " " + saveTransaction.getBooking().getCar().getModel().getName());
            context.setVariable("cancelDate", utilService.convertFromLocalDateTimeToString(saveTransaction.getTransactionDate()));
            String text = templateEngine.process("EM03.html", context);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setPriority(1);
            helper.setSubject("A booking with your car has been cancelled.");
            helper.setFrom("beanbhlc2002@gmail.com");
            helper.setTo(saveTransaction.getWallet().getAccount().getEmail());
            helper.setText(text, true);
            mailSender.send(message);
            log.info("Cancel booking mail sent!");
        } catch (Exception e) {
            log.info(e.getMessage());
        }
    }

    @Override
    @Async
    public void successfulBooking(Booking booking) {
        try {
            Context context = new Context();
            context.setVariable("carName", booking.getCar().getModel().getName() + booking.getCar().getModel().getBrand().getName());
            context.setVariable("bookingDate", booking.getStartDate());
            context.setVariable("walletLink", Constant.FE_URL + "/ewallet/get");
            context.setVariable("carDetailLink", Constant.FE_URL + "/owner/edit-car-information/" + booking.getCar().getId());
            String text = templateEngine.process("EM02.html",context);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setPriority(1);
            helper.setSubject("Your car has been booked");
            helper.setFrom("beanbhlc2002@gmail.com");
            helper.setTo(booking.getCar().getAccount().getEmail());
            helper.setText(text, true);
            mailSender.send(message);
            log.info("Successful booking mail sent!");
        } catch (Exception e) {
            log.info(e.getMessage());
        }
    }


    @Override
    @Async
    public void sendReturnCarMail(Booking booking) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        try {
            Context context = new Context();
            context.setVariable("carName", booking.getCar().getModel().getName() + booking.getCar().getModel().getBrand().getName());
            context.setVariable("bookingDate", LocalDateTime.now().format(formatter));
            context.setVariable("walletLink", Constant.FE_URL + "/ewallet/get");
            context.setVariable("carDetailLink", Constant.FE_URL + "/owner/edit-car-information/" + booking.getCar().getId());
            String text = templateEngine.process("EM04.html",context);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setPriority(1);
            helper.setSubject("Your car has been returned");
            helper.setFrom("beanbhlc2002@gmail.com");
            helper.setTo(booking.getCar().getAccount().getEmail());
            helper.setText(text, true);
            mailSender.send(message);
            log.info("Successful booking mail sent!");
        } catch (Exception e) {
            log.info(e.getMessage());
        }
    }
}
