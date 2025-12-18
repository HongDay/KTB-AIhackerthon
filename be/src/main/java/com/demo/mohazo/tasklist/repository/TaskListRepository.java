package com.demo.mohazo.tasklist.repository;

import com.demo.mohazo.tasklist.entity.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskListRepository extends JpaRepository<TaskList, Long> {

    @Query("SELECT t FROM TaskList t " +
            "JOIN FETCH t.works " +  // TaskList를 가져올 때 연관된 Works도 한 번에 가져옴
            "WHERE t.meeting.id = :meetingId")
    List<TaskList> findBymeeting_Id(Long meetingId);

}
