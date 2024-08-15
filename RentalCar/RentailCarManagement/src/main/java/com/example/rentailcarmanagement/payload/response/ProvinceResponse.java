package com.example.rentailcarmanagement.payload.response;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProvinceResponse {
    private Integer id;

    private String name;

    private List<DistrictResponse> districtResponses;
}
