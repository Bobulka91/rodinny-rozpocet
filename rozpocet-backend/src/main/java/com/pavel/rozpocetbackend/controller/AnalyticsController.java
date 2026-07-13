package com.pavel.rozpocetbackend.controller;

import com.pavel.rozpocetbackend.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Třída pro zpracování analytických požadavků
 */

@RestController  // Označení třídy jako REST Controller
@RequestMapping("/api/analytics")  // Základní URL pro všechny metody v tomto controlleru
public class AnalyticsController {

    @Autowired  // Automatické injektování instance AnalyticsService
    private AnalyticsService analyticsService;  // Instance služby pro analytiku

    @GetMapping("/yearly/{year}")  // Metoda pro získání roční analýzy
    public ResponseEntity<?> getYearlySummary(@PathVariable int year) {
        return ResponseEntity.ok(analyticsService.getYearlySummary(year));  // Vrácení výsledku jako HTTP 200 OK s daty roční analýzy
    }
}
