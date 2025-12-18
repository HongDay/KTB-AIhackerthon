package com.demo.mohazo.user.entity;

import com.demo.mohazo.common.domain.Field;
import com.demo.mohazo.common.domain.Role;
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

    // 아래는 나중에 팀장/팀원 admin/user 로그인 구현을 위함 (특정 기능 사용 제한)
    @Column(name="email", length = 20)
    private String email;

    @Column(name="password", length = 20)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name="role", nullable = false, length = 10)
    @Builder.Default
    private Role role = Role.USER;

}
