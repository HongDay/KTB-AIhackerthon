package com.demo.mohazo.user.entity;

import com.demo.mohazo.common.domain.Field;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="name", nullable = false, length = 20)
    private String name;

    @Column(name="level", nullable = false)
    private Integer level;

    @Column(name="exp_cnt")
    @Builder.Default
    private Integer expCnt = 0;

    @Enumerated(EnumType.STRING)
    @Column(name="field", nullable = false, length = 10)
    private Field field;

}
