package com.attendease.model;

import jakarta.persistence.*;

@Entity
public class Subject {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private String name;
    @Column(unique=true) private String code;
    public Subject() {}
    public Subject(String name, String code){this.name=name;this.code=code;}
    public Long getId(){return id;} public String getName(){return name;} public String getCode(){return code;}
    public void setName(String name){this.name=name;} public void setCode(String code){this.code=code;}
}
