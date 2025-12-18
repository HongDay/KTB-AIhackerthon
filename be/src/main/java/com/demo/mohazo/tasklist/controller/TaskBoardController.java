package com.demo.mohazo.tasklist.controller;


import com.demo.mohazo.common.dto.ApiResponse;
import com.demo.mohazo.common.entity.Team;
import com.demo.mohazo.common.repository.TeamRepository;
import com.demo.mohazo.common.service.MohajoAlgorithm;
import com.demo.mohazo.meeting.entity.Meeting;
import com.demo.mohazo.meeting.repository.MeetingRepository;
import com.demo.mohazo.tasklist.dto.TaskListRequestDto;
import com.demo.mohazo.tasklist.entity.TaskList;
import com.demo.mohazo.tasklist.service.TaskListNotionService;
import com.demo.mohazo.works.entity.Works;
import com.demo.mohazo.works.service.WorksService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notion/.task")
public class TaskBoardController {

    public final TaskListNotionService taskListNotionService;
    public final WorksService worksService;
    public final MohajoAlgorithm mohajoAlgorithm;
    public final MeetingRepository meetingRepository;
    public final TeamRepository teamRepository;



    @PostMapping
    public ResponseEntity<?> createTaskboard(@RequestBody TaskListRequestDto taskListRequestDto) {

        Long meetingid = taskListRequestDto.getMeetingid();

        List<TaskList> tasks = taskListNotionService.findbymeetingid(meetingid);

        List<Works> worksList = tasks.stream()
                .map(TaskList::getWorks)     // Task에서 WorkGroup 추출
                .filter(Objects::nonNull)    // 워크그룹이 없는 태스크 제외
                .distinct()                  // 중복 제거 (공통된 것들만 남음)
                .collect(Collectors.toList());

//        worksList = mohajoAlgorithm.Classfication(worksList);
        Meeting meeting = meetingRepository.findById(meetingid).orElse(null);


        Team team = teamRepository.findById(1L).orElse(null);

        //TaskListService.createTable -> notion_database_id in meeting
        taskListNotionService.createNotionDB(team, meeting);




        //TaskListService.insertPages 안에서 TaskList에  notion_task_id 할당
        taskListNotionService.insertPages(tasks, meeting, team);










        return ResponseEntity.ok().body(new ApiResponse("task list successfully exported to notion", null));

    }



}
