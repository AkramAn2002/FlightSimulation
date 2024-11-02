package com.simulateur.simulateur_aerien.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.simulateur.simulateur_aerien.entities.Aeroport;
import com.simulateur.simulateur_aerien.services.AeroportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/aeroports")
public class AeroportController {
    @Autowired // inejction de depandance
    private AeroportService aeroportService;

    @Autowired
    private ObjectMapper objectMapper;  // Injection de l'objet ObjectMapper

    @GetMapping("/map")
    public List<String> getAllLocalisations() {
        List<Aeroport> aeroports = aeroportService.getAllAeroport();
        List<String> localisations = aeroports.stream()
                .map(Aeroport::getLocalisation)
                .collect(Collectors.toList());
        return localisations;
    }

    @GetMapping("/by-localisation")
    public ResponseEntity<Aeroport> getAeroportByLocalisation(@RequestParam String localisation) {
        Optional<Aeroport> aeroport = aeroportService.getAeroportByLocalisation(localisation);
        if (aeroport.isPresent()) {
            return new ResponseEntity<>(aeroport.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/decrementerNbSol")
    public ResponseEntity<String> decrementerNbSol(@RequestParam Long idaeroport) {
        // Logique pour décrémenter la valeur dans la base de données à travers votre service
        aeroportService.decrementerNbPlaceSol(idaeroport);

        // Création de la réponse JSON
        Map<String, String> responseMap = Map.of("message", "Nombre de places au sol décrémenté avec succès.");

        try {
            String jsonResponse = objectMapper.writeValueAsString(responseMap);
            return ResponseEntity.ok(jsonResponse);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la conversion en JSON");
        }
    }

    @PutMapping("/inrementerNbSol")
    public ResponseEntity<String> inrementerNbSol(@RequestParam Long idaeroport) {
        // Logique pour décrémenter la valeur dans la base de données à travers votre service
        aeroportService.incrementerNbPlaceSol(idaeroport);

        // Création de la réponse JSON
        Map<String, String> responseMap = Map.of("message", "Nombre de places au sol incrementé avec succès.");

        try {
            String jsonResponse = objectMapper.writeValueAsString(responseMap);
            return ResponseEntity.ok(jsonResponse);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la conversion en JSON");
        }
    }
}
