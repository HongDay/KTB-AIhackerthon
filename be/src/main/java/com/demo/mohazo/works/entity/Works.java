package com.demo.mohazo.works.entity;

import com.demo.mohazo.common.domain.Field;
import com.demo.mohazo.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "works")
public class Works {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name="field", nullable = false, length = 10)
    private Field field;

    @Column(name="title", nullable = false, length = 30)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name="assignee", nullable = true)
    private User assignee;

    @Column(name="works_order", nullable = false)
    private Integer worksOrder;

    @Column(name="level", nullable = false)
    private Integer level;

}
