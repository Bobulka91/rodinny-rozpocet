package com.pavel.rozpocetbackend.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


/**
 * Konfigurace CORS pro povolení přístupu z frontendu.
 */

@Configuration  // označuje tuto třídu jako konfigurační třídu Springu
public class WebConfig {

    @Bean  // označuje, že metoda vrací bean, která bude spravována Springem
    public WebMvcConfigurer corsConfigurer() {  // vrací instanci WebMvcConfigurer, která umožňuje přizpůsobit konfiguraci Spring MVC
        return new WebMvcConfigurer() {  // anonymní třída implementující WebMvc

            @Override  // přepisuje metodu addCorsMappings, která umožňuje přidat vlastní CORS mapování
            public void addCorsMappings(CorsRegistry registry) {  // přidává CORS mapování pro všechny cesty
                registry.addMapping("/api/**") // Povolí CORS pro všechny controllery pod /api
                        .allowedOrigins(
                                "http://localhost:5173", // Výchozí port pro Vite + React / Vue
                                "http://localhost:3000"  // Výchozí port pro klasický Create React App
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Povolí tyto metody
                        .allowedHeaders("*") // Povolí všechny HTTP hlavičky
                        .allowCredentials(true); //;
            }
        };
    }
}
