package com.example.rentailcarmanagement.service.impl;

import com.example.rentailcarmanagement.entities.District;
import com.example.rentailcarmanagement.entities.Province;
import com.example.rentailcarmanagement.entities.UserInfo;
import com.example.rentailcarmanagement.entities.Ward;
import com.example.rentailcarmanagement.payload.Response;
import com.example.rentailcarmanagement.payload.request.UserRequest;
import com.example.rentailcarmanagement.payload.response.UserInfoResponse;
import com.example.rentailcarmanagement.repository.AccountRepository;
import com.example.rentailcarmanagement.repository.UserInfoRepository;
import com.example.rentailcarmanagement.security.service.UserDetailsImpl;
import com.example.rentailcarmanagement.service.UserService;
import com.example.rentailcarmanagement.utils.Constant;
import com.example.rentailcarmanagement.utils.ImageUploadService;
import com.example.rentailcarmanagement.utils.SecurityUtils;
import com.example.rentailcarmanagement.utils.UtilService;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    UserInfoRepository userInfoRepository;

    @Autowired
    ImageUploadService imageUploadService;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    UtilService utilService;


    @Transactional
    public ResponseEntity<?> updateUserInfo(UserRequest userRequest, MultipartFile multipartFile) {
        UserInfo userInfo = accountRepository.findById(SecurityUtils.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"))
                .getUserInfo();

        if (userRequest.getPhone().isEmpty() || userRequest.getNationalId().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .isSuccess(false)
                            .body(Constant.ME016)
                            .build());
        }

        if (!userRequest.getPhone().matches(Constant.PHONE_REGEX)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .isSuccess(false)
                            .body(Constant.ME017)
                            .build());
        }

//        if (!userRequest.getName().isEmpty()) {
        userInfo.setName(userRequest.getName());
//        }

        userInfo.setPhone(userRequest.getPhone());

        if (userRequest.getDob() != null) {
            userInfo.setDob(userRequest.getDob());
        }

        userInfo.setNationalId(userRequest.getNationalId());

        if (!userRequest.getDetailAddress().isEmpty()) {
            userInfo.setDetailAddress(userRequest.getDetailAddress());
        }


        if (!userRequest.getCity().isEmpty()
                && !userRequest.getDistrict().isEmpty()
                && !userRequest.getWard().isEmpty()) {
            Province province = utilService.findProvinceByName(userRequest.getCity());
            District district = utilService.findDistrictByProvinceAndName(userRequest.getCity(), userRequest.getDistrict());
            Ward ward = utilService.findWardByDistrictAndProvinceAndName(userRequest.getCity(), userRequest.getDistrict(), userRequest.getWard());
            ward.setDistrict(district);
            district.setProvince(province);
            userInfo.setWard(ward);
        }

        try {
            UserInfo saveUser;
            UserInfoResponse userInfoResponse = new UserInfoResponse();
            if (multipartFile != null) {
                if (userInfo.getDriverLicense() != null) {
                    try {
                        imageUploadService.deleteFile(userInfo.getDriverLicense());
                    } catch (IOException e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(Response.builder()
                                        .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                        .isSuccess(false)
                                        .body(e.getMessage())
                                        .build());
                    }
                }
                try {
                    String uploadFileName = imageUploadService.upload(multipartFile);
                    userInfo.setDriverLicense(uploadFileName);
                    userInfo.setUpdated(true);
                    saveUser = userInfoRepository.save(userInfo);
                    userInfoResponse.setDriverLicense(uploadFileName);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Response.builder()
                                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                    .isSuccess(false)
                                    .body(e.getMessage())
                                    .build());
                }
            } else {
                userInfo.setUpdated(true);
                saveUser = userInfoRepository.save(userInfo);
            }
            getUserAddressResponse(saveUser, userInfoResponse);
            return ResponseEntity.ok(Response.builder()
                    .status(HttpStatus.OK.value())
                    .isSuccess(true)
                    .body(userInfoResponse)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Response.builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .isSuccess(false)
                            .body(e.getMessage())
                            .build());
        }
    }

    @Override
    public UserInfoResponse getCurrentUserBeforeUpdate() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserInfo userInfo = userInfoRepository.findByAccountEmail(userDetails.getEmail()).orElseThrow();
        String role = userDetails.getAuthorities().toString();
        return UserInfoResponse.builder()
                .name(userInfo.getName())
                .email(userInfo.getAccount().getEmail())
                .phone(userInfo.getPhone())
                .isUpdated(userInfo.isUpdated())
                .role(role)
                .build();
    }

    public UserInfoResponse getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserInfo userInfo = userInfoRepository.findByAccountEmail(userDetails.getEmail()).orElseThrow();
        String role = userDetails.getAuthorities().toString();
        return UserInfoResponse.builder()
                .name(userInfo.getName())
                .email(userInfo.getAccount().getEmail())
                .phone(userInfo.getPhone())
                .dob(userInfo.getDob())
                .nationalId(userInfo.getNationalId())
                .detailAddress(userInfo.getDetailAddress())
                .ward(userInfo.getWard().getName())
                .district(userInfo.getWard().getDistrict().getName())
                .city(userInfo.getWard().getDistrict().getProvince().getName())
                .driverLicense(userInfo.getDriverLicense())
                .isUpdated(userInfo.isUpdated())
                .role(role)
                .build();
    }

    public UserInfo getCurrentUserInfo() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userInfoRepository.findByAccountEmail(userDetails.getEmail()).orElseThrow();
    }

    private void getUserAddressResponse(UserInfo saveUser, UserInfoResponse userInfoResponse) {
        BeanUtils.copyProperties(saveUser, userInfoResponse);
        userInfoResponse.setEmail(saveUser.getAccount().getEmail());
        userInfoResponse.setDriverLicense(saveUser.getDriverLicense());
        if (saveUser.getWard() != null) {
            userInfoResponse.setWard(saveUser.getWard().getName());
            userInfoResponse.setDistrict(saveUser.getWard().getDistrict().getName());
            userInfoResponse.setCity(saveUser.getWard().getDistrict().getProvince().getName());
        }
    }
}
