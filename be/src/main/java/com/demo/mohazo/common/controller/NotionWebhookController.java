package com.demo.mohazo.common.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@RequestMapping("/api/webhook")
public class NotionWebhookController {

    private static final Logger logger = LoggerFactory.getLogger(NotionWebhookController.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 웹훅 엔드포인트 헬스체크
     * 노션 웹훅 설정 시 URL이 올바른지 확인할 수 있습니다.
     */
    @GetMapping("/notion")
    public ResponseEntity<Map<String, String>> healthCheck() {
        String timestamp = LocalDateTime.now().format(formatter);
        logger.info("Health check requested at {}", timestamp);
        
        return ResponseEntity.ok(Map.of(
            "status", "ok",
            "message", "Notion webhook endpoint is ready",
            "timestamp", timestamp,
            "endpoint", "POST /api/webhook/notion"
        ));
    }

    /**
     * 노션 웹훅 수신 엔드포인트
     */
    @PostMapping("/notion")
    public ResponseEntity<Map<String, String>> receiveNotionWebhook(
            @RequestBody Map<String, Object> payload,
            @RequestHeader Map<String, String> headers) {
        
        String timestamp = LocalDateTime.now().format(formatter);
        
        // 상세한 로그 출력
        logger.info("========================================");
        logger.info("Notion Webhook Received at {}", timestamp);
        logger.info("========================================");
        logger.info("Headers: {}", headers);
        logger.info("Payload: {}", payload);
        logger.info("========================================");
        
        // 콘솔에도 출력 (EC2에서 확인하기 쉽도록)
        System.out.println("\n========================================");
        System.out.println("Notion Webhook Received at " + timestamp);
        System.out.println("========================================");
        System.out.println("Headers: " + headers);
        System.out.println("Payload: " + payload);
        System.out.println("========================================\n");
        
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Webhook received successfully",
            "timestamp", timestamp
        ));
    }
}

