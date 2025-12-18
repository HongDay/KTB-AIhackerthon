package com.demo.mohazo.common.repository;


import com.demo.mohazo.common.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {
}
