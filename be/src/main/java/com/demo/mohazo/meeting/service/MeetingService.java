package com.demo.mohazo.meeting.service;

import com.demo.mohazo.common.dto.ApiResponse;
import com.demo.mohazo.meeting.dto.meetingListResponseDTO;
import com.demo.mohazo.meeting.dto.meetingScriptResponseDTO;
import com.demo.mohazo.meeting.dto.meetingUploadRequestDTO;
import com.demo.mohazo.meeting.dto.meetingUploadResponseDTO;
import com.demo.mohazo.meeting.entity.Meeting;
import com.demo.mohazo.meeting.repository.MeetingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;

import java.util.List;
import java.util.Map;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MeetingService {

    private final RestClient fastApiRestClient;
    private final MeetingRepository meetingRepository;

    @Transactional
    public meetingUploadResponseDTO uploadMeeting(meetingUploadRequestDTO req){
        // AI API 호출
        ApiResponse<meetingUploadResponseDTO> airesponse = fastApiRestClient.post()
                .uri("/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .body(req)
                .retrieve()
                .body(new ParameterizedTypeReference<ApiResponse<meetingUploadResponseDTO>>() {});

        if (airesponse == null || airesponse.getData().getMeetingid() == null) {
            throw new IllegalStateException("FastAPI 응답에 meetingid가 없습니다.");
        }

        Long meetingid = airesponse.getData().getMeetingid();

        // Notion page 생성 API 호출 (daisy part)
        // String notionPageUrlDesc = ;
        // PARENT_PAGE_ID를 DB에서 가져와야합니다.
        private String createNewPage() {
            Map<String, Object> body = Map.of(
                    "parent", Map.of("page_id", PARENT_PAGE_ID),
                    "properties", Map.of(
                            "title", List.of(Map.of("text", Map.of("content", " ")))
                    )
            );

            return webClient.post()
                    .uri("/pages")
                    .header("Authorization", "Bearer " + NOTION_TOKEN)
                    .header("Notion-Version", "2022-06-28")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .map(node -> node.get("id").asText())
                    .block();
        }

        // DB에 'notion_page_url_desc' 필드 채우기
        Meeting meeting = meetingRepository.findById(meetingid)
                .orElseThrow(() -> new EntityNotFoundException("invalid meeting id"));
        // meeting.updateNotionPageUrlDesc(notionPageUrlDesc);

        return new meetingUploadResponseDTO(meetingid);
    }

    @Transactional
    public meetingListResponseDTO getMeetingList() {
        List<Meeting> meetings = meetingRepository.findAll();
        List<meetingListResponseDTO.meetingList> list = meetings.stream()
                .map(item ->
                    new meetingListResponseDTO.meetingList(item.getId(), item.getTitle())
                ).toList();

        return new meetingListResponseDTO(list);
    }

    @Transactional
    public meetingScriptResponseDTO getMeetingScript(Long meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new EntityNotFoundException("invalid meeting id"));

        return new meetingScriptResponseDTO(meeting.getScript());
    }
}
