package com.demo.mohazo.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/webhook")
public class NotionWebhookController {

    private static final Logger logger = LoggerFactory.getLogger(NotionWebhookController.class);

    @PostMapping("/notion")
    public ResponseEntity<Map<String, String>> receiveNotionWebhook(@RequestBody Map<String, Object> payload) {
        logger.info("=== Notion Webhook Received ===");
        logger.info("Payload: {}", payload);
        logger.info("=== End of Webhook Payload ===");
        
        // 콘솔에도 출력 (System.out.println)
        System.out.println("=== Notion Webhook Received ===");
        System.out.println("Payload: " + payload);
        System.out.println("=== End of Webhook Payload ===");
        
        return ResponseEntity.ok(Map.of("status", "success", "message", "Webhook received successfully"));
    }
}

