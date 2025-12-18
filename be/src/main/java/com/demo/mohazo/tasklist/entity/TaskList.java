package com.demo.mohazo.tasklist.entity;

import com.demo.mohazo.common.domain.Status;
import com.demo.mohazo.meeting.entity.Meeting;
import com.demo.mohazo.works.entity.Works;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "task_list")
public class TaskList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="meeting_id", nullable = false)
    private Meeting meeting;

    @Column(name="title", nullable = false, length = 30)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name="works_id", nullable = true)
    private Works works;

    @Column(name="work_order", nullable = false)
    private Integer taskOrder;

    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable = false, length = 10)
    @Builder.Default
    private Status status = Status.BEFORE;

    @Column(name="notion_task_id", length = 200)
    private String notionTaskId;

}
