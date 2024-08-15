package com.example.rentailcarmanagement.payload.response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class DocumentResponse {
    private Long id;

    private String registration;

    private String certificate;

    private String insurance;
}
