package com.example.rentailcarmanagement.service;

import com.example.rentailcarmanagement.payload.response.AdditionFunctionResponse;
import com.example.rentailcarmanagement.payload.response.TermOfUseResponse;

import java.util.List;

public interface AdditionRuleService {
    List<AdditionFunctionResponse> getAllAdditionFunction();

    List<TermOfUseResponse> getAllTermOfUse();
}
