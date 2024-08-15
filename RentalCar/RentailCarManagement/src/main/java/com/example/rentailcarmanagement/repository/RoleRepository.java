package com.example.rentailcarmanagement.repository;

import com.example.rentailcarmanagement.entities.Role;
import com.example.rentailcarmanagement.entities.enums.ERole;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends BaseRepository<Role, Integer> {
    Optional<Role> findByRole(ERole role);
}
