package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.IncomeSource;
import com.pavel.rozpocetbackend.repository.IncomeSourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomeSourceService {

    @Autowired
    private IncomeSourceRepository incomeSourceRepository;

    public IncomeSource addIncomeSource(IncomeSource incomeSource) {
        return incomeSourceRepository.save(incomeSource);
    }

    public List<IncomeSource> getAllIncomeSources() {
        return incomeSourceRepository.findAll();
    }
}