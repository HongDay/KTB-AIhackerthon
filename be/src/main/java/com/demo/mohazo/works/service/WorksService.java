package com.demo.mohazo.works.service;

import com.demo.mohazo.common.domain.Field;
import com.demo.mohazo.user.entity.User;
import com.demo.mohazo.user.repository.UserRepository;
import com.demo.mohazo.works.entity.Works;
import com.demo.mohazo.works.repository.WorksRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorksService {

    private final WorksRepository worksRepository;
    private final UserRepository userRepository;

    public List<Works> getWorkGroupsByIds(List<Long> workIds) {
        // 1. 방어 코드: 리스트가 비어있으면 쿼리를 날리지 않고 빈 리스트 반환
        if (workIds == null || workIds.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. IN 절을 사용하여 한 번에 조회 (FOR문 사용 X)
        List<Works> workList = worksRepository.findAllByIdIn(workIds);

        return workList;
    }

    public List<Works> assignworks() {
        // 1. 할당되지 않은 Works 조회
        List<Works> unassignedWorks = worksRepository.findByAssigneeIsNull();

        if (unassignedWorks.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. 전체 User 조회
        List<User> allUsers = userRepository.findAll();

        // 3. User를 Field별로 그룹화
        Map<Field, List<User>> usersByField = allUsers.stream()
                .collect(Collectors.groupingBy(User::getField));

        // 4. 각 사용자의 현재 할당된 작업 수를 조회 (DB에서 카운트)
        List<Object[]> currentCounts = worksRepository.countWorksPerAssignee();
        Map<Long, Integer> userWorkCounts = new HashMap<>();

        // 초기화: 모든 유저 0으로 세팅 (혹시 DB 조회 결과에 없는 유저 대비)
        for (User user : allUsers) {
            userWorkCounts.put(user.getId(), 0);
        }
        // DB 카운트 반영
        for (Object[] row : currentCounts) {
            Long userId = (Long) row[0];
            Long count = (Long) row[1];
            userWorkCounts.put(userId, count.intValue());
        }

        // 5. 할당 로직 실행
        for (Works work : unassignedWorks) {
            Field workField = work.getField();
            List<User> candidates = usersByField.get(workField);

            if (candidates == null || candidates.isEmpty()) {
                // 해당 분야의 유저가 없으면 할당 스킵 (로그 필요시 추가)
                continue;
            }

            // 가장 적은 작업을 가진 유저 찾기 (균등 분배)
            User bestCandidate = null;
            int minCount = Integer.MAX_VALUE;

            for (User candidate : candidates) {
                int count = userWorkCounts.getOrDefault(candidate.getId(), 0);
                if (count < minCount) {
                    minCount = count;
                    bestCandidate = candidate;
                }
            }

            // 할당 및 카운트 업데이트
            if (bestCandidate != null) {
                work.setAssignee(bestCandidate);
                userWorkCounts.put(bestCandidate.getId(), minCount + 1);
            }
        }

        // 6. 변경사항 저장
        return worksRepository.saveAll(unassignedWorks);
    }

}
