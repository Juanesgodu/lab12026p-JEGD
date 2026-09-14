package com.udea.lab12026p.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración CORS del backend.
 *
 * Esto es OPCIONAL si el frontend consume la API a través del proxy de
 * Vite (ver vite.config.js -> server.proxy), ya que en ese caso el
 * navegador nunca hace una petición cross-origin real.
 *
 * Es necesario únicamente si el frontend llama directamente a
 * http://localhost:8080 desde http://localhost:5173 (por ejemplo, sin
 * usar el proxy, o al probar con herramientas que sí disparan CORS).
 *
 * No modifica ningún controller, servicio ni entidad existente.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);
    }

    // Si en algún momento cambias el puerto o dominio del frontend
    // (por ejemplo al desplegarlo), agrega esa URL a allowedOrigins() arriba.
}
