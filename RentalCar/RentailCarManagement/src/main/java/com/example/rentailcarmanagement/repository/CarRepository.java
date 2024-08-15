package com.example.rentailcarmanagement.repository;

import com.example.rentailcarmanagement.entities.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {

    @Query(value = "SELECT c.*\n" +
            "FROM car c\n" +
            "JOIN ward w ON c.ward_id = w.id\n" +
            "JOIN district d ON d.id = w.district_id\n" +
            "JOIN province p ON p.id = d.province_id\n" +
            "            WHERE\n" +
            "             c.status != 'STOPPED'\n" +
//            "                AND c.id NOT IN (\n" +
//            "                    SELECT DISTINCT booking.car_id\n" +
//            "                    FROM booking\n" +
//            "                    WHERE\n" +
//            "                        booking.start_date <= :end \n" +
//            "                       AND booking.end_date >= :start \n" +
//            "                        AND booking.status != 'CANCELLED'\n" +
//            "                )\n" +
            "AND LOWER(w.name + ' ' + d.name + ' ' + p.name)  LIKE LOWER(:location)", nativeQuery = true)
    List<Car> searchCar(String location);

    @Query(value = "Select \n" +
            "COUNT(*)\n" +
            "FROM car  c\n" +
            "JOIN booking b ON c.id = b.car_id " +
            "AND b.status = 'COMPLETED'\n" +
            "WHERE c.id = :id \n" +
            "group by b.car_id", nativeQuery = true)
    Integer countRides(Long id);

    @Query(value = "SELECT AVG(f.rate)\n" +
            "FROM car c\n" +
            "JOIN booking b ON c.id = b.car_id \n" +
            "JOIN feedback f ON b.id = f.booking_id \n" +
            "WHERE c.id = :id \n" +
            "GROUP BY c.id", nativeQuery = true)
    Double averageRating(Long id);

    @Query(value = "SELECT c.id, b.status \n" +
            "FROM car c \n" +
            "JOIN account a ON c.account_id = a.id\n" +
            "LEFT JOIN booking b ON b.car_id = c.id AND b.id = (\n" +
            "    SELECT MAX(b2.id)\n" +
            "    FROM booking b2\n" +
            "    WHERE b2.car_id = c.id\n" +
            ")\n" +
            "WHERE a.id = :uid\n" +
            "ORDER BY c.id", nativeQuery = true)
    List<Object[]> getCarsLastBookingStatus(String uid);

    List<Car> findCarByAccount_Id(String id);
}
