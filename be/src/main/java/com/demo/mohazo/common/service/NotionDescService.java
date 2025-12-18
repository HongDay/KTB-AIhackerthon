package com.demo.mohazo.common.service;

import com.demo.mohazo.common.repository.TeamRepository;
import com.demo.mohazo.meeting.entity.Meeting;
import com.demo.mohazo.meeting.repository.MeetingRepository;
import com.demo.mohazo.common.entity.Team;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotionDescService {
    private final MeetingRepository meetingRepository;
    private final TeamRepository teamRepository;
    private final NotionService notionService;

    @Transactional
    public void exportDescToNotion(Long meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
        .orElseThrow(() -> new RuntimeException("Meeting not found"));

        String script = meeting.getScript();
        if (script == null || script.isEmpty()) {
            throw new RuntimeException("Script not found");
        }

        String notionPageUrlDesc = meeting.getNotionPageUrlDesc();
        if (notionPageUrlDesc == null || notionPageUrlDesc.isEmpty()) {
            throw new RuntimeException("Page URL not found");
        }

        Team team = teamRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Team not found"));


        String notionSecretKey = team.getNotionKey();
        if (notionSecretKey == null || notionSecretKey.isEmpty()) {
            throw new RuntimeException("Notion secret key not found");
        }

        String title = meeting.getTitle();

        notionService.updatePageWithTitleAndMarkdown(notionPageUrlDesc, title, script, notionSecretKey);
    }
}