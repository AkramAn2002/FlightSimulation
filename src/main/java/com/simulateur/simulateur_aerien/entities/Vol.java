package com.simulateur.simulateur_aerien.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.Date;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Vol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_Vol;

    @ManyToOne
    @JoinColumn(name = "aeroport_depart_id")
    private Aeroport aeroportDepart;

    @ManyToOne
    @JoinColumn(name = "aeroport_arrive_id")
    private Aeroport aeroportArrive;
    @Column
    private LocalTime heureDepart;
    @Column
    private LocalTime heureArrive;
    @Column
    private Boolean stop;
}

