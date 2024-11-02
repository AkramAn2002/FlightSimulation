package com.simulateur.simulateur_aerien.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor


public class Avion {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_avion;
    @Column(nullable = false,unique = true,length = 45)
    private String type_avion;
    @Column
    private Integer capacite;
    @Column
    private  Double capacite_carburant;
}
