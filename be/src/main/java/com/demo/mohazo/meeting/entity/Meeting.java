package com.demo.mohazo.meeting.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "meeting")
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="title", nullable = false, length = 100)
    private String title;

    @Column(name="record", nullable = false, length = 10000)
    private String record; // 회의록(최대 10000자)

    @Column(name="script", nullable = false, length = 2000)
    private String script; // AI-generated 프로젝트 설명

    @Column(name="notion_page_url_desc", length = 200)
    private String notionPageUrlDesc;

    @Column(name="notion_page_url_task", length = 200)
    private String notionPageUrlTask;

    @Column(name="notion_database_id", length = 1000)
    private String notionDatabaseId;

}
