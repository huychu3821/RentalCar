package com.example.rentailcarmanagement.service.impl;

import com.example.rentailcarmanagement.entities.enums.ERuleType;
import com.example.rentailcarmanagement.payload.response.AdditionFunctionResponse;
import com.example.rentailcarmanagement.payload.response.TermOfUseResponse;
import com.example.rentailcarmanagement.repository.AdditionRuleRepository;
import com.example.rentailcarmanagement.repository.RuleTypeRepository;
import com.example.rentailcarmanagement.service.AdditionRuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdditionRuleServiceImp implements AdditionRuleService {
    @Autowired
    RuleTypeRepository ruleTypeRepository;

    @Autowired
    AdditionRuleRepository additionRuleRepository;

    @Override
    public List<AdditionFunctionResponse> getAllAdditionFunction() {
        return additionRuleRepository.findAll()
                .stream().filter(additionRule -> additionRule.getRuleType().getERuleType().equals(ERuleType.ADDITION_FUNCTION))
                .map(additionRule -> AdditionFunctionResponse.builder()
                        .id(additionRule.getId())
                        .name(additionRule.getName())
                        .symbol(additionRule.getSymbol())
                        .build())
                .toList();
    }

    @Override
    public List<TermOfUseResponse> getAllTermOfUse() {
        return additionRuleRepository.findAll()
                .stream().filter(additionRule -> additionRule.getRuleType().getERuleType().equals(ERuleType.TERM_OF_USE))
                .map(additionRule -> TermOfUseResponse.builder()
                        .id(additionRule.getId())
                        .name(additionRule.getName())
                        .symbol(additionRule.getSymbol())
                        .build())
                .toList();
    }

}
