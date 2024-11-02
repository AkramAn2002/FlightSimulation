package com.simulateur.simulateur_aerien.repositories;

import com.simulateur.simulateur_aerien.entities.Vol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VolRepository extends JpaRepository<Vol, Long> {


    @Query("SELECT COUNT(a) FROM Vol a WHERE a.id_Vol = :id_Vol")
    Long countByidVol(@Param("id_Vol") Long id_Vol);
}
