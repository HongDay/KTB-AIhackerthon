package com.demo.mohazo.meeting.controller;

import com.demo.mohazo.common.controller.ApiController;
import com.demo.mohazo.common.dto.ApiResponse;
import com.demo.mohazo.meeting.dto.meetingListResponseDTO;
import com.demo.mohazo.meeting.dto.meetingScriptResponseDTO;
import com.demo.mohazo.meeting.dto.meetingUploadResponseDTO;
import com.demo.mohazo.meeting.dto.meetingUploadRequestDTO;
import com.demo.mohazo.meeting.service.MeetingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RequiredArgsConstructor
@RestController
public class MeetingController extends ApiController {

    private final MeetingService meetingService;

    @PostMapping("meetings")
    public ResponseEntity<ApiResponse<meetingUploadResponseDTO>> uploadMeeting(
            @RequestBody @Valid meetingUploadRequestDTO.beRequest req
    ){
        meetingUploadResponseDTO response = meetingService.uploadMeeting(req);
        return ResponseEntity.ok(new ApiResponse<>("meeting record uploaded", response));
    }

    @GetMapping("meetings")
    public ResponseEntity<ApiResponse<meetingListResponseDTO.meetingList>> getMeetingList() {
        meetingListResponseDTO.meetingList response = meetingService.getMeetingList();

        return ResponseEntity.ok(new ApiResponse<>("meeting list successfully responded", response));
    }

    @GetMapping("meetings/{meetingid}")
    public ResponseEntity<ApiResponse<meetingScriptResponseDTO>> getMeetingScript(
            @PathVariable("meetingid") Long meetingId
    ) {
        meetingScriptResponseDTO response = meetingService.getMeetingScript(meetingId);

        return ResponseEntity.ok(new ApiResponse<>("meeting script successfully responded", response));
    }

}
