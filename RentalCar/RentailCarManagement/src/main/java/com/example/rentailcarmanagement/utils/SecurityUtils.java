package com.example.rentailcarmanagement.utils;

import com.example.rentailcarmanagement.security.service.UserDetailsImpl;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static UserDetailsImpl getUser() {
        return (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }
}
