package com.example.rentailcarmanagement.controller;

import com.example.rentailcarmanagement.payload.request.FeedbackRequest;
import com.example.rentailcarmanagement.service.FeedbackService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer")
@Slf4j
public class CustomerController {
    private final FeedbackService feedbackService;

    public CustomerController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping("/feedback")
    public ResponseEntity<?> feedback(@RequestBody FeedbackRequest feedbackRequest) {
        return feedbackService.addFeedback(feedbackRequest);
    }
}
