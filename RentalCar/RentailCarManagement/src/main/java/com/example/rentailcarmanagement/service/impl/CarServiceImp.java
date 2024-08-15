package com.example.rentailcarmanagement.service.impl;

import com.example.rentailcarmanagement.entities.*;
import com.example.rentailcarmanagement.entities.enums.EBookingStatus;
import com.example.rentailcarmanagement.entities.enums.ECarStatus;
import com.example.rentailcarmanagement.entities.enums.ERuleType;
import com.example.rentailcarmanagement.exception.CarNotFoundException;
import com.example.rentailcarmanagement.exception.NoneRecordFoundException;
import com.example.rentailcarmanagement.payload.Response;
import com.example.rentailcarmanagement.payload.request.AddCarRequest;
import com.example.rentailcarmanagement.payload.request.CarStatusRequest;
import com.example.rentailcarmanagement.payload.response.CarResponse;
import com.example.rentailcarmanagement.payload.response.DocumentResponse;
import com.example.rentailcarmanagement.payload.response.SearchCarResponse;
import com.example.rentailcarmanagement.repository.*;
import com.example.rentailcarmanagement.service.CarService;
import com.example.rentailcarmanagement.utils.Constant;
import com.example.rentailcarmanagement.utils.ImageUploadService;
import com.example.rentailcarmanagement.utils.SecurityUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.example.rentailcarmanagement.service.impl.BookingServiceImpl.sortItems;

@Service
public class CarServiceImp implements CarService {

    @Autowired
    ImageUploadService imageUploadService;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    CarRepository carRepository;

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private AdditionRuleRepository additionRuleRepository;

    @Autowired
    private DocumentRepository documentRepository;
    @Autowired
    private WardRepository wardRepository;

    @Override
    public CarResponse getCarById(long id) {

        Car car = carRepository.findById(id).orElseThrow(CarNotFoundException::new);

        CarResponse carResponse = new CarResponse();
        BeanUtils.copyProperties(car, carResponse);
        if (car.getWard() != null) {
            carResponse.setWard(car.getWard().getName());
            carResponse.setDistrict(car.getWard().getDistrict().getName());
            carResponse.setProvince(car.getWard().getDistrict().getProvince().getName());
        }

        if (car.getModel() != null) {
            carResponse.setModel(car.getModel().getName());
            carResponse.setBrand(car.getModel().getBrand().getName());

        }

        if (car.getDocument() != null) {
            carResponse.setDocument(DocumentResponse.builder()
                    .id(car.getDocument().getId())
                    .certificate(car.getDocument().getCertificate())
                    .insurance(car.getDocument().getInsurance())
                    .registration(car.getDocument().getRegistration())
                    .build());

        }

        if (car.getAdditionRules() != null) {
            carResponse.setAdditionFunctions(
                    car.getAdditionRules()
                            .stream()
                            .filter(additionRule -> additionRule.getRuleType().getERuleType().equals(ERuleType.ADDITION_FUNCTION))
                            .map(AdditionRule::getId)
                            .toList()
            );

            carResponse.setTermOfUses(
                    car.getAdditionRules()
                            .stream()
                            .filter(additionRule -> additionRule.getRuleType().getERuleType().equals(ERuleType.TERM_OF_USE))
                            .map(AdditionRule::getId)
                            .toList()
            );
        }
        carResponse.setRate(
                car.getBookings().stream()
                        .filter(booking -> booking.getFeedback() != null && booking.getFeedback().getRate() != null)
                        .mapToDouble(booking -> booking.getFeedback().getRate())
                        .average()
                        .orElse(0.0));

        carResponse.setNoOfRides(car.getBookings()
                .stream().filter(booking -> (EBookingStatus.COMPLETED).equals(booking.getStatus()))
                .toList().size());
        return carResponse;
    }


    @Override
    public ResponseEntity<?> searchBySelectedDate(String location, LocalDateTime start,
                                                  LocalDateTime end, Integer page, Integer size, String sort) {

        List<Car> cars = carRepository
                .searchCar(addWildcardsToSearchTerm(location));

        if (cars.isEmpty()) throw new NoneRecordFoundException(Constant.ME011);

        return listCarsResponse(cars, null, page, size, sort);
    }

    @Override
    public ResponseEntity<?> getOwnerCars(String userId, Integer page, Integer size, String sort) {

        List<Car> cars = carRepository.findCarByAccount_Id(userId);
        List<Object[]> results = carRepository.getCarsLastBookingStatus(userId);

        Map<Long, String> carStatusMap = new HashMap<>();
        for (Object[] result : results) {
            Long carId = ((Number) result[0]).longValue();
            String status = (String) result[1];
            carStatusMap.put(carId, status);
        }

        if (cars.isEmpty()) throw new NoneRecordFoundException("You have no car");

        return listCarsResponse(cars, carStatusMap, page, size, sort);
    }

    @Override
    @Transactional
    public ResponseEntity<?> addACar(AddCarRequest addCarRequest, MultipartFile registrationPaper,
                                     MultipartFile certificateOfInspection, MultipartFile insurance,
                                     MultipartFile imageFront, MultipartFile imageBack,
                                     MultipartFile imageLeft, MultipartFile imageRight) {

        String accountId = SecurityUtils.getUser().getId();
        Account account = accountRepository.findById(accountId).orElse(null);
        List<String> additionRuleIds = Arrays.stream(addCarRequest.getAdditionRules()).toList();
        List<AdditionRule> additionRules = new ArrayList<>();
        additionRuleIds.forEach(additionRuleId -> {
            AdditionRule additionRule = additionRuleRepository.findById(Integer.parseInt(additionRuleId)).orElse(null);
            additionRules.add(additionRule);
        });
        Ward ward = wardRepository.findById(Integer.valueOf(addCarRequest.getWard())).orElse(null);
        Model model = modelRepository.findById(Integer.valueOf(addCarRequest.getModel())).orElse(null);

        Car car = Car.builder()
                .licensePlate(addCarRequest.getLicensePlate())
                .color(addCarRequest.getColor())
                .numberOfSeats(Integer.valueOf(addCarRequest.getNumberOfSeats()))
                .productionYear(Integer.valueOf(addCarRequest.getProductionYear()))
                .transmissionType(addCarRequest.getTransmissionType())
                .fuelType(addCarRequest.getFuelType())
                .fuelConsumption(addCarRequest.getFuelConsumption())
                .mileage(Double.valueOf(addCarRequest.getMileage()))
                .basePrice(BigDecimal.valueOf(Double.parseDouble(addCarRequest.getPrice())))
                .deposit(BigDecimal.valueOf(Double.parseDouble(addCarRequest.getDeposit())))
                .description(addCarRequest.getDescription())
                .address(addCarRequest.getAddress())
                .carStatus(ECarStatus.AVAILABLE)
                .ward(ward)
                .model(model)
                .account(account)
                .additionRules(additionRules)
                .build();

        if (imageFront != null && imageBack != null && imageLeft != null && imageRight != null) {
            try {
                String imageFrontName = imageUploadService.upload(imageFront);
                String imageBackName = imageUploadService.upload(imageBack);
                String imageLeftName = imageUploadService.upload(imageLeft);
                String imageRightName = imageUploadService.upload(imageRight);
                car.setFrontImage(imageFrontName);
                car.setBackImage(imageBackName);
                car.setLeftImage(imageLeftName);
                car.setRightImage(imageRightName);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Response.builder()
                                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                .isSuccess(false)
                                .body(e.getMessage())
                                .build());
            }
        }
        Car savedCar = carRepository.save(car);

        Document document = new Document();
        if (registrationPaper != null && certificateOfInspection != null && insurance != null) {
            try {
                String registrationPaperName = imageUploadService.upload(registrationPaper);
                String certificateOfInspectionName = imageUploadService.upload(certificateOfInspection);
                String insuranceName = imageUploadService.upload(insurance);
                document.setRegistration(registrationPaperName);
                document.setCertificate(certificateOfInspectionName);
                document.setInsurance(insuranceName);
                document.setCar(savedCar);
                documentRepository.save(document);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Response.builder()
                                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                .isSuccess(false)
                                .body(e.getMessage())
                                .build());
            }
        }

        return ResponseEntity.ok(Response.builder()
                .status(HttpStatus.OK.value())
                .isSuccess(true)
                .body("Add car successfully!")
                .build());
    }

    @Override
    @Transactional
    public ResponseEntity<?> editCarInfo(long id, AddCarRequest addCarRequest,
                                         MultipartFile imageFront, MultipartFile imageBack,
                                         MultipartFile imageLeft, MultipartFile imageRight) {
        try {
            Car car = carRepository.findById(id).orElse(null);
            if (car == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Response.builder()
                                .status(HttpStatus.NOT_FOUND.value())
                                .isSuccess(false)
                                .body("Car not found")
                                .build());
            }
            if (addCarRequest.getMileage() != null) {
                car.setMileage(Double.valueOf(addCarRequest.getMileage()));
            }
            if (addCarRequest.getFuelConsumption() != null) {
                car.setFuelConsumption(addCarRequest.getFuelConsumption());
            }
            if (addCarRequest.getPrice() != null) {
                car.setBasePrice(BigDecimal.valueOf(Double.parseDouble(addCarRequest.getPrice())));
            }
            if (addCarRequest.getDeposit() != null) {
                car.setDeposit(BigDecimal.valueOf(Double.parseDouble(addCarRequest.getDeposit())));
            }
            if (addCarRequest.getDescription() != null) {
                car.setDescription(addCarRequest.getDescription());
            }
            if (addCarRequest.getAddress() != null) {
                car.setAddress(addCarRequest.getAddress());
            }
            if (addCarRequest.getWard() != null) {
                Ward ward = wardRepository.findById(Integer.valueOf(addCarRequest.getWard())).orElse(null);
                car.setWard(ward);
            }
            if (addCarRequest.getModel() != null) {
                Model model = modelRepository.findById(Integer.valueOf(addCarRequest.getModel())).orElse(null);
                car.setModel(model);
            }
            if (addCarRequest.getAdditionRules() != null) {
                List<String> additionRuleIds = Arrays.stream(addCarRequest.getAdditionRules()).toList();
                List<AdditionRule> additionRules = new ArrayList<>();
                additionRuleIds.forEach(additionRuleId -> {
                    AdditionRule additionRule = additionRuleRepository.findById(Integer.parseInt(additionRuleId)).orElse(null);
                        additionRules.add(additionRule);
                });
                car.setAdditionRules(additionRules);
            }
            if (imageFront != null) {
                String imageFrontName = imageUploadService.upload(imageFront);
                car.setFrontImage(imageFrontName);
            }
            if (imageBack != null) {
                String imageBackName = imageUploadService.upload(imageBack);
                car.setBackImage(imageBackName);
            }
            if (imageLeft != null) {
                String imageLeftName = imageUploadService.upload(imageLeft);
                car.setLeftImage(imageLeftName);
            }
            if (imageRight != null) {
                String imageRightName = imageUploadService.upload(imageRight);
                car.setRightImage(imageRightName);
            }
            carRepository.save(car);
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
                .body("Edit car information successfully!")
                .build());
    }

    @Override
    public ResponseEntity<?> changeCarStatus(long id, CarStatusRequest carStatusRequest) {
        try {
            Car car = carRepository.findById(id).orElse(null);
            if (car != null) {
                if (("STOPPED").equals(carStatusRequest.getStatus())) {
                    car.setCarStatus(ECarStatus.STOPPED);
                } else if (("AVAILABLE").equals(carStatusRequest.getStatus())) {
                    car.setCarStatus(ECarStatus.AVAILABLE);
                }
                carRepository.save(car);
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
                .body("Change car status successfully!")
                .build());
    }

    private Double calculateAvgRating(Long id) {
        Double rating = carRepository.averageRating(id);
        if (rating == null) {
            return 0.0;
        }

        long wholePart = rating.longValue();
        double decimalPart = rating - wholePart;

        if (decimalPart > 0.0 && decimalPart <= 0.5)
            return wholePart + 0.5;
        if (decimalPart > 0.5 && decimalPart < 1.0)
            return (double) (wholePart + 1);

        return rating;
    }

    public static String addWildcardsToSearchTerm(String searchTerm) {
        String[] words = searchTerm.split("\\s+");
        StringBuilder result = new StringBuilder("%");
        for (String word : words) {
            result.append(word).append("%");
        }
        return result.toString();
    }



    private List<SearchCarResponse> convertToSearchCarResponseList(List<Car> cars,Map<Long, String> bookingStatus) {
        return cars.stream()
                .map(car -> SearchCarResponse.builder()
                        .name(car.getModel().getBrand().getName() + " " + car.getModel().getName())
                        .rating(calculateAvgRating(car.getId()))
                        .numberOfRides(carRepository.countRides(car.getId()) == null ? 0
                                : carRepository.countRides(car.getId()))
                        .price(car.getBasePrice())
                        .frontImage(car.getFrontImage())
                        .backImage(car.getBackImage())
                        .leftImage(car.getLeftImage())
                        .rightImage(car.getRightImage())
                        .location(car.getWard().getDistrict().getName() + ", " +
                                car.getWard().getDistrict().getProvince().getName())
                        .carId(car.getId())
                        .status(car.getCarStatus().toString())
                        .bookingStatus(bookingStatus == null ? null : bookingStatus.get(car.getId()))
                        .build())
                .collect(Collectors.toList());
    }

    private ResponseEntity<?> listCarsResponse(List<Car> cars, Map<Long, String> bookingStatus, int page, int size, String sort) {
        int totalPage = (int) Math.ceil((double) (cars.size()) / size);
        int startItem = (page - 1) * size;
        int endItem = Math.min(startItem + size, (cars.size()));

        Comparator<Car> carComparator = switch (sort) {
            case "latest_to_newest" -> Comparator.comparing(Car::getLastModifiedDate);
            case "price_low_high" -> Comparator.comparing(Car::getBasePrice);
            case "price_high_low" -> Comparator.comparing(Car::getBasePrice).reversed();
            default -> Comparator.comparing(Car::getLastModifiedDate).reversed();
        };
        List<SearchCarResponse> responses
                = convertToSearchCarResponseList(sortItems(cars, carComparator), bookingStatus);

        Map<Object, Object> message = new HashMap<>();
        message.put("result", responses.subList(startItem, endItem));
        message.put("page", page);
        message.put("size", size);
        message.put("total_page", totalPage);
        message.put("total_item", cars.size());

        return ResponseEntity.ok(Response.builder()
                .isSuccess(true)
                .status(HttpStatus.OK.value())
                .body(message)
                .build());
    }
}