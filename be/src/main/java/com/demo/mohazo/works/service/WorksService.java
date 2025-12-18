package com.demo.mohazo.works.service;


import com.demo.mohazo.works.entity.Works;
import com.demo.mohazo.works.repository.WorksRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorksService {

    private final WorksRepository worksRepository;


    public List<Works> getWorkGroupsByIds(List<Long> workIds) {
        // 1. 방어 코드: 리스트가 비어있으면 쿼리를 날리지 않고 빈 리스트 반환
        if (workIds == null || workIds.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. IN 절을 사용하여 한 번에 조회 (FOR문 사용 X)
        List<Works> workList = worksRepository.findAllByIdIn(workIds);

        return workList;
    }


}
