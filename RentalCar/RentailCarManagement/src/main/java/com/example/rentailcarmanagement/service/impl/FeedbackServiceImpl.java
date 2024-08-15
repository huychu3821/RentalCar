package com.example.rentailcarmanagement.service.impl;

import com.example.rentailcarmanagement.entities.Booking;
import com.example.rentailcarmanagement.entities.Feedback;
import com.example.rentailcarmanagement.exception.NoneRecordFoundException;
import com.example.rentailcarmanagement.payload.Response;
import com.example.rentailcarmanagement.payload.request.FeedbackRequest;
import com.example.rentailcarmanagement.payload.response.FeedBackResponse;
import com.example.rentailcarmanagement.payload.response.TopCurrentFeedback;
import com.example.rentailcarmanagement.repository.BookingRepository;
import com.example.rentailcarmanagement.repository.FeedbackRepository;
import com.example.rentailcarmanagement.service.FeedbackService;
import jakarta.persistence.Tuple;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FeedbackServiceImpl implements FeedbackService {
    private final FeedbackRepository feedbackRepository;
    static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.S");
    private final BookingRepository bookingRepository;

    public FeedbackServiceImpl(FeedbackRepository feedbackRepository, BookingRepository bookingRepository) {
        this.feedbackRepository = feedbackRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public List<TopCurrentFeedback> getTopCurrentFeedback() {
        List<Tuple> feedbackList = feedbackRepository.getTopCurrentFeedBack();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.S");
        return feedbackList.stream()
                .map(tuple -> new TopCurrentFeedback(tuple.get(0).toString(),
                        tuple.get(1).toString(),
                        Double.parseDouble(tuple.get(2).toString()),
                        LocalDateTime.parse(tuple.get(3).toString(), formatter)))
                .toList();
    }

    @Override
    public ResponseEntity<?> getCarReviews(Long carId, Double rate, Integer page, Integer size, String sort) {
        Map<Object, Object> message = new HashMap<>();
        List<Tuple> queryResult = feedbackRepository.getCarReview(carId, rate == 0D ? null : rate);

        if(queryResult.isEmpty()) throw new NoneRecordFoundException("There is no feedback for this section");

        int totalPage = (int) Math.ceil((double) (queryResult.size()) / size);
        page = Math.min(page, totalPage);
        int startItem = (page - 1) * size;
        int endItem = Math.min(startItem + size, (queryResult.size()));

        List<FeedBackResponse> responses = queryResult.stream()
                .map(tuple -> FeedBackResponse.builder()
                            .id(tuple.get(0) == null ? 1L : Long.parseLong(tuple.get(0).toString()))
                            .userName(tuple.get(1) == null ? "" : tuple.get(1).toString())
                            .carName(tuple.get(2) == null ? "" : tuple.get(2).toString())
                            .content(tuple.get(3) == null ? "" : tuple.get(3).toString())
                            .rate(tuple.get(4) == null ? 0D : Double.parseDouble(tuple.get(4).toString()))
                            .start(LocalDateTime.parse(tuple.get(5).toString(), formatter).toString().replace("T"," "))
                            .end(LocalDateTime.parse(tuple.get(6).toString(), formatter).toString().replace("T"," "))
                            .lastModified(tuple.get(7).toString().substring(0, 16))
                            .build())
                .sorted(getComparator(sort))
                .toList().subList(startItem, endItem);

        message.put("result", responses);
        message.put("page", page);
        message.put("size", size);
        message.put("total_page", totalPage);
        message.put("total_item", queryResult.size());

        return ResponseEntity.ok().body(Response.builder()
                .status(HttpStatus.OK.value())
                .isSuccess(true)
                .body(message)
                .build());
    }

    @Override
    public ResponseEntity<?> countReview(Long carId) {
        Map<Object, Object> message = new HashMap<>();
        int[] count = {0, 0, 0, 0, 0, 0};
        List<Tuple> tuples = feedbackRepository.getCarReview(carId, null);
        tuples.forEach(tuple ->
                count[(int) Double.parseDouble(tuple.get(4).toString())] += 1
        );
        double avg = tuples.stream()
                .map(tuple -> tuple.get(4) == null ? 0D : Double.parseDouble(tuple.get(4).toString()))
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);
        for (int i = 1; i <= 5; i++) count[0] += count[i];

        message.put("result", count);
        message.put("avg", ratingCalculate(avg));

        return ResponseEntity.ok().body(Response.builder()
                .status(HttpStatus.OK.value())
                .isSuccess(true)
                .body(message)
                .build());
    }

    private static Comparator<FeedBackResponse> getComparator(String sortOrder) {
        if ("newest_to_latest".equalsIgnoreCase(sortOrder)) {
            return Comparator.comparing(FeedBackResponse::getId).reversed();
        } else if ("latest_to_newest".equalsIgnoreCase(sortOrder)) {
            return Comparator.comparing(FeedBackResponse::getId);
        }
        return Comparator.comparing(FeedBackResponse::getLastModified);
    }

    @Override
    public ResponseEntity<?> addFeedback(FeedbackRequest feedbackRequest) {
        try {
            Booking booking = bookingRepository
                    .findById(Long.valueOf(feedbackRequest.getBookingId())).orElse(null);
            if (booking == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found");
            }
            Feedback feedback = Feedback.builder()
                    .rate(feedbackRequest.getRate())
                    .content(feedbackRequest.getContent())
                    .booking(booking)
                    .build();
            feedbackRepository.save(feedback);
            return ResponseEntity.ok(Response.builder()
                    .status(HttpStatus.OK.value())
                    .isSuccess(true)
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
    public ResponseEntity<?> getUserFeedback(String uid) {
        Map<String, Double> message = new HashMap<>();
        List<Tuple> tuples = feedbackRepository.getUserFeedback(uid);
        message.put("avg", ratingCalculate((Double) tuples.get(0).get(0)));
        message.put("numberOfReview", ratingCalculate((Integer) tuples.get(0).get(1)));
        return ResponseEntity.ok().body(Response.builder()
                .status(HttpStatus.OK.value())
                .isSuccess(true)
                .body(message)
                .build());
    }

    private double ratingCalculate(double avg){
        long wholePart = Double.valueOf(avg).longValue();
        double decimalPart = avg - wholePart;

        if (decimalPart > 0.0 && decimalPart <= 0.5)
            avg = wholePart + 0.5;
        else if (decimalPart > 0.5 && decimalPart < 1.0)
            avg = (double) (wholePart + 1);

        return avg;
    }
}
