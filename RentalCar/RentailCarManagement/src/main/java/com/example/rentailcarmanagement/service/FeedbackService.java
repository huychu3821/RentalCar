package com.example.rentailcarmanagement.service;

import com.example.rentailcarmanagement.payload.request.FeedbackRequest;
import com.example.rentailcarmanagement.payload.response.TopCurrentFeedback;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface FeedbackService {
    List<TopCurrentFeedback> getTopCurrentFeedback();

    ResponseEntity<?> getCarReviews(Long carId, Double rate,
                                    Integer page, Integer size, String sort);
    ResponseEntity<?> countReview(Long carId);

    ResponseEntity<?> addFeedback(FeedbackRequest feedbackRequest);

    ResponseEntity<?> getUserFeedback(String uid);
}
