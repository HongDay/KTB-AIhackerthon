package com.demo.mohazo.works.service;

import com.demo.mohazo.common.domain.Field;
import com.demo.mohazo.user.entity.User;
import com.demo.mohazo.user.repository.UserRepository;
import com.demo.mohazo.works.entity.Works;
import com.demo.mohazo.works.repository.WorksRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class WorksServiceTest {

    @Mock
    private WorksRepository worksRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private WorksService worksService;

    @Test
    @DisplayName("작업이 없는 상태에서 모든 유저에게 균등하게 할당된다.")
    void assignWorks_Equally_When_No_Prior_Assignment() {
        // given
        // 유저 2명 (BE)
        User user1 = User.builder().id(1L).name("User1").field(Field.BE).build();
        User user2 = User.builder().id(2L).name("User2").field(Field.BE).build();
        given(userRepository.findAll()).willReturn(List.of(user1, user2));

        // 작업 2개 (BE)
        Works work1 = Works.builder().id(101L).title("API Dev").field(Field.BE).build();
        Works work2 = Works.builder().id(102L).title("DB Design").field(Field.BE).build();
        given(worksRepository.findByAssigneeIsNull()).willReturn(List.of(work1, work2));

        // 현재 할당량 0
        given(worksRepository.countWorksPerAssignee()).willReturn(new ArrayList<>());

        // saveAll Mocking (그대로 반환)
        given(worksRepository.saveAll(List.of(work1, work2))).willReturn(List.of(work1, work2));

        // when
        List<Works> result = worksService.assignworks();

        // then
        // 각 작업에 할당된 유저가 존재해야 함
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getAssignee()).isNotNull();
        assertThat(result.get(1).getAssignee()).isNotNull();

        // 두 유저가 서로 달라야 함 (균등 분배라면, 유저1 한번, 유저2 한번 할당되어야 함)
        // 주의: 알고리즘상 ID 순서나 리스트 순서에 따라 달라질 수 있지만,
        // 0 vs 0 에서 하나 할당 -> 1 vs 0 -> 다음은 0인 사람에게 할당되어야 정상.
        assertThat(result.stream().map(w -> w.getAssignee().getId()).distinct().count()).isEqualTo(2);
    }

    @Test
    @DisplayName("기존 작업이 많은 유저는 제외하고 적은 유저에게 할당된다.")
    void assignWorks_LoadBalancing() {
        // given
        // 유저 2명 (BE)
        User user1 = User.builder().id(1L).name("BusyUser").field(Field.BE).build();
        User user2 = User.builder().id(2L).name("FreeUser").field(Field.BE).build();
        given(userRepository.findAll()).willReturn(List.of(user1, user2));

        // 작업 1개 (BE)
        Works work1 = Works.builder().id(201L).title("New Task").field(Field.BE).build();
        given(worksRepository.findByAssigneeIsNull()).willReturn(List.of(work1));

        // 현재 할당량: User1은 5개, User2는 0개
        // DB 리턴값: Object[] {userId, count}
        Object[] countRow = new Object[] { 1L, 5L };
        List<Object[]> countList = new ArrayList<>();
        countList.add(countRow);

        given(worksRepository.countWorksPerAssignee()).willReturn(countList);

        given(worksRepository.saveAll(List.of(work1))).willReturn(List.of(work1));

        // when
        List<Works> result = worksService.assignworks();

        // then
        // User1은 바쁘니까 User2에게 할당되어야 함
        assertThat(result.get(0).getAssignee().getId()).isEqualTo(user2.getId());
    }
}
