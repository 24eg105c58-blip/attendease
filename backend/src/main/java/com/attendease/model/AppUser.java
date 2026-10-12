package com.attendease.model;

import jakarta.persistence.*;

@Entity
@Table(name="app_users")
public class AppUser {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private String name;
    @Column(unique=true, nullable=false) private String email;
    @Column(nullable=false) private String password;
    @Enumerated(EnumType.STRING) private Role role;

    public AppUser() {}
    public AppUser(String name, String email, String password, Role role) {
        this.name=name; this.email=email; this.password=password; this.role=role;
    }
    public Long getId(){return id;} public String getName(){return name;}
    public String getEmail(){return email;} public String getPassword(){return password;}
    public Role getRole(){return role;}
    public void setName(String name){this.name=name;} public void setEmail(String email){this.email=email;}
    public void setPassword(String password){this.password=password;} public void setRole(Role role){this.role=role;}
}
