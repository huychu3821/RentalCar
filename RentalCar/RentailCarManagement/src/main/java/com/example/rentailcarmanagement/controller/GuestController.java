package com.example.rentailcarmanagement.controller;

import com.example.rentailcarmanagement.payload.Response;
import com.example.rentailcarmanagement.service.FeedbackService;
import com.example.rentailcarmanagement.service.ProvinceService;
import com.example.rentailcarmanagement.service.impl.FeedbackServiceImpl;
import com.example.rentailcarmanagement.service.impl.ProvinceServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/guest")
public class GuestController {

    private final ProvinceService provinceService;
    private final FeedbackService feedbackService;

    public GuestController(ProvinceServiceImpl provinceServiceImpl, FeedbackServiceImpl feedbackServiceImpl) {
        this.provinceService = provinceServiceImpl;
        this.feedbackService = feedbackServiceImpl;
    }

    @GetMapping("/top-province")
    public ResponseEntity<?> getTopProvince(){
        return ResponseEntity.ok(Response.builder()
                .status(HttpStatus.OK.value())
                .isSuccess(true)
                .body(provinceService.getTopProvinces())
                .build());
    }

    @GetMapping("/top-recent-rating")
    public ResponseEntity<?> getTopRecentRating(){
        Response<Object> response = Response.builder()
                .isSuccess(true)
                .status(HttpStatus.OK.value())
                .body(feedbackService.getTopCurrentFeedback())
                .build();

        return ResponseEntity.ok(response);
    }
}
