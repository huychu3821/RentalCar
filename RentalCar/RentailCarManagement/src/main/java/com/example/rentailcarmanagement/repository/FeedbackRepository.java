package com.example.rentailcarmanagement.repository;

import com.example.rentailcarmanagement.entities.Feedback;
import jakarta.persistence.Tuple;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends BaseRepository<Feedback, Integer>{

    @Query(nativeQuery = true, value = "SELECT TOP 4\n" +
            "    u.name AS username,\n" +
            "    f.content AS feedback_content,\n" +
            "    f.rate AS ratings,\n" +
            "    b.end_date AS [date and time]\n" +
            "FROM\n" +
            "    feedback f\n" +
            "JOIN\n" +
            "    booking b ON f.booking_id = b.id\n" +
            "JOIN\n" +
            "    account a ON b.account_id = a.id\n" +
            "JOIN \n" +
            "\tuser_info u ON a.user_info_id = u.id\n" +
            "WHERE\n" +
            "    f.rate = 5\n" +
            "    AND f.content IS NOT NULL\n" +
            "ORDER BY\n" +
            "    b.end_date DESC;")
    List<Tuple> getTopCurrentFeedBack();

    @Query(nativeQuery = true, value = "SELECT f.id, u.name, (br.name + ' ' + m.name) as carName, \n" +
            "f.content, f.rate, b.start_date, b.end_date, f.last_modified_date\n" +
            "FROM feedback f\n" +
            "JOIN booking b ON f.booking_id = b.id\n" +
            "JOIN car c ON b.car_id = c.id\n" +
            "JOIN account a ON b.account_id = a.id\n" +
            "JOIN user_info u ON a.user_info_id = u.id\n" +
            "JOIN model m ON c.model_id = m.id\n" +
            "JOIN brand br ON m.brand_id = br.id\n" +
            "WHERE car_id =:carId AND (:rate IS NULL OR f.rate = :rate)")
    List<Tuple> getCarReview(Long carId, Double rate);

    @Query(nativeQuery = true, value = "SELECT AVG( f.rate), COUNT(f.id) \n" +
            "FROM feedback f\n" +
            "JOIN booking b on f.booking_id = b.id\n" +
            "JOIN car c ON c.id = b.car_id\n" +
            "JOIN account a ON a.id = c.account_id\n" +
            "WHERE a.id = :uid " +
            "GROUP BY a.id")
    List<Tuple> getUserFeedback(String uid);
}
