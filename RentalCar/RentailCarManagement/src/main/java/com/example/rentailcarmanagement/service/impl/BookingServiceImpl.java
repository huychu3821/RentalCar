package com.example.rentailcarmanagement.service.impl;

import com.example.rentailcarmanagement.entities.Booking;
import com.example.rentailcarmanagement.entities.Car;
import com.example.rentailcarmanagement.entities.UserInfo;
import com.example.rentailcarmanagement.entities.enums.EBookingStatus;
import com.example.rentailcarmanagement.entities.enums.ECarStatus;
import com.example.rentailcarmanagement.entities.enums.EChangeType;
import com.example.rentailcarmanagement.entities.enums.EPaymentMethod;
import com.example.rentailcarmanagement.entities.enums.ETransactionType;
import com.example.rentailcarmanagement.exception.BadRequest;
import com.example.rentailcarmanagement.exception.NoneRecordFoundException;
import com.example.rentailcarmanagement.exception.WalletNotFoundException;
import com.example.rentailcarmanagement.payload.Response;
import com.example.rentailcarmanagement.payload.request.BookingRequest;
import com.example.rentailcarmanagement.payload.request.TransactionRequest;
import com.example.rentailcarmanagement.payload.response.BookingListResponse;
import com.example.rentailcarmanagement.payload.response.BookingResponse;
import com.example.rentailcarmanagement.repository.BookingRepository;
import com.example.rentailcarmanagement.repository.CarRepository;
import com.example.rentailcarmanagement.service.BookingService;
import com.example.rentailcarmanagement.service.MailSendingService;
import com.example.rentailcarmanagement.service.UserService;
import com.example.rentailcarmanagement.service.WalletService;
import com.example.rentailcarmanagement.utils.ImageUploadService;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {
    private final UserService userService;
    private final ImageUploadService imageUploadService;
    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final MailSendingService mailSendingService;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
    private final WalletService walletService;

    public BookingServiceImpl(UserServiceImp userService, ImageUploadService imageUploadService, BookingRepository bookingRepository, CarRepository carRepository, MailSendingServiceImpl mailSendingService, WalletService walletService) {
        this.userService = userService;
        this.imageUploadService = imageUploadService;
        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
        this.mailSendingService = mailSendingService;
        this.walletService = walletService;
    }

    @Transactional
    @Override
    public BookingResponse addBooking(BookingRequest bookingRequest, MultipartFile file, MultipartFile fileDriver, LocalDateTime start, LocalDateTime end) {
        Booking booking = new Booking();
        BookingResponse bookingResponse = new BookingResponse();
        Car car = carRepository.findById(bookingRequest.getCarId()).orElseThrow();
        if (!bookingRequest.getNameDriver().isEmpty()) {
            booking.setNameDriver(bookingRequest.getNameDriver());
        }
        booking.setPhoneDriver(bookingRequest.getPhoneDriver());
        if (bookingRequest.getDobDriver() != null) {
            booking.setDobDriver(bookingRequest.getDobDriver());
        }
        booking.setNationalIdDriver(bookingRequest.getNationalIdDriver());
        if (!bookingRequest.getDetailAddressDriver().isEmpty()) {
            booking.setDetailAddressDriver(bookingRequest.getDetailAddressDriver());
        }
        if (!bookingRequest.getCityDriver().isEmpty() && !bookingRequest.getDistrictDriver().isEmpty() && !bookingRequest.getWardDriver().isEmpty()) {
            booking.setDistrictDriver(bookingRequest.getDistrictDriver());
            booking.setCityDriver(bookingRequest.getCityDriver());
            booking.setWardDriver(bookingRequest.getWardDriver());
        }
        UserInfo userInfo = userService.getCurrentUserInfo();
        booking.setAccount(userInfo.getAccount());
        booking.getAccount().setUserInfo(userInfo);
        booking.setStartDate(start);
        booking.setEndDate(end);
        booking.setCar(car);
        booking.setTotalAmount(BigDecimal.valueOf(((int) Duration.between(start, end).toDays() + 1)).multiply(booking.getCar().getBasePrice()));
        booking.setBasePrice(booking.getCar().getBasePrice());
        booking.setDeposit(booking.getCar().getDeposit());
        booking.setEmail(bookingRequest.getEmail());
        booking.setName(bookingRequest.getName());
        booking.setPhone(bookingRequest.getPhone());
        booking.setDob(bookingRequest.getDob());
        booking.setNationalId(bookingRequest.getNationalId());
        booking.setDetailAddress(bookingRequest.getDetailAddress());
        booking.setWard(bookingRequest.getWard());
        booking.setDistrict(bookingRequest.getDistrict());
        booking.setCity(bookingRequest.getCity());
        booking.setEmailDriver(bookingRequest.getEmailDriver());
        booking.setNameDriver(bookingRequest.getNameDriver());
        booking.setPhoneDriver(bookingRequest.getPhoneDriver());
        booking.setDobDriver(bookingRequest.getDobDriver());
        booking.setNationalIdDriver(bookingRequest.getNationalIdDriver());
        booking.setDetailAddressDriver(bookingRequest.getDetailAddressDriver());
        booking.setWardDriver(bookingRequest.getWardDriver());
        booking.setDistrictDriver(bookingRequest.getDistrictDriver());
        booking.setCityDriver(bookingRequest.getCityDriver());
        booking.setLicense(bookingRequest.getDriverLicense());
        booking.setDriverLicense(bookingRequest.getDriverLicenseDriver());
        Booking saveBooking = bookingRepository.save(booking);
        booking.setBookingNumber(generateBookingNumber(saveBooking.getId()));
        if (bookingRequest.getPaymentMethod().equals("CASH")) {
            booking.setStatus(EBookingStatus.PENDING_DEPOSIT);
            booking.setPaymentMethod(EPaymentMethod.CASH);
            booking.getCar().setCarStatus(ECarStatus.BOOKED);
            bookingResponse.setStatus(String.valueOf(EBookingStatus.PENDING_DEPOSIT.label));
            bookingResponse.setPaymentMethod(EPaymentMethod.CASH.label);
        } else if (bookingRequest.getPaymentMethod().equals("BANK_TRANSFER")) {
            booking.setStatus(EBookingStatus.PENDING_DEPOSIT);
            booking.setPaymentMethod(EPaymentMethod.BANK_TRANSFER);
            booking.getCar().setCarStatus(ECarStatus.BOOKED);
            bookingResponse.setStatus(String.valueOf(EBookingStatus.PENDING_DEPOSIT.label));
            bookingResponse.setPaymentMethod(EPaymentMethod.BANK_TRANSFER.label);
        }
        if (bookingRequest.getPaymentMethod().equals("WALLET")) {
            BigDecimal surplus = booking.getAccount().getWallet().getBalance().subtract(booking.getDeposit());
            if (surplus.compareTo(BigDecimal.ZERO) < 0) {
                throw new WalletNotFoundException("Not sufficient balance");
            } else {
                booking.getCar().setCarStatus(ECarStatus.BOOKED);
                walletService.saveTransaction(TransactionRequest.builder()
                        .bookingId(booking.getId())
                        .accountId(booking.getCar().getAccount().getId())
                        .changeType(EChangeType.INCREASE)
                        .transactionType(ETransactionType.RECEIVE_DEPOSIT)
                        .changeAmount(booking.getDeposit())
                        .build()
                );

                walletService.saveTransaction(
                        TransactionRequest.builder()
                                .bookingId(booking.getId())
                                .accountId(booking.getAccount().getId())
                                .changeType(EChangeType.DECREASE)
                                .transactionType(ETransactionType.PAY_DEPOSIT)
                                .changeAmount(booking.getDeposit())
                                .build()
                );
            }
            booking.setStatus(EBookingStatus.CONFIRMED);
            booking.setPaymentMethod(EPaymentMethod.WALLET);
        }
        bookingRepository.save(booking);
        bookingResponse = bookingResponseMapper(booking);
        bookingResponse.setBookingNumber(booking.getBookingNumber());
        try {
            if (fileDriver != null){
                String uploadFileDriver = imageUploadService.upload(fileDriver);
                booking.setDriverLicense(uploadFileDriver);
            }
            if (file != null) {
                String uploadFile = imageUploadService.upload(file);
                booking.setLicense(uploadFile);
            }
            bookingRepository.save(booking);
        } catch (Exception e) {
            e.printStackTrace();
        }
        booking.getCar().setCarStatus(ECarStatus.BOOKED);
        bookingRepository.save(booking);
        mailSendingService.successfulBooking(booking);
        return bookingResponse;
    }

    @Override
    public Optional<Booking> findById(Long id) {
        return bookingRepository.findById(id);
    }

    @Transactional
    @Override
    public BookingResponse updateBooking(BookingRequest bookingRequest, Long id, MultipartFile file, MultipartFile fileDriver) {
        Optional<Booking> bookingOptional = findById(id);
        if (bookingOptional.isEmpty()) {
            return null;
        }
        Booking booking = bookingOptional.get();
        booking.setEmail(bookingRequest.getEmail());
        booking.setName(bookingRequest.getName());
        booking.setPhone(bookingRequest.getPhone());
        booking.setDob(bookingRequest.getDob());
        booking.setNationalId(bookingRequest.getNationalId());
        booking.setDetailAddress(bookingRequest.getDetailAddress());
        booking.setWard(bookingRequest.getWard());
        booking.setDistrict(bookingRequest.getDistrict());
        booking.setCity(bookingRequest.getCity());
        booking.setEmailDriver(bookingRequest.getEmailDriver());
        booking.setNameDriver(bookingRequest.getNameDriver());
        booking.setPhoneDriver(bookingRequest.getPhoneDriver());
        booking.setDobDriver(bookingRequest.getDobDriver());
        booking.setNationalIdDriver(bookingRequest.getNationalIdDriver());
        booking.setDetailAddressDriver(bookingRequest.getDetailAddressDriver());
        booking.setWardDriver(bookingRequest.getWardDriver());
        booking.setDistrictDriver(bookingRequest.getDistrictDriver());
        booking.setCityDriver(bookingRequest.getCityDriver());
        try {
            if (fileDriver != null){
                String uploadFileDriver = imageUploadService.upload(fileDriver);
                booking.setDriverLicense(uploadFileDriver);
            }
            if (file != null) {
                String uploadFile = imageUploadService.upload(file);
                booking.setLicense(uploadFile);
            }
            bookingRepository.save(booking);
        } catch (Exception e) {
            e.printStackTrace();
            bookingRepository.save(booking);
            return bookingResponseMapper(booking);
        }
        bookingRepository.save(booking);
        return bookingResponseMapper(booking);
    }

    @Override
    public ResponseEntity<?> getUserBooking(String userId, Integer page, Integer size, String sort) {
        List<Booking> bookings = bookingRepository.findByAccountId(userId);
        Map<Object, Object> message = new HashMap<>();

        if (bookings.isEmpty()) throw new NoneRecordFoundException("No Booking has found");

        Comparator<Booking> bookingComparator = switch (sort) {
            case "price_low_high" -> Comparator.comparing(Booking::getTotalAmount);
            case "price_high_low" -> Comparator.comparing(Booking::getTotalAmount).reversed();
            case "latest_to_newest" -> Comparator.comparing(Booking::getId);
            default -> Comparator.comparing(Booking::getId).reversed();
        };
        bookings = sortItems(bookings, bookingComparator);

        DateTimeFormatter displayDateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy - HH:mm");

        int totalPage = (int) Math.ceil((double) (bookings.size()) / size);
        int startItem = (page - 1) * size;
        int endItem = Math.min(startItem + size, (bookings.size()));

        List<BookingListResponse> responses = bookings.stream()
                .map(booking -> BookingListResponse.builder()
                        .bookingNumber(booking.getBookingNumber())
                        .basePrice(booking.getBasePrice())
                        .name(booking.getCar().getModel().getBrand().getName() + " " +
                                booking.getCar().getModel().getName())
                        .pickUpDateTime(booking.getStartDate().format(displayDateFormatter))
                        .returnDateTime(booking.getEndDate().format(displayDateFormatter))
                        .numberOfDays(Duration.between(booking.getStartDate(), booking.getEndDate()).toDays() + 1)
                        .total(BigDecimal.valueOf((Duration.between(booking.getStartDate(), booking.getEndDate()).toDays() + 1)).multiply(booking.getBasePrice()))
                        .deposit(booking.getDeposit())
                        .status(booking.getStatus().toString())
                        .frontImage(booking.getCar().getFrontImage())
                        .backImage(booking.getCar().getBackImage())
                        .leftImage(booking.getCar().getLeftImage())
                        .rightImage(booking.getCar().getRightImage())
                        .id(booking.getId())
                        .build())
                .toList().subList(startItem, endItem);

        message.put("result", responses);
        message.put("page", page);
        message.put("size", size);
        message.put("total_page", totalPage);
        message.put("total_item", bookings.size());
        return ResponseEntity.ok().body(Response.builder()
                .status(HttpStatus.OK.value())
                .isSuccess(true)
                .body(message)
                .build());
    }

    @Override
    @Transactional
    public ResponseEntity<?> cancelBooking(Long bookingId) {
        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new BadRequest("Not found booking"));

            if (booking.getStatus().equals(EBookingStatus.IN_PROGRESS) ||
                    booking.getStatus().equals(EBookingStatus.COMPLETED) ||
                    booking.getStatus().equals(EBookingStatus.PENDING_PAYMENT)) {
                throw new BadRequest("Cannot cancel booking.");
            }

            booking.getTransactionHistories()
                    .stream()
                    .filter(transactionHistory -> transactionHistory.getTransactionType().getETransactionType().equals(ETransactionType.RECEIVE_DEPOSIT) ||
                            transactionHistory.getTransactionType().getETransactionType().equals(ETransactionType.PAY_DEPOSIT))
                    .toList()
                    .forEach(transaction -> {
                        if (transaction.getTransactionType().getETransactionType().equals(ETransactionType.RECEIVE_DEPOSIT)) {
                            TransactionRequest request = TransactionRequest.builder()
                                    .changeAmount(transaction.getChangeAmount())
                                    .changeType(EChangeType.DECREASE)
                                    .transactionType(ETransactionType.REFUND_DEPOSIT)
                                    .bookingId(booking.getId())
                                    .accountId(booking.getCar().getAccount().getId())
                                    .build();
                            walletService.saveTransaction(request);
                        }
                        if (transaction.getTransactionType().getETransactionType().equals(ETransactionType.PAY_DEPOSIT)) {
                            TransactionRequest request = TransactionRequest.builder()
                                    .changeAmount(transaction.getChangeAmount())
                                    .changeType(EChangeType.INCREASE)
                                    .transactionType(ETransactionType.REFUND_DEPOSIT)
                                    .bookingId(booking.getId())
                                    .accountId(transaction.getWallet().getAccount().getId())
                                    .build();
                            walletService.saveTransaction(request);
                        }
                    });

            if (booking.getOtherMoney() != null && booking.getOtherMoney().compareTo(BigDecimal.valueOf(0)) > 0) {
                booking.setOtherMoney(BigDecimal.valueOf(0));
            }

            booking.setStatus(EBookingStatus.CANCELLED);
            Car car = booking.getCar();
            car.setCarStatus(ECarStatus.AVAILABLE);
            Booking savedBooking = bookingRepository.save(booking);
            carRepository.save(car);

            BookingResponse bookingResponse = new BookingResponse();
            BeanUtils.copyProperties(savedBooking, bookingResponse);
            bookingResponse.setPaymentMethod(savedBooking.getPaymentMethod().label);
            bookingResponse.setCarName(savedBooking.getCar().getModel().getBrand().getName() + " " + savedBooking.getCar().getModel().getName());
            bookingResponse.setStatus(savedBooking.getStatus().label);
            bookingResponse.setCarId(savedBooking.getCar().getId());

            return ResponseEntity.ok(
                    Response.builder()
                            .status(HttpStatus.OK.value())
                            .isSuccess(true)
                            .body(bookingResponse)
                            .build()
            );
        } catch (Exception e) {
            throw new BadRequest(e.getMessage());
        }
    }

    @Override
    public void confirmPickUp(Booking booking) {
        booking.setStatus(EBookingStatus.IN_PROGRESS);
        bookingRepository.save(booking);
    }

    @Override
    public ResponseEntity<?> confirmDeposit(long carId, long bookingId) {
        try {
            Car car = carRepository.findById(carId).orElse(null);
            Booking booking = bookingRepository.findById(bookingId).orElse(null);
            if (car != null && booking != null) {
                booking.setOtherMoney(car.getDeposit());
                booking.setStatus(EBookingStatus.CONFIRMED);
                bookingRepository.save(booking);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Response.builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .isSuccess(false)
                            .body(e.getMessage())
                            .build());
        }
        return ResponseEntity.ok(Response.builder()
                .status(HttpStatus.OK.value())
                .isSuccess(true)
                .body("Confirm deposit successfully!")
                .build());
    }

    @Override
    public ResponseEntity<?> confirmPayment(long carId, long bookingId) {
        try {
            Car car = carRepository.findById(carId).orElse(null);
            Booking booking = bookingRepository.findById(bookingId).orElse(null);
            if (car != null && booking != null) {
                BigDecimal surplus = booking.getTotalAmount().subtract(car.getDeposit());
                // vi cua customer du de tra
                if (booking.getAccount().getWallet().getBalance().compareTo(surplus) > 0) {
                    walletService.saveTransaction(TransactionRequest.builder()
                            .changeAmount(surplus)
                            .changeType(EChangeType.DECREASE)
                            .transactionType(ETransactionType.OFFSET_FINAL_PAYMENT)
                            .bookingId(booking.getId())
                            .accountId(booking.getAccount().getId())
                            .build());

                    walletService.saveTransaction(TransactionRequest.builder()
                            .changeAmount(booking.getTotalAmount())
                            .changeType(EChangeType.INCREASE)
                            .transactionType(ETransactionType.OFFSET_FINAL_PAYMENT)
                            .bookingId(booking.getId())
                            .accountId(booking.getCar().getAccount().getId())
                            .build());

                    booking.getCar().getAccount().getWallet()
                            .setDepositBalance(BigDecimal.valueOf(0));

                    car.setCarStatus(ECarStatus.AVAILABLE);
                    booking.setStatus(EBookingStatus.COMPLETED);

                    booking.setCar(car);
                    bookingRepository.save(booking);
                    carRepository.save(car);
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Response.builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .isSuccess(false)
                            .body(e.getMessage())
                            .build());
        }
        return ResponseEntity.ok(Response.builder()
                .status(HttpStatus.OK.value())
                .isSuccess(true)
                .body("Confirm payment successfully!")
                .build());
    }

    @Override
    public BookingResponse findByCar(long carId) {
        Car car = carRepository.findById(carId).orElse(null);
        Booking booking = bookingRepository.findByCarOrderByIdDesc(car).get(0);
        return bookingResponseMapper(booking);
    }

    @Override
    public void returnCar(Booking booking) {
        BigDecimal surplus = booking.getDeposit().subtract(booking.getTotalAmount()).abs();
        // tien dat coc it hon tien thue xe
        if (booking.getTotalAmount().compareTo(booking.getDeposit()) > 0) {
            // vi nhieu hon khoan con lai
            if (booking.getAccount().getWallet().getBalance().compareTo(surplus) > 0) {
                booking.setStatus(EBookingStatus.COMPLETED);
                walletService.saveTransaction(
                        TransactionRequest.builder()
                                .bookingId(booking.getId())
                                .accountId(booking.getCar().getAccount().getId())
                                .changeAmount(surplus.add(booking.getCar().getAccount().getWallet().getDepositBalance()))
                                .changeType(EChangeType.INCREASE)
                                .transactionType(ETransactionType.OFFSET_FINAL_PAYMENT)
                                .build());
                walletService.saveTransaction(
                        TransactionRequest.builder()
                                .bookingId(booking.getId())
                                .accountId(booking.getAccount().getId())
                                .changeAmount(surplus)
                                .changeType(EChangeType.DECREASE)
                                .transactionType(ETransactionType.OFFSET_FINAL_PAYMENT)
                                .build());
            } else {
                // vi it hon khoan con lai
                booking.setStatus(EBookingStatus.PENDING_PAYMENT);
            }
        } else {
            booking.setStatus(EBookingStatus.COMPLETED);
            if (booking.getPaymentMethod().equals(EPaymentMethod.WALLET)) {
                // owner chi nhan dc tien cho thue xe, tien dat coc dc cong va reset
                booking.getCar().getAccount().getWallet().setDepositBalance(BigDecimal.valueOf(0));
                walletService.saveTransaction(
                        TransactionRequest.builder()
                                .bookingId(booking.getId())
                                .accountId(booking.getCar().getAccount().getId())
                                .changeAmount(booking.getTotalAmount())
                                .changeType(EChangeType.INCREASE)
                                .transactionType(ETransactionType.OFFSET_FINAL_PAYMENT)
                                .build());

                // customer cong lai so tien thua tu dat coc
                walletService.saveTransaction(
                        TransactionRequest.builder()
                                .bookingId(booking.getId())
                                .accountId(booking.getAccount().getId())
                                .changeAmount(surplus)
                                .changeType(EChangeType.INCREASE)
                                .transactionType(ETransactionType.OFFSET_FINAL_PAYMENT)
                                .build());
            } else {
                // tien du dc owner chuyen lai cho customer, tu confirm voi nhau
                booking.setOtherMoney(booking.getTotalAmount());
            }

        }
        booking.getCar().setCarStatus(ECarStatus.AVAILABLE);
        mailSendingService.sendReturnCarMail(booking);
        bookingRepository.save(booking);
    }

    @Override
    public void pendingPayment(Booking booking) {
        booking.setStatus(EBookingStatus.PENDING_PAYMENT);
        bookingRepository.save(booking);
    }

    public static String generateBookingNumber(Long id) {
        LocalDate currentDate = LocalDate.now();
        String formattedDate = currentDate.format(DATE_FORMATTER);
        return formattedDate + "-" + id;
    }

    public static BookingResponse bookingResponseMapper(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .carId(booking.getCar().getId())
                .bookingNumber(booking.getBookingNumber())
                .endDate(booking.getEndDate())
                .startDate(booking.getStartDate())
                .totalAmount(booking.getTotalAmount())
                .paymentMethod(booking.getPaymentMethod().name())
                .deposit(booking.getDeposit())
                .basePrice(booking.getCar().getBasePrice())
                .status(booking.getStatus().name())
                .carName(booking.getCar().getModel().getName() + booking.getCar().getModel().getBrand().getName())
                .name(booking.getName())
                .phone(booking.getPhone())
                .dob(booking.getDob())
                .nationalId(booking.getNationalId())
                .detailAddress(booking.getDetailAddress())
                .ward(booking.getWard())
                .district(booking.getDistrict())
                .city(booking.getCity())
                .license(booking.getLicense())
                .email(booking.getEmail())
                .nameDriver(booking.getNameDriver())
                .phoneDriver(booking.getPhoneDriver())
                .dobDriver(booking.getDobDriver())
                .nationalIdDriver(booking.getNationalIdDriver())
                .detailAddressDriver(booking.getDetailAddressDriver())
                .wardDriver(booking.getWardDriver())
                .districtDriver(booking.getDistrictDriver())
                .driverLicense(booking.getDriverLicense())
                .cityDriver(booking.getCityDriver())
                .emailDriver(booking.getEmailDriver())
                .build();
    }

    public static <T> List<T> sortItems(List<T> items, Comparator<T> comparator) {
        return items.stream()
                .sorted(comparator)
                .collect(Collectors.toList());
    }
}
