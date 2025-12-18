package com.demo.mohazo.common.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "team")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="team_name", nullable = false, length = 20)
    @Builder.Default
    private String teamName = "team1";

    @Column(name="notion_key", nullable = false, length = 200)
    private String notionKey;

}
