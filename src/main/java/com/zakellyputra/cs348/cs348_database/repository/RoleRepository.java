package com.zakellyputra.cs348.cs348_database.repository;

import com.zakellyputra.cs348.cs348_database.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByRoleName(String roleName);
}
