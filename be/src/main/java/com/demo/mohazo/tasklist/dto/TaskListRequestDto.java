package com.demo.mohazo.tasklist.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class TaskListRequestDto {


    @JsonProperty("meetingid")
    private long meetingid;
}
