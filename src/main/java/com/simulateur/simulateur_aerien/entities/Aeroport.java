package com.simulateur.simulateur_aerien.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Aeroport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_aeroport;
    @Column
    private String localisation;
    @Column
    private Integer nbPistes;
    @Column
    private Integer nbPlaceSol;
    @Column
    private Integer delaiAttenteSol;
    @Column
    private Integer tempsAccesPiste;
    @Column
    private Integer delaiAntiCollision;
    @Column
    private Integer tempsDecollage;
    @Column
    private Integer tempsAtterissage;
    @Column
    private Integer dureeBoucleAttente;
    @Column
    private Integer nbMax;

    @OneToMany(mappedBy = "aeroport")
    private Set<AeroportProche> proches;
}
