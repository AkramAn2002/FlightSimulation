package com.simulateur.simulateur_aerien.entities;


import jakarta.persistence.*;

import java.io.Serializable;
@Entity
@Table(name = "aeroports_proches")
public class AeroportProche implements Serializable {
    @EmbeddedId
    private AeroportProcheId id;

    @MapsId("id_aeroport")
    @ManyToOne
    @JoinColumn(name = "id_aeroport")
    private Aeroport aeroport;

    @MapsId("proche_id")
    @ManyToOne
    @JoinColumn(name = "proche_id")
    private Aeroport proche;

    @Column
    private double posX;
    @Column
    private double posY;

    // constructeurs, getters, setters
}