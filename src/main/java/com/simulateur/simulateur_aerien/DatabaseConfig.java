package com.simulateur.simulateur_aerien;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DatabaseConfig {

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${spring.datasource.username}")
    private String datasourceUsername;

    @Value("${spring.datasource.password}")
    private String datasourcePassword;

    @PostConstruct
    public void logDatabaseConfig() {
        System.out.println("Datasource URL: " + datasourceUrl);
        System.out.println("Datasource Username: " + datasourceUsername);
        System.out.println("Datasource Password: " + datasourcePassword);
    }
}
