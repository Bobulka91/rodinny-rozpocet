package com.pavel.rozpocetbackend.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


/**
 * Konfigurace CORS (Cross-Origin Resource Sharing) pro povolení přístupu z frontendu.
 * Bez tohohle by prohlížeč blokoval požadavky z frontendu (jiná adresa/port)
 * na backend, i kdyby appka jinak fungovala správně - je to bezpečnostní
 * opatření prohlížečů proti neautorizovaným požadavkům z cizích stránek.
 */

@Configuration  // označuje tuto třídu jako konfigurační třídu Springu
public class WebConfig {

    @Bean  // označuje, že metoda vrací bean, která bude spravována Springem
    public WebMvcConfigurer corsConfigurer() {  // vrací instanci WebMvcConfigurer, která umožňuje přizpůsobit konfiguraci Spring MVC
        return new WebMvcConfigurer() {  // anonymní třída implementující WebMvcConfigurer

            @Override  // přepisuje metodu addCorsMappings, která umožňuje přidat vlastní CORS mapování
            public void addCorsMappings(CorsRegistry registry) {  // přidává CORS mapování pro všechny cesty
                registry.addMapping("/api/**") // Povolí CORS pro všechny controllery pod /api
                        .allowedOrigins(
                                "http://localhost:5173", // Výchozí port pro Vite + React / Vue (lokální vývoj)
                                "http://localhost:3000", // Výchozí port pro klasický Create React App (lokální vývoj)
                                "https://rodinny-rozpocet-frontend.onrender.com" // Nasazený frontend na Renderu - appka, kterou vidí kdokoliv na internetu
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Povolí tyto HTTP metody (GET=čtení, POST=vytvoření, PUT=úprava, DELETE=smazání, OPTIONS=preflight kontrola prohlížeče)
                        .allowedHeaders("*") // Povolí všechny HTTP hlavičky v požadavku (Content-Type, Authorization atd.)
                        .allowCredentials(true); // Povolí posílání přihlašovacích údajů/cookies mezi frontendem a backendem
            }
        };
    }
}