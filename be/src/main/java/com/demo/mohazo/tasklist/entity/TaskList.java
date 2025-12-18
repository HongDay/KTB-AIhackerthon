package com.demo.mohazo.tasklist.entity;

import com.demo.mohazo.common.domain.Status;
import com.demo.mohazo.meeting.entity.Meeting;
import com.demo.mohazo.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

    @Column(name="task_descript", nullable = false)
    private String taskDescript; // ERD에 Type만 보여서 길이 제한은 DB 정의에 맞춰 조정 권장

    // assignee: ERD상 LONG, "이 업무를 할당받은 사람"
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="assignee")
    private User assignee;

    @Column(name="deadline")
    private LocalDateTime deadline;

    @Column(name="work_group")
    private Integer workGroup;

    @Column(name="work_order")
    private Integer workOrder;

    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable = false, length = 20)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="pre-requisite")
    private TaskList preRequisite;

    @Column(name="notion_task_id", length = 200)
    private String notionTaskId;

}
