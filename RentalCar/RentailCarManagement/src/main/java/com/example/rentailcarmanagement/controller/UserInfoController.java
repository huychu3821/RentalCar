package com.example.rentailcarmanagement.controller;

import com.example.rentailcarmanagement.payload.Response;
import com.example.rentailcarmanagement.payload.request.UserRequest;
import com.example.rentailcarmanagement.payload.response.UserInfoResponse;
import com.example.rentailcarmanagement.service.UserService;
import com.example.rentailcarmanagement.service.impl.UserServiceImp;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
    @RequestMapping("/user-info")
@Slf4j
public class UserInfoController {

    private final ObjectMapper objectMapper;

    private final UserService userService;

    public UserInfoController(ObjectMapper objectMapper, UserServiceImp userService) {
        this.objectMapper = objectMapper;
        this.userService = userService;
    }


    @GetMapping("/get-user")
    public ResponseEntity<?> getUserInfo() {
        Map<Object, Object> error = new HashMap<>();
        UserInfoResponse userInfo = userService.getCurrentUserBeforeUpdate();
        if (userInfo == null) {
            log.info("User not found");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .isSuccess(false)
                            .error(error)
                            .body(null)
                            .build());
        }
        if (userInfo.isUpdated()){
            UserInfoResponse currentUser = userService.getCurrentUser();
            log.info("Current info: " + userInfo);
            return ResponseEntity.status(HttpStatus.OK).body(
                    Response.builder()
                            .isSuccess(true)
                            .status(HttpStatus.OK.value())
                            .error(error)
                            .body(currentUser)
                            .build()
            );
        }
        log.info("User info: " + userInfo);
        return ResponseEntity.status(HttpStatus.OK).body(
                Response.builder()
                        .isSuccess(true)
                        .status(HttpStatus.OK.value())
                        .error(error)
                        .body(userInfo)
                        .build());
    }

    @PostMapping(value = "/edit-profile")
    public ResponseEntity<?> editProfile(@RequestPart("data") String jsonRequest,
                                         @RequestPart(value = "file", required = false) MultipartFile file) {

        try {
            UserRequest userRequest = objectMapper.readValue(jsonRequest, UserRequest.class);
            return userService.updateUserInfo(userRequest, file);

        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Response.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .isSuccess(false)
                    .body(e.getMessage())
                    .build());
        }
    }

}
