package com.example.rentailcarmanagement.entities;

import com.example.rentailcarmanagement.entities.enums.ERuleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "rule_type")
public class RuleType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ERuleType eRuleType;

    @OneToMany(mappedBy = "ruleType", fetch = FetchType.LAZY)
    private List<AdditionRule> rules;
}
