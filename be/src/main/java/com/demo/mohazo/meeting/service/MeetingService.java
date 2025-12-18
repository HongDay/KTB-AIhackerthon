package com.demo.mohazo.meeting.service;

import com.demo.mohazo.common.dto.ApiResponse;
import com.demo.mohazo.common.service.NotionService;
import com.demo.mohazo.meeting.dto.meetingListResponseDTO;
import com.demo.mohazo.meeting.dto.meetingScriptResponseDTO;
import com.demo.mohazo.meeting.dto.meetingUploadRequestDTO;
import com.demo.mohazo.meeting.dto.meetingUploadResponseDTO;
import com.demo.mohazo.meeting.entity.Meeting;
import com.demo.mohazo.meeting.repository.MeetingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MeetingService {

    private final RestClient fastApiRestClient;
    private final MeetingRepository meetingRepository;
    private final NotionService notionService;
    @Autowired ObjectMapper objectMapper;

    @Transactional
    public meetingUploadResponseDTO uploadMeeting(meetingUploadRequestDTO.beRequest req){
        log.info("회의록 업로드 요청 수신: title={}", req.getTitle());

        // 1. AI API 호출 준비
        meetingUploadRequestDTO.aiRequest aireq = new meetingUploadRequestDTO.aiRequest(req.getTitle(), req.getRecord());
        String json;
        try {
            json = objectMapper.writeValueAsString(aireq);
            log.debug("AI API 요청 JSON: {}", json);
        } catch (Exception e) {
            log.error("JSON 변환 실패", e);
            throw new IllegalStateException("요청 데이터 변환에 실패했습니다.", e);
        }

        // 2. AI API 호출 (/generate로 title과 record 전송)
        ApiResponse<meetingUploadResponseDTO> airesponse;
        try {
            log.info("AI API 호출 시작: /generate");
            airesponse = fastApiRestClient.post()
                    .uri("/generate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(json)
                    .retrieve()
                    .body(new ParameterizedTypeReference<ApiResponse<meetingUploadResponseDTO>>() {});
            
            if (airesponse == null) {
                throw new IllegalStateException("AI API 응답이 null입니다.");
            }
            
            if (airesponse.getData() == null || airesponse.getData().getMeetingid() == null) {
                throw new IllegalStateException("AI API 응답에 meetingid가 없습니다.");
            }
            
            log.info("AI API 호출 성공: meetingid={}", airesponse.getData().getMeetingid());
        } catch (RestClientException e) {
            log.error("AI API 호출 실패", e);
            throw new IllegalStateException("AI API 호출에 실패했습니다: " + e.getMessage(), e);
        }

        // 3. 성공하면 meetingid와 함께 응답이 옴
        Long meetingid = airesponse.getData().getMeetingid();
        log.info("생성된 meetingid: {}", meetingid);

        // 4. Notion API로 Notion page 생성
        String notionPageUrlDesc;
        try {
            log.info("Notion page 생성 시작");
            notionPageUrlDesc = notionService.createNewPage();
            log.info("Notion page 생성 성공: pageId={}", notionPageUrlDesc);
        } catch (Exception e) {
            log.error("Notion page 생성 실패", e);
            throw new IllegalStateException("Notion page 생성에 실패했습니다: " + e.getMessage(), e);
        }

        // 5. DB에 'notion_page_url_desc' 필드 채우기
        Meeting meeting = meetingRepository.findById(meetingid)
                .orElseThrow(() -> {
                    log.error("Meeting을 찾을 수 없습니다: meetingid={}", meetingid);
                    return new EntityNotFoundException("invalid meeting id: " + meetingid);
                });
        meeting.updateNotionPageUrlDesc(notionPageUrlDesc);
        log.info("DB 업데이트 완료: meetingid={}, notionPageUrlDesc={}", meetingid, notionPageUrlDesc);

        // 6. meetingid와 함께 FE로 응답
        log.info("회의록 업로드 완료: meetingid={}", meetingid);
        return new meetingUploadResponseDTO(meetingid);
    }

    @Transactional
    public meetingListResponseDTO.meetingList getMeetingList() {
        List<Meeting> meetings = meetingRepository.findAll();
        List<meetingListResponseDTO.meetingSimple> list = meetings.stream()
                .map(item ->
                    new meetingListResponseDTO.meetingSimple(item.getId(), item.getTitle())
                ).toList();

        return new meetingListResponseDTO.meetingList(list);
    }

    @Transactional
    public meetingScriptResponseDTO getMeetingScript(Long meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new EntityNotFoundException("invalid meeting id"));

        return new meetingScriptResponseDTO(meeting.getScript());
    }
}
