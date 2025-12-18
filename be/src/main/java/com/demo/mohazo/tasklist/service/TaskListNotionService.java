package com.demo.mohazo.tasklist.service;


import com.demo.mohazo.common.domain.Status;
import com.demo.mohazo.common.entity.Team;
import com.demo.mohazo.meeting.entity.Meeting;
import com.demo.mohazo.meeting.repository.MeetingRepository;
import com.demo.mohazo.tasklist.dto.TaskListRequestDto;
import com.demo.mohazo.tasklist.dto.TaskListResponseDto;
import com.demo.mohazo.tasklist.entity.TaskList;
import com.demo.mohazo.tasklist.repository.TaskListRepository;
import com.demo.mohazo.works.entity.Works;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TaskListNotionService {



    private final TaskListRepository taskListRepository;
    private final WebClient webClient;
    private final MeetingRepository meetingRepository;



    public String createDatabase(Team team) {
        String PARENT_PAGE_ID = team.getNotionPageUrlBase();
        String NOTION_TOKEN = team.getNotionKey();
        Map<String, Object> body = Map.of(
                "parent", Map.of("page_id", PARENT_PAGE_ID),
                "title", List.of(Map.of("text", Map.of("content", "DB 생성기 테스트"))),
//                "is_inline", true,
                "properties", Map.of(
                        "업무 명칭", Map.of("title", Map.of()),
                        "담당자", Map.of("rich_text", Map.of()),
                        "마감일", Map.of("date", Map.of()),
                        "상태", Map.of("select", Map.of(
                                "options", List.of(
                                        Map.of("name", Status.BEFORE.name(), "color", "default"),
                                        Map.of("name", Status.DOING.name(), "color", "blue"),
                                        Map.of("name", Status.DONE.name(), "color", "green"))))));

        return webClient.post().uri("/databases")
                .header("Authorization", "Bearer " + NOTION_TOKEN)
                .header("Notion-Version", "2022-06-28")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(node -> node.get("id").asText())
                .block();
    }

    public String insertPage(String databaseId, TaskListResponseDto data, Team team) {
        String NOTION_TOKEN = team.getNotionKey();
        Map<String, Object> props = new HashMap<>();
        props.put("업무 명칭", Map.of("title", List.of(Map.of("text", Map.of("content", data.getDescription())))));
        props.put("담당자", Map.of("rich_text", List.of(Map.of("text", Map.of("content", data.getAssignee())))));
//        props.put("마감일", Map.of("date", Map.of("start", data.getDeadline())));
        props.put("상태", Map.of("select", Map.of("name", data.getStatus().name())));

        return webClient.post().uri("/pages")
                .header("Authorization", "Bearer " + NOTION_TOKEN)
                .header("Notion-Version", "2022-06-28")
                .bodyValue(Map.of("parent", Map.of("database_id", databaseId), "properties", props))
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(node -> node.get("id").asText())
                .block();
    }

    public void updatePage(String pageId, TaskListResponseDto data, Team team) {
        String NOTION_TOKEN = team.getNotionKey();

        // 1. 변경할 데이터 맵 구성 (전달된 데이터만 업데이트됩니다)
        Map<String, Object> props = new HashMap<>();

        // '업무 명칭' (title)
        props.put("업무 명칭", Map.of("title", List.of(Map.of("text", Map.of("content", data.getDescription())))));

        // '담당자' (rich_text)
        props.put("담당자", Map.of("rich_text", List.of(Map.of("text", Map.of("content", data.getAssignee())))));

        // '마감일' (date)
//        props.put("마감일", Map.of("date", Map.of("start", data.getDeadline())));

        // '상태' (number)
        props.put("상태", Map.of("select", Map.of("name", data.getStatus().name())));

        // 2. PATCH 요청 실행
        webClient.patch()
                .uri("/pages/" + pageId) // 업데이트할 특정 페이지의 ID
                .header("Authorization", "Bearer " + NOTION_TOKEN)
                .header("Notion-Version", "2022-06-28")
                .bodyValue(Map.of("properties", props)) // 데이터베이스 정보(parent) 없이 properties만 전송
                .retrieve()
                .toBodilessEntity()
                .block();
    }


    public List<TaskList> findbymeetingid(Long id) {
        return taskListRepository.findBymeeting_Id(id);
    }

    public void createNotionDB(Team team, Meeting meeting) {
        String db_id = createDatabase(team);
        meeting.setNotionDatabaseId(db_id);
        meetingRepository.save(meeting);
    }

    public TaskListResponseDto apply2dto(TaskList task){

        String description = task.getTitle();
        String assignee = task.getWorks().getAssignee().getName();
        Status status = task.getStatus();

        TaskListResponseDto dto =  new TaskListResponseDto(description, assignee, status);




        return dto;

    }

    public void insertPages(List<TaskList> taskLists, Meeting meeting, Team team ) {
        String databaseId = meeting.getNotionDatabaseId();

        for (TaskList taskList : taskLists) {
            TaskListResponseDto dto = apply2dto(taskList);
            String taks_id = insertPage(databaseId, dto, team);
            taskList.setNotionTaskId(taks_id);
            taskListRepository.save(taskList);
        }


    }









}
