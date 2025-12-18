package com.demo.mohazo.common.controller;

import com.demo.mohazo.common.dto.NotionDescRequest;
import com.demo.mohazo.common.dto.NotionDescResponse;
import com.demo.mohazo.common.service.NotionDescService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notion")
@RequiredArgsConstructor
public class NotionDescController {
    private final NotionDescService notionDescService;

    @PostMapping("/description")
    public ResponseEntity<NotionDescResponse<Object>> exportDescToNotion(@RequestBody NotionDescRequest request) {

            notionDescService.exportDescToNotion(request.getMeetingid());
            return ResponseEntity.ok(new NotionDescResponse<>("meeting script successfully exported to notion", null));
        
    }
}