package com.expensetracker.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

        @Bean
        public OpenAPI expenseTrackerAPI() {

                return new OpenAPI()

                                .info(new Info()

                                                .title("Expense Tracker API")

                                                .description("Expense Tracker Backend using Spring Boot")

                                                .version("1.0")

                                                .contact(new Contact()

                                                                .name("Kirubashankar")

                                                                .email("your-email@gmail.com")))

                                .externalDocs(new ExternalDocumentation()

                                                .description("API Documentation"));
        }
}