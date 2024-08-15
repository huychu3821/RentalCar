package com.example.rentailcarmanagement.utils;

import com.example.rentailcarmanagement.entities.Account;
import com.example.rentailcarmanagement.entities.AdditionRule;
import com.example.rentailcarmanagement.entities.Booking;
import com.example.rentailcarmanagement.entities.Brand;
import com.example.rentailcarmanagement.entities.Car;
import com.example.rentailcarmanagement.entities.District;
import com.example.rentailcarmanagement.entities.Document;
import com.example.rentailcarmanagement.entities.Feedback;
import com.example.rentailcarmanagement.entities.Model;
import com.example.rentailcarmanagement.entities.Province;
import com.example.rentailcarmanagement.entities.Role;
import com.example.rentailcarmanagement.entities.RuleType;
import com.example.rentailcarmanagement.entities.TransactionType;
import com.example.rentailcarmanagement.entities.UserInfo;
import com.example.rentailcarmanagement.entities.Wallet;
import com.example.rentailcarmanagement.entities.Ward;
import com.example.rentailcarmanagement.entities.enums.EBookingStatus;
import com.example.rentailcarmanagement.entities.enums.ECarStatus;
import com.example.rentailcarmanagement.entities.enums.EPaymentMethod;
import com.example.rentailcarmanagement.entities.enums.ERole;
import com.example.rentailcarmanagement.entities.enums.ERuleType;
import com.example.rentailcarmanagement.entities.enums.ETransactionType;
import com.example.rentailcarmanagement.repository.AccountRepository;
import com.example.rentailcarmanagement.repository.AdditionRuleRepository;
import com.example.rentailcarmanagement.repository.BookingRepository;
import com.example.rentailcarmanagement.repository.BrandRepository;
import com.example.rentailcarmanagement.repository.CarRepository;
import com.example.rentailcarmanagement.repository.DistrictRepository;
import com.example.rentailcarmanagement.repository.DocumentRepository;
import com.example.rentailcarmanagement.repository.FeedbackRepository;
import com.example.rentailcarmanagement.repository.ModelRepository;
import com.example.rentailcarmanagement.repository.ProvinceRepository;
import com.example.rentailcarmanagement.repository.RoleRepository;
import com.example.rentailcarmanagement.repository.RuleTypeRepository;
import com.example.rentailcarmanagement.repository.TransactionTypeRepository;
import com.example.rentailcarmanagement.repository.UserInfoRepository;
import com.example.rentailcarmanagement.repository.WalletRepository;
import com.example.rentailcarmanagement.repository.WardRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileReader;
import java.io.IOException;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.IntStream;

@Component
public class InitData implements CommandLineRunner {

    @Autowired
    private ProvinceRepository provinceRepository;

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private WardRepository wardRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private RuleTypeRepository ruleTypeRepository;

    @Autowired
    private AdditionRuleRepository additionRuleRepository;

    @Autowired
    DocumentRepository documentRepository;

    @Autowired
    TransactionTypeRepository transactionTypeRepository;

    @Autowired
    WalletRepository walletRepository;

//    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.S");


    @Override
    @Transactional
    public void run(String... args) throws IOException, CsvValidationException {
        // Import Address data
        if (provinceRepository.count() == 0 && districtRepository.count() == 0
                && wardRepository.count() == 0) {
            importAddressData();
        }
        // Import role data
        if (roleRepository.count() == 0) {
            importRoleData();
        }

        // Import Brand and Model data
        if (modelRepository.count() == 0 && brandRepository.count() == 0) {
            importModelCarData();
        }
        if (accountRepository.count() == 0) {
            importAccount();
        }
        if (carRepository.count() == 0) {

            importCarData();
        }
        if (bookingRepository.count() == 0) {
            importBookingAndFeedBack();
        }

        if (ruleTypeRepository.count() == 0) {
            importAdditionRule();
        }
        if (transactionTypeRepository.count() == 0) {
            importTransactionType();
        }

//
    }

    public void importAddressData() throws IOException, CsvValidationException {
        try (CSVReader reader = getCsvData("address.csv")) {
            String[] nextLine;

            Ward ward;
            District district = District.builder()
                    .name("")
                    .build();
            Province province = Province.builder()
                    .name("")
                    .build();

            reader.readNext();
            while ((nextLine = reader.readNext()) != null) {
                if (!province.getName().equals(nextLine[5])) {
                    province = Province.builder()
                            .name(nextLine[5])
                            .build();
                    provinceRepository.save(province);

                    district = District.builder()
                            .name(nextLine[3])
                            .province(province)
                            .build();
                    districtRepository.save(district);

                    ward = Ward.builder()
                            .name(nextLine[1].isEmpty() ? district.getName() : nextLine[1])
                            .district(district)
                            .build();
                    wardRepository.save(ward);
                } else if (!district.getName().equals(nextLine[3])) {
                    district = District.builder()
                            .name(nextLine[3])
                            .province(province)
                            .build();
                    districtRepository.save(district);

                    ward = Ward.builder()
                            .name(nextLine[1])
                            .district(district)
                            .build();
                    wardRepository.save(ward);
                } else {
                    ward = Ward.builder()
                            .name(nextLine[1])
                            .district(district)
                            .build();
                    wardRepository.save(ward);
                }
            }
        }
    }

    void importRoleData() {
        roleRepository.save(Role.builder()
                .role(ERole.CUSTOMER).build());
        roleRepository.save(Role.builder()
                .role(ERole.OWNER).build());
    }

    void importModelCarData() throws IOException, CsvValidationException {
        try (CSVReader reader = getCsvData("model.csv")) {
            String[] nextLine;

            Model model;
            Brand brand = Brand.builder()
                    .name("")
                    .build();

            reader.readNext();
            while ((nextLine = reader.readNext()) != null) {
                String newBrand = nextLine[1];

                if (!brand.getName().equals(newBrand)) {
                    brand = Brand.builder()
                            .name(newBrand)
                            .build();
                    brandRepository.save(brand);

                    model = Model.builder()
                            .name(nextLine[2])
                            .brand(brand)
                            .build();
                    modelRepository.save(model);
                    continue;
                }

                model = Model.builder()
                        .name(nextLine[2])
                        .brand(brand)
                        .build();
                modelRepository.save(model);
            }
        }

    }

    void importAccount() {
        Role role = roleRepository.findById(2).orElseThrow(() -> new NoSuchElementException("No Role"));
        UserInfo userInfo = UserInfo.builder()
                .name("Admin")
                .phone("+09880125641")
                .isUpdated(false).build();
        Account account = Account.builder()
                .email("admin@mock.com")
                .password(passwordEncoder.encode("Password@123"))
                .roles(List.of(role))
                .userInfo(userInfo)
                .build();
        userInfo.setAccount(account);
        accountRepository.save(account);
        userInfoRepository.save(userInfo);
        setWallet(account);

        Role customerRole = roleRepository.findById(1).orElseThrow(() -> new NoSuchElementException("No Role"));
        UserInfo customerInfo = UserInfo.builder()
                .name("Customer Wallet 1")
                .phone("+09880125111")
                .isUpdated(false).build();
        Account customerAccount = Account.builder()
                .email("customer@mock.com")
                .password(passwordEncoder.encode("Password@123"))
                .roles(List.of(customerRole))
                .userInfo(customerInfo)
                .build();
        customerInfo.setAccount(customerAccount);
        accountRepository.save(customerAccount);
        userInfoRepository.save(customerInfo);
        setWallet(customerAccount);

        for (int i = 0; i < 2; i++) {
            UserInfo ownerInfo = UserInfo.builder()
                    .name("Owner " + i)
                    .phone("+0988012561" + i)
                    .isUpdated(false).build();
            Account ownerAccount = Account.builder()
                    .email("owner" + i + "@mock.com")
                    .password(passwordEncoder.encode("Password@123"))
                    .roles(List.of(role))
                    .userInfo(ownerInfo)
                    .build();
            ownerInfo.setAccount(ownerAccount);
            ownerInfo.setAccount(ownerAccount);
            accountRepository.save(ownerAccount);
            userInfoRepository.save(ownerInfo);
            setWallet(ownerAccount);
        }

        for (int i = 0; i < 10; i++) {
            UserInfo userInformation = UserInfo.builder()
                    .name("CUSTOMER NAME")
                    .phone("+098012564" + i)
                    .isUpdated(false)
                    .build();
            Account nAccount = Account.builder()
                    .email("customer" + i + "@mock.com")
                    .password(passwordEncoder.encode("Password@123"))
                    .roles(List.of(customerRole))
                    .userInfo(userInformation)
                    .build();
            userInformation.setAccount(nAccount);
            accountRepository.save(nAccount);
            userInfoRepository.save(userInformation);
            setWallet(nAccount);
        }

    }

    void setWallet(Account account) {
        walletRepository.save(Wallet.builder()
                .account(account)
                .balance(BigDecimal.valueOf(0))
                .depositBalance(BigDecimal.valueOf(0))
                .build());
    }


    void importCarData() {

        List<String> srcImages = List.of(
                "02dedfed-a4c8-430b-8ed6-d0a4114e6d30.png",
                "03f85145-1e5d-4e54-862d-797ed471b095.png",
                "09a5cfc2-1e32-44fb-89b8-8f657054ec4b.png",
                "0c11816d-b6da-48b9-876b-ad5d54dcdd4f.jpg",
                "0c2ae9e7-9510-452e-bebc-c1ea45c1225e.png",
                "0c53f0f2-d3a5-4b9a-97ef-dd625bc92feb.jpg",
                "0c71f8c3-632e-461a-897b-2d92e66e36dd.png",
                "0dedad15-0f01-4049-9015-4d146ba35f97.jpg",
                "0e060b9e-1ca8-4a3e-a4a7-f8b9ef3298cf.png",
                "0e566346-fa03-4c5b-a10a-65c03ceeada8.jpg",
                "0fa389b3-ee31-433f-8da9-f752ffb1fbd1.jpg",
                "11d7ef96-66e8-4468-98a6-b0fe4788bf27.jpg",
                "1266b276-ab79-4a82-a7b0-d904188e04ef.jpg",
                "1291948b-b045-48b3-8862-f6368ce1e738.jpg",
                "12cedd26-94a8-4f3a-9962-91d2f9ae1ce6.png"
        );
        Account account = accountRepository.findByEmail("admin@mock.com")
                .orElseThrow(() -> new NoSuchElementException("No Account"));
        Model model = modelRepository.findById(1)
                .orElseThrow(() -> new NoSuchElementException("No Model"));
        Ward wardByCar = wardRepository.findById(1)
                .orElseThrow(() -> new NoSuchElementException("ward not found"));

        Document document = Document.builder()
                .certificate(getRandomElement(srcImages))
                .insurance(getRandomElement(srcImages))
                .build();

        Car firstCar = Car.builder()
                .address("Số 1")
                .basePrice(new BigDecimal("1000.00"))
                .carStatus(ECarStatus.AVAILABLE)
                .color("black")
                .deposit(new BigDecimal("15000000.00"))
                .description("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
                .fuelConsumption("1000")
                .fuelType("Petrol")
                .licensePlate("17B2-9451")
                .mileage(10000.0)
                .numberOfSeats(7)
                .productionYear(2024)
                .transmissionType("automatic")
                // Assuming account, model, and ward IDs are known
                .account(account) // Replace with actual account object or ID
                .model(model) // Replace with actual model object or ID
                .ward(wardByCar) // Replace with actual ward object or ID
                .backImage("0e060b9e-1ca8-4a3e-a4a7-f8b9ef3298cf.png")
                .frontImage("40c77de3-987e-4cce-a9c9-dec015b9e153.png")
                .leftImage("48bae5a6-0f59-4e51-88bd-65f604588a4b.png")
                .rightImage("af52b196-71e6-4d27-8844-835d97234c8c.png")
                .document(document)
                .build();

        document.setCar(firstCar);
        carRepository.save(firstCar);
        documentRepository.save(document);

        List<Model> models = modelRepository.findAll();
        List<Ward> wards = wardRepository.findAll();

        accountRepository.findAll()
                .stream()
                .filter(acc -> acc.getRoles().stream()
                        .map(Role::getRole)
                        .toList()
                        .contains(ERole.OWNER)
                )
                .toList()
                .forEach(owner -> IntStream.range(0, 20).forEach(index -> {
                    Car nCar = Car.builder()
                            .address("Số " + index)
                            .basePrice(new BigDecimal("1000000.00"))
                            .carStatus(ECarStatus.AVAILABLE)
                            .color("black")
                            .deposit(new BigDecimal("1000000.00"))
                            .description("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
                            .fuelConsumption("1000")
                            .fuelType("Petrol")
                            .licensePlate("17B2-123" + index)
                            .mileage(1000.0)
                            .numberOfSeats(7)
                            .productionYear(2024)
                            .transmissionType("automatic")
                            // Assuming account, model, and ward IDs are known
                            .account(owner) // Replace with actual account object or ID
                            .model(getRandomElement(models)) // Replace with actual model object or ID
                            .ward(getRandomElement(wards)) // Replace with actual ward object or ID
                            .backImage(getRandomElement(srcImages))
                            .frontImage(getRandomElement(srcImages))
                            .leftImage(getRandomElement(srcImages))
                            .rightImage(getRandomElement(srcImages))
                            .document(document)
                            .build();
                    document.setCar(nCar);
                    carRepository.save(nCar);
                    documentRepository.save(document);
                }));

    }

    void importBookingAndFeedBack() {
        SecureRandom random = new SecureRandom();

        List<Car> cars = carRepository.findAll();
        LocalDateTime start = generateRandomDateTime();
        LocalDateTime end = start.plusDays(random.nextInt(3) + 1);

        //COMPLETED
        IntStream.range(0, cars.size() / 2).forEach(i -> {
            Account account = accountRepository.findByEmail("customer" + random.nextInt(10) + "@mock.com")
                    .orElseThrow(() -> new NoSuchElementException("Account not found"));
            Car car = getRandomElement(cars);

            Booking booking = Booking.builder()
                    .startDate(start)
                    .endDate(end)
                    .basePrice(BigDecimal.valueOf(random.nextDouble(1000)))
                    .deposit(BigDecimal.valueOf(random.nextDouble(1000)))
                    .paymentMethod(EPaymentMethod.CASH)
                    .status(EBookingStatus.COMPLETED)
                    .name(account.getUserInfo().getName())
                    .phone(account.getUserInfo().getPhone())
                    .dob(account.getUserInfo().getDob())
                    .nationalId(account.getUserInfo().getNationalId())
                    .detailAddress("123 Main Street")
                    .ward("Phường Phúc Xá")
                    .district("Quận Ba Đình")
                    .city("Thành Phố Hà Nội")
                    .license("03f85145-1e5d-4e54-862d-797ed471b095.png")
                    .email(account.getEmail())
                    .nameDriver("Jane Smith")
                    .phoneDriver("+0987654321")
                    .dobDriver(account.getUserInfo().getDob())
                    .nationalIdDriver("ID987654321")
                    .detailAddressDriver("456 Secondary Street")
                    .wardDriver("Phường Phúc Xá")
                    .districtDriver("Quận Ba Đình")
                    .cityDriver("Thành Phố Hà Nội")
                    .driverLicense("03f85145-1e5d-4e54-862d-797ed471b095.png")
                    .emailDriver("janesmith@example.com")
                    .otherMoney(new BigDecimal("3000000.00"))
                    .car(car) // Assuming Car class has a no-args constructor
                    .account(account) // Assuming Account class has a no-args constructor
                    .build();

            booking.setBookingNumber(generateBookingNumber(booking.getId()));
            booking.setTotalAmount(BigDecimal.valueOf((Duration.between(start, end).toDays() + 1)).multiply(booking.getBasePrice()));

            int index = (random.nextInt(5) + 1);
            String[] content = {"Terrible", "Bad", "Acceptable", "NICE CAR", "GREAT"};
            Feedback feedback = Feedback.builder()
                    .rate((double) index)
                    .booking(booking)
                    .content(content[index - 1])
                    .build();
            Booking saved = bookingRepository.save(booking);
            feedbackRepository.save(feedback);
            booking.setTotalAmount(BigDecimal.valueOf((Duration.between(start, end).toDays() + 1)).multiply(booking.getBasePrice()));
            booking.setBookingNumber(generateBookingNumber(saved.getId()));
            bookingRepository.save(booking);
        });

        //IN-PROGRESS
        IntStream.range(0, cars.size() / 2).forEach(i -> {
            Account account = accountRepository.findByEmail("customer" + random.nextInt(10) + "@mock.com")
                    .orElseThrow(() -> new NoSuchElementException("Account not found"));
            Car car = getRandomElement(cars);

            Booking booking = Booking.builder()
                    .startDate(start)
                    .endDate(end)
                    .basePrice(BigDecimal.valueOf(random.nextDouble(1000)))
                    .deposit(BigDecimal.valueOf(random.nextDouble(1000)))
                    .paymentMethod(EPaymentMethod.CASH)
                    .status(EBookingStatus.IN_PROGRESS)
                    .name(account.getUserInfo().getName())
                    .phone(account.getUserInfo().getPhone())
                    .dob(account.getUserInfo().getDob())
                    .nationalId(account.getUserInfo().getNationalId())
                    .detailAddress("123 Main Street")
                    .ward("Phường Phúc Xá")
                    .district("Quận Ba Đình")
                    .city("Thành Phố Hà Nội")
                    .license("03f85145-1e5d-4e54-862d-797ed471b095.png")
                    .email(account.getEmail())
                    .nameDriver("Jane Smith")
                    .phoneDriver("+0987654321")
                    .dobDriver(account.getUserInfo().getDob())
                    .nationalIdDriver("ID987654321")
                    .detailAddressDriver("456 Secondary Street")
                    .wardDriver("Phường Phúc Xá")
                    .districtDriver("Quận Ba Đình")
                    .cityDriver("Thành Phố Hà Nội")
                    .driverLicense("03f85145-1e5d-4e54-862d-797ed471b095.png")
                    .emailDriver("janesmith@example.com")
                    .otherMoney(new BigDecimal("3000000.00"))
                    .car(car) // Assuming Car class has a no-args constructor
                    .account(account) // Assuming Account class has a no-args constructor
                    .build();
            booking.setTotalAmount(BigDecimal.valueOf((Duration.between(start, end).toDays() + 1)).multiply(booking.getBasePrice()));
            Booking saved = bookingRepository.save(booking);
            car.setCarStatus(ECarStatus.BOOKED);
            carRepository.save(car);
            booking.setBookingNumber(generateBookingNumber(saved.getId()));
            bookingRepository.save(booking);
        });
    }

    void importAdditionRule() {
        RuleType addition = RuleType.builder()
                .eRuleType(ERuleType.ADDITION_FUNCTION)
                .build();

        RuleType termUse = RuleType.builder()
                .eRuleType(ERuleType.TERM_OF_USE)
                .build();

        ruleTypeRepository.saveAllAndFlush(List.of(addition, termUse));

        AdditionRule bluetooth = AdditionRule.builder()
                .name("Bluetooth")
                .ruleType(addition)
                .build();

        AdditionRule gps = AdditionRule.builder()
                .name("GPS")
                .ruleType(addition)
                .build();

        AdditionRule camera = AdditionRule.builder()
                .name("Camera")
                .ruleType(addition)
                .build();

        AdditionRule sunRoof = AdditionRule.builder()
                .name("Sun roof")
                .ruleType(addition)
                .build();

        AdditionRule childLock = AdditionRule.builder()
                .name("Child lock")
                .ruleType(addition)
                .build();

        AdditionRule childSeat = AdditionRule.builder()
                .name("Child seat")
                .ruleType(addition)
                .build();

        AdditionRule dvd = AdditionRule.builder()
                .name("DVD")
                .ruleType(addition)
                .build();

        AdditionRule usb = AdditionRule.builder()
                .name("USB")
                .ruleType(addition)
                .build();

        AdditionRule noSmoking = AdditionRule.builder()
                .name("No smoking")
                .ruleType(termUse)
                .build();

        AdditionRule noFoodInCar = AdditionRule.builder()
                .name("No food in car")
                .ruleType(termUse)
                .build();

        AdditionRule noPet = AdditionRule.builder()
                .name("No pet")
                .ruleType(termUse)
                .build();

        AdditionRule other = AdditionRule.builder()
                .name("Other")
                .ruleType(termUse)
                .build();

        additionRuleRepository.saveAll(List.of(bluetooth, gps, camera, sunRoof, childLock, childSeat, dvd, usb, noSmoking, noFoodInCar, noPet, other));

    }

    void importTransactionType() {
        TransactionType withdrawal = TransactionType.builder()
                .eTransactionType(ETransactionType.WITHDRAWAL)
                .build();

        TransactionType topUp = TransactionType.builder()
                .eTransactionType(ETransactionType.TOP_UP)
                .build();

        TransactionType payDeposit = TransactionType.builder()
                .eTransactionType(ETransactionType.PAY_DEPOSIT)
                .build();

        TransactionType receiveDeposit = TransactionType.builder()
                .eTransactionType(ETransactionType.RECEIVE_DEPOSIT)
                .build();

        TransactionType refundDeposit = TransactionType.builder()
                .eTransactionType(ETransactionType.REFUND_DEPOSIT)
                .build();

        TransactionType offsetFinalPayment = TransactionType.builder()
                .eTransactionType(ETransactionType.OFFSET_FINAL_PAYMENT)
                .build();

        transactionTypeRepository.saveAll(List.of(withdrawal, topUp, payDeposit, receiveDeposit, refundDeposit, offsetFinalPayment));
    }


    private CSVReader getCsvData(String path) throws IOException {
        String filePath = new ClassPathResource(path).getFile().getAbsolutePath();
        return new CSVReader(new FileReader(filePath));
    }

    public static LocalDateTime generateRandomDateTime() {
        long minDay = LocalDate.of(2023, 1, 1).toEpochDay();
        long maxDay = LocalDate.of(2024, 1, 1).toEpochDay();
        long randomDay = ThreadLocalRandom.current().nextLong(minDay, maxDay);

        return LocalDateTime.of(LocalDate.ofEpochDay(randomDay), LocalTime.MIN);
    }

    public static String generateBookingNumber(Long id) {
        LocalDate currentDate = LocalDate.now();
        String formattedDate = currentDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return formattedDate + "-" + id;
    }

    public static <T> T getRandomElement(List<T> list) {
        Random random = new Random();
        return list.get(random.nextInt(list.size()));
    }
}
