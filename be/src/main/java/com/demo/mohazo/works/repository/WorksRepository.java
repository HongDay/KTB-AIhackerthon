package com.demo.mohazo.works.repository;

import com.demo.mohazo.works.entity.Works;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WorksRepository extends JpaRepository<Works, Integer> {

    List<Works> findAllByIdIn(List<Long> workIds);

    @Query("SELECT w.assignee.id, COUNT(w) FROM Works w WHERE w.assignee IS NOT NULL GROUP BY w.assignee.id")
    List<Object[]> countWorksPerAssignee();

    List<Works> findByAssigneeIsNull();

}
