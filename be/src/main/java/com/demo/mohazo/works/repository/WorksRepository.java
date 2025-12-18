package com.demo.mohazo.works.repository;

import com.demo.mohazo.works.entity.Works;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorksRepository extends JpaRepository<Works, Integer> {

    List<Works> findAllByIdIn(List<Long> workIds);

}
