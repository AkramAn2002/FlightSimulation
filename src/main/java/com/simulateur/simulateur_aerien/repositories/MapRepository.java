package com.simulateur.simulateur_aerien.repositories;

import com.simulateur.simulateur_aerien.entities.Map;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MapRepository extends JpaRepository<Map,Integer> {
}
