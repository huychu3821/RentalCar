package com.example.rentailcarmanagement.service;

import com.example.rentailcarmanagement.entities.UserInfo;
import com.example.rentailcarmanagement.payload.request.UserRequest;
import com.example.rentailcarmanagement.payload.response.UserInfoResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface UserService {
    ResponseEntity<?> updateUserInfo(UserRequest userRequest, MultipartFile multipartFile);
    UserInfoResponse getCurrentUser();
    UserInfoResponse getCurrentUserBeforeUpdate();
    UserInfo getCurrentUserInfo();
}
