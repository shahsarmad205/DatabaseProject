package com.apartmentmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.FileWriter;
import java.io.IOException;
import java.time.Instant;

@SpringBootApplication
public class ApartmentManagementApplication {
    
    private static final String LOG_PATH = "/Users/sarmadshah/Desktop/CMPSC Databases /Final_project/.cursor/debug.log";
    
    // #region agent log
    private static void log(String location, String message, String dataJson, String hypothesisId) {
        try {
            java.io.File logFile = new java.io.File(LOG_PATH);
            logFile.getParentFile().mkdirs();
            try (FileWriter writer = new FileWriter(LOG_PATH, true)) {
                String json =                 String.format(
                    "{\"sessionId\":\"debug-session\",\"runId\":\"post-fix\",\"hypothesisId\":\"%s\",\"location\":\"%s\",\"message\":\"%s\",\"data\":%s,\"timestamp\":%d}\n",
                    hypothesisId, location, message, dataJson != null ? dataJson : "null", Instant.now().toEpochMilli()
                );
                writer.write(json);
            }
        } catch (IOException e) {
            // Silent fail for logging
        }
    }
    
    static {
        // #region agent log
        log("ApartmentManagementApplication.java:<clinit>", "Static initializer - checking MySQL before Spring Boot starts", 
            "{\"checking\":\"localhost:3306\"}", "A");
        try (java.net.Socket socket = new java.net.Socket()) {
            socket.connect(new java.net.InetSocketAddress("localhost", 3306), 2000);
            log("ApartmentManagementApplication.java:<clinit>", "MySQL server is reachable", 
                "{\"host\":\"localhost\",\"port\":3306,\"reachable\":true}", "A");
        } catch (IOException e) {
            String errorMsg = e.getMessage() != null ? e.getMessage().replace("\"", "'") : "unknown";
            log("ApartmentManagementApplication.java:<clinit>", "MySQL server is NOT reachable", 
                String.format("{\"host\":\"localhost\",\"port\":3306,\"reachable\":false,\"error\":\"%s\"}", errorMsg), "A");
        }
        // #endregion
    }
    // #endregion
    
    public static void main(String[] args) {
        // #region agent log
        log("ApartmentManagementApplication.java:main", "Application starting", 
            "{\"argsCount\":" + args.length + "}", "E");
        // #endregion
        
        try {
            SpringApplication.run(ApartmentManagementApplication.class, args);
            // #region agent log
            log("ApartmentManagementApplication.java:main", "Application started successfully", "{}", "E");
            // #endregion
        } catch (Exception e) {
            // #region agent log
            String errorMsg = e.getMessage() != null ? e.getMessage().replace("\"", "'") : "unknown";
            log("ApartmentManagementApplication.java:main", "Application startup failed", 
                String.format("{\"error\":\"%s\",\"errorType\":\"%s\"}", errorMsg, e.getClass().getSimpleName()), "E");
            // #endregion
            throw e;
        }
    }
}


