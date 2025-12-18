package com.demo.mohazo.meeting.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class meetingUploadRequestDTO {

    private String title;

    @NotNull
    private String record;

}
