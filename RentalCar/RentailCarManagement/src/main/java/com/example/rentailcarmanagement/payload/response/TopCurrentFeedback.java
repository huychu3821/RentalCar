package com.example.rentailcarmanagement.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class TopCurrentFeedback {
    private String username;
    private String content;
    private Double rate;
    private LocalDateTime time;
}
