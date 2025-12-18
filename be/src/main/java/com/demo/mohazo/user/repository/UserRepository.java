package com.demo.mohazo.user.repository;

import com.demo.mohazo.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
