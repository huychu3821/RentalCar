package com.example.rentailcarmanagement.controller;

import com.example.rentailcarmanagement.payload.Response;
import com.example.rentailcarmanagement.payload.request.LoginRequest;
import com.example.rentailcarmanagement.payload.request.RegisterRequest;
import com.example.rentailcarmanagement.payload.response.JwtResponse;
import com.example.rentailcarmanagement.security.jwt.JwtUtils;
import com.example.rentailcarmanagement.security.service.UserDetailsImpl;
import com.example.rentailcarmanagement.service.AccountService;
import com.example.rentailcarmanagement.utils.Constant;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final AccountService accountService;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, AccountService accountService, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.accountService = accountService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles));
        } catch (AuthenticationException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", 401);
            errorResponse.put("success", Boolean.FALSE);
            errorResponse.put("message", Constant.ME001);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = accountService.existedEmail(email);
        Map<String, Boolean> message = new HashMap<>();
        message.put("exists", exists);
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        Map<String, Object> message = new HashMap<>();

        if (accountService.existedEmail(registerRequest.getEmail())) {
            message.put("message", Constant.ME004);
            message.put("status", 400);
            message.put("success", Boolean.FALSE);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
        }

        if (!registerRequest.getConfirmPassword().equals(registerRequest.getPassword())) {
            message.put("message", Constant.ME005);
            message.put("status", 400);
            message.put("success", Boolean.FALSE);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
        }

        accountService.registerAccount(registerRequest);

        message.put("status", 200);
        message.put("success", Boolean.TRUE);
        message.put("message", "Register Success");
        return ResponseEntity.ok(message);
    }
    @GetMapping("/logout")
    public ResponseEntity<?> logout(){
        SecurityContextHolder.clearContext();
        Map<String, Object> message = new HashMap<>();
        message.put("message", "Log out successful");
        Response<Object> response = Response.builder()
                .isSuccess(true)
                .status(HttpStatus.OK.value())
                .body(message)
                .build();
        return ResponseEntity.ok(response);
    }
}
