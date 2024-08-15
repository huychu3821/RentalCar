package com.example.rentailcarmanagement.payload.response;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BrandResponse {
    private Integer id;

    private String name;

    private List<ModelResponse> modelResponses;
}
