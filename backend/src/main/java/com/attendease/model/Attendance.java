package com.attendease.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(uniqueConstraints=@UniqueConstraint(columnNames={"student_id","subject_id","date"}))
public class Attendance {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional=false) private AppUser student;
    @ManyToOne(optional=false) private Subject subject;
    @Column(nullable=false) private LocalDate date;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private AttendanceStatus status;
    public Attendance() {}
    public Attendance(AppUser student, Subject subject, LocalDate date, AttendanceStatus status) {
        this.student=student; this.subject=subject; this.date=date; this.status=status;
    }
    public Long getId(){return id;} public AppUser getStudent(){return student;}
    public Subject getSubject(){return subject;} public LocalDate getDate(){return date;}
    public AttendanceStatus getStatus(){return status;}
    public void setDate(LocalDate date){this.date=date;} public void setStatus(AttendanceStatus status){this.status=status;}
}
