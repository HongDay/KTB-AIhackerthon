package com.demo.mohazo.meeting.dto;

import lombok.*;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class meetingListResponseDTO {
    private List<meetingList> list;

    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class meetingList {
        private Long meetingid;
        private String title;
    }

}
