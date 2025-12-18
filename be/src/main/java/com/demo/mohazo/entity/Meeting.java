package com.demo.mohazo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meeting")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meeting {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 10000)
    @Lob
    private String record; // 회의록 (최대 10000자)
    
    @Column(length = 2000)
    private String script; // AI-generated 프로젝트 설명
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;
    
    @Column(name = "notion_page_url", length = 200)
    private String notionPageUrl;
    
    @Column(name = "notion_database_id", length = 1000)
    private String notionDatabaseId;
    
    @OneToMany(mappedBy = "meeting", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TaskList> taskLists = new ArrayList<>();
}

