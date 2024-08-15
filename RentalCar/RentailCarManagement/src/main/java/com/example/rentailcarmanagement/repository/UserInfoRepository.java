package com.example.rentailcarmanagement.repository;

import com.example.rentailcarmanagement.entities.UserInfo;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserInfoRepository extends BaseRepository<UserInfo, String> {
    @Query("SELECT u FROM UserInfo u JOIN u.account a WHERE a.email = :email")
    Optional<UserInfo> findByAccountEmail(@Param("email") String email);
}
