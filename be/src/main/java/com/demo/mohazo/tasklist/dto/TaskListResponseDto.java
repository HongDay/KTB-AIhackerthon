package com.demo.mohazo.tasklist.dto;


import com.demo.mohazo.common.domain.Status;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TaskListResponseDto {
    private String description;
    private String assignee;
//    private String deadline; // YYYY-MM-DD
    private Status status;
}
