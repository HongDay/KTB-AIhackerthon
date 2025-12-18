package com.demo.mohazo.meeting.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

public class meetingUploadRequestDTO {

    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    public static class beRequest  {
        private String title;

        @NotNull
        private String record;
    }

    public record aiRequest(String title, String record) {}

}
