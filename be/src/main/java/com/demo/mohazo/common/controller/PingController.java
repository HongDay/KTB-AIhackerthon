package com.demo.mohazo.common.controller;

import com.demo.mohazo.common.service.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class PingController {

    private final TestService testService;

    @GetMapping("/ping")
    public Map<String, Object> healthCheck() {
        Instant start = Instant.now();

        Map<String, Object> map = new HashMap<>();
        map.put("today", testService.getTime());
        map.put("message", testService.getTestMessage());

        Instant end = Instant.now();
        long latencyMs = Duration.between(start, end).toMillis();
        map.put("ms", latencyMs);

        return map;
    }
}
