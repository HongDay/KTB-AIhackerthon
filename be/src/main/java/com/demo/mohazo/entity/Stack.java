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
@Table(name = "stack")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stack {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "stack_name", nullable = false, length = 50)
    private String stackName;
    
    @OneToMany(mappedBy = "stack", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UserStack> userStacks = new ArrayList<>();
}

