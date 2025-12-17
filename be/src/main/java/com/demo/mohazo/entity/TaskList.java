package com.demo.mohazo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "task_list")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskList {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id")
    private Meeting meeting;
    
    @Column(name = "task_descript", nullable = false, columnDefinition = "TEXT")
    private String taskDescript; // 업무 설명
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee")
    private User assignee; // 이 업무를 할당받은 사람
    
    @Column
    private LocalDateTime deadline; // 마감기한
    
    @Column(name = "work_group")
    private Integer workGroup; // 업무그룹
    
    @Column(name = "work_order")
    private Integer workOrder; // 그 업무그룹 내부에서의 순서
    
    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private TaskStatus status; // 진행상태
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pre_requisite")
    private TaskList prerequisite; // 선이수 업무 (자기참조)
    
    public enum TaskStatus {
        BEFORE, DOING, DONE
    }
}

