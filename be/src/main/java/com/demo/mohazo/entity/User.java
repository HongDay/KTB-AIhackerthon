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
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100, unique = true)
    private String email;
    
    @Column(nullable = false, length = 64)
    private String password;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer level = 1; // 1-10 숙련도
    
    @Column(name = "exp_cnt")
    @Builder.Default
    private Integer expCnt = 0; // 프로젝트 경험횟수
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 2)
    private Field field; // BE, FE, CL, AI
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UserTeam> userTeams = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UserStack> userStacks = new ArrayList<>();
    
    @OneToMany(mappedBy = "assignee", cascade = CascadeType.ALL)
    @Builder.Default
    private List<TaskList> assignedTasks = new ArrayList<>();
    
    public enum Field {
        BE, FE, CL, AI
    }
}

