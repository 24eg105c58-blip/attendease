package com.attendease;

import com.attendease.model.*;
import com.attendease.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
public class AttendEaseApplication {
    public static void main(String[] args) { SpringApplication.run(AttendEaseApplication.class, args); }

    @Bean
    CommandLineRunner seed(UserRepository users, SubjectRepository subjects) {
        return args -> {
            if (users.count() == 0) {
                users.save(new AppUser("Admin", "admin@attendease.com", "admin123", Role.ADMIN));
                users.save(new AppUser("Faculty Demo", "faculty@attendease.com", "faculty123", Role.FACULTY));
                users.save(new AppUser("Student Demo", "student@attendease.com", "student123", Role.STUDENT));
            }
            if (subjects.count() == 0) {
                subjects.save(new Subject("Java Programming", "CSE-JAVA"));
                subjects.save(new Subject("Database Management", "CSE-DBMS"));
                subjects.save(new Subject("Operating Systems", "CSE-OS"));
            }
        };
    }
}
