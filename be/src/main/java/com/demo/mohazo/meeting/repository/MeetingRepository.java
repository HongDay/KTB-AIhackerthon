package com.demo.mohazo.meeting.repository;

import com.demo.mohazo.meeting.entity.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

}
