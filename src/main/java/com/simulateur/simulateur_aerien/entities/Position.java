package com.simulateur.simulateur_aerien.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Position {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_Position;
    @Column
    private double x;
    @Column
    private double y;
    @ManyToOne
    @JoinColumn(name = "map_id")  // Nom de la colonne dans la table Position qui stocke l'ID de la Map
    private Map map;
}
