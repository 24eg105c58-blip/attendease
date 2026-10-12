package com.attendease.repository;
import com.attendease.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SubjectRepository extends JpaRepository<Subject,Long> {}
