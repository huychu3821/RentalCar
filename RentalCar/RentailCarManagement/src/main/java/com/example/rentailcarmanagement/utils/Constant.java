package com.example.rentailcarmanagement.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Constant {
    private static final String PASSWORD_PATTERN = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{7,}$";
    private static final Pattern pattern = Pattern.compile(PASSWORD_PATTERN);
    public static final String URL = "http://localhost:8081";
    public static final String FE_URL = "http://localhost:3000";
    public static final String ME000 = "User Not Found.";
    public static final String ME001 = "Either email address or password is incorrect. Please try again";
    public static final String ME002 = "Please enter valid email address";
    public static final String ME003 = "This field is required";
    public static final String ME004 = "Email already existed. Please try another email.";
    public static final String ME005 = "Password and Confirm password don’t match. Please try again";
    public static final String ME006 = "This link has expired. Please go back to Homepage and try again";
    public static final String ME007 = "Please enter location";
    public static final String ME008 = "Please enter pick up date and time";
    public static final String ME009 = "Please enter drop-off date and time";
    public static final String ME010 = "Drop-off date time must be later and Pick-up date time, please try again.";
    public static final String ME011 = "No cars match your credentials, please try again.";
    public static final String ME012 = "Your wallet doesn't have enough balance. Please top-up and try again";
    public static final String ME013 = "Your car has been booked. Please contact our administrator if your car is no longer available for rent.";
    public static final String ME014 = "Password must contain at least one number, one numeral, and seven characters.";
    public static final String ME015 = "The email address you’ve entered does not exist";
    public static final String ME016 = "Phone and National ID cannot be empty";
    public static final String ME017 = "Phone must contain '+' and be followed by numerics.";
    public static boolean isValidPassword(final String password) {
        Matcher matcher = pattern.matcher(password);
        return matcher.matches();
    }

    public static final String EMAIL_REGEX = "^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
    public static final String USERNAME_REGEX = "^[a-zA-Z\\s]+$";
    public static final String PHONE_REGEX ="^\\+\\d{1,3}\\d{9}$";
    public static final String PASSWORD_REGEX ="^(?=.*[0-9])(?=.*[a-zA-Z]).{7,}$";
}