package com.example.rentailcarmanagement.payload.request;

import com.example.rentailcarmanagement.utils.Constant;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class SearchCarRequest {
    @NotBlank(message = Constant.ME007)
    private String location;

    @NotBlank(message = Constant.ME008)
    private String start;

    @NotBlank(message = Constant.ME009)
    private String end;

    private String sort;

    private Integer page;

    private Integer size;
}
