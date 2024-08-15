package com.example.rentailcarmanagement.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FeedBackResponse {
    private Long id;

    private String userName;

    private String carName;

    private String content;

    private Double rate;

    private String start;

    private String end;

    private String lastModified;
}
