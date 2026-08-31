package com.pavel.rozpocetbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entita reprezentující jeden rozpočtový plán pro konkrétní skupinu, měsíc a rok.
 * Např. "Fixní náklady - naplánováno 25000 Kč na červen 2026".
 */
@Entity              // Říká Hibernate, že tahle třída = databázová tabulka "plan"
@Getter              // Lombok: automaticky vygeneruje gettery pro všechny fieldy
@Setter              // Lombok: automaticky vygeneruje settery pro všechny fieldy
@NoArgsConstructor   // Lombok: prázdný konstruktor (Hibernate ho vyžaduje)
@AllArgsConstructor  // Lombok: konstruktor se všemi parametry
public class Plan {

  @Id                                                    // Označuje primární klíč (jednoznačné ID záznamu)
  @GeneratedValue(strategy = GenerationType.IDENTITY)     // ID generuje přímo MySQL (AUTO_INCREMENT)
  private Long id;

  private String planGroup;      // Skupina, na kterou se plán vztahuje - "Fixní náklady", "Předplatné"...
  private Double plannedAmount;  // Kolik jsem si na tuhle skupinu naplánoval utratit
  private Integer year;          // Rok platnosti plánu
  private Integer month;         // Měsíc platnosti plánu (1-12)
}