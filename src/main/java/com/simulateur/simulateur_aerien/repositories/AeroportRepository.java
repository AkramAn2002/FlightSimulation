package com.simulateur.simulateur_aerien.repositories;

import com.simulateur.simulateur_aerien.entities.Aeroport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AeroportRepository extends JpaRepository<Aeroport, Long> {
    Optional<Aeroport> findByLocalisation(String localisation);

    @Query("SELECT COUNT(a) FROM Aeroport a WHERE a.id_aeroport = :id_aeroport")
    Long countByid_aeroport(@Param("id_aeroport") Long id_aeroport);
}

