package com.attendease.controller;

import com.attendease.model.*;
import com.attendease.repository.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins={"http://localhost:5173","http://localhost:3000"})
public class ApiController {
    private final UserRepository users;
    private final SubjectRepository subjects;
    private final AttendanceRepository attendance;
    public ApiController(UserRepository users, SubjectRepository subjects, AttendanceRepository attendance) {
        this.users=users; this.subjects=subjects; this.attendance=attendance;
    }

    @GetMapping("/health") public Map<String,String> health(){return Map.of("status","ok","app","AttendEase");}

    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}
    @PostMapping("/auth/login")
    public Map<String,Object> login(@Valid @RequestBody LoginRequest request) {
        AppUser u=users.findByEmail(request.email()).filter(x->x.getPassword().equals(request.password()))
            .orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid credentials"));
        return Map.of("id",u.getId(),"name",u.getName(),"email",u.getEmail(),"role",u.getRole());
    }

    public record UserRequest(@NotBlank String name, @Email @NotBlank String email,
                              @NotBlank String password, @NotNull Role role) {}
    @GetMapping("/users") public List<Map<String,Object>> allUsers() {
        return users.findAll().stream().map(this::safeUser).toList();
    }
    @PostMapping("/users") @ResponseStatus(HttpStatus.CREATED)
    public Map<String,Object> createUser(@Valid @RequestBody UserRequest r) {
        if(users.findByEmail(r.email()).isPresent()) throw new ResponseStatusException(HttpStatus.CONFLICT,"Email already exists");
        return safeUser(users.save(new AppUser(r.name(),r.email(),r.password(),r.role())));
    }
    private Map<String,Object> safeUser(AppUser u) {
        return Map.of("id",u.getId(),"name",u.getName(),"email",u.getEmail(),"role",u.getRole());
    }

    public record SubjectRequest(@NotBlank String name, @NotBlank String code) {}
    @GetMapping("/subjects") public List<Subject> allSubjects(){return subjects.findAll();}
    @PostMapping("/subjects") @ResponseStatus(HttpStatus.CREATED)
    public Subject createSubject(@Valid @RequestBody SubjectRequest r) {
        return subjects.save(new Subject(r.name(),r.code()));
    }

    public record AttendanceRequest(@NotNull Long studentId, @NotNull Long subjectId,
                                    @NotNull LocalDate date, @NotNull AttendanceStatus status) {}
    @GetMapping("/attendance") public List<Map<String,Object>> listAttendance(@RequestParam(required=false) Long studentId) {
        List<Attendance> rows = studentId == null ? attendance.findAll() : attendance.findByStudentIdOrderByDateDesc(studentId);
        return rows.stream().map(this::attendanceView).toList();
    }
    @PostMapping("/attendance") @ResponseStatus(HttpStatus.CREATED)
    public Map<String,Object> markAttendance(@Valid @RequestBody AttendanceRequest r) {
        AppUser student=users.findById(r.studentId()).filter(u->u.getRole()==Role.STUDENT)
            .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Student not found"));
        Subject subject=subjects.findById(r.subjectId())
            .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Subject not found"));
        boolean duplicate=attendance.findByStudentIdAndSubjectId(student.getId(),subject.getId()).stream()
            .anyMatch(a->a.getDate().equals(r.date()));
        if(duplicate) throw new ResponseStatusException(HttpStatus.CONFLICT,"Attendance already recorded for this student, subject and date");
        return attendanceView(attendance.save(new Attendance(student,subject,r.date(),r.status())));
    }
    private Map<String,Object> attendanceView(Attendance a) {
        return Map.of("id",a.getId(),"studentId",a.getStudent().getId(),"studentName",a.getStudent().getName(),
            "subjectId",a.getSubject().getId(),"subject",a.getSubject().getName(),"date",a.getDate(),"status",a.getStatus());
    }
    @GetMapping("/attendance/summary")
    public Map<String,Object> summary(@RequestParam Long studentId) {
        AppUser student=users.findById(studentId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Student not found"));
        List<Attendance> rows=attendance.findByStudentIdOrderByDateDesc(studentId);
        long total=rows.size(), present=rows.stream().filter(a->a.getStatus()==AttendanceStatus.PRESENT || a.getStatus()==AttendanceStatus.LATE).count();
        double percent=total==0?0.0:Math.round((present*10000.0)/total)/100.0;
        return Map.of("studentId",studentId,"studentName",student.getName(),"totalClasses",total,
            "attended",present,"percentage",percent,"shortage",percent<75.0);
    }
}
