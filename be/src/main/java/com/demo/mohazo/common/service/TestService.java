package com.demo.mohazo.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;

@Service
@RequiredArgsConstructor
public class TestService {
    public String getTestMessage() {
        return "Hello, daydayHongday!";
    }
    public String getTime() {
        ZonedDateTime now = ZonedDateTime.now();
        return now.getMonth() + "/" + now.getDayOfMonth();
    }
}
