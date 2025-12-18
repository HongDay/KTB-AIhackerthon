package com.demo.mohazo.meeting.dto;

import lombok.*;

import java.util.List;

public class meetingListResponseDTO {

    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class meetingList {
        private List<meetingSimple> list;
    }

    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class meetingSimple {
        private Long meetingid;
        private String title;
    }

}
