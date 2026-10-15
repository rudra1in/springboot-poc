package com.gamex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class GamexApplication {
    public static void main(String[] args) {
        SpringApplication.run(GamexApplication.class, args);
    }
}
