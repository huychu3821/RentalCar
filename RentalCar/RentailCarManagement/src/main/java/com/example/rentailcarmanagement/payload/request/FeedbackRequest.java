package com.example.rentailcarmanagement.payload.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class FeedbackRequest {
    private Integer bookingId;
    private Double rate;
    private String content;
}
