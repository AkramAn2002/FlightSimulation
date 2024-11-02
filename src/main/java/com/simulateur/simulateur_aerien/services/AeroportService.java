package com.simulateur.simulateur_aerien.services;

import com.simulateur.simulateur_aerien.Exception.VolNotFoundException;
import com.simulateur.simulateur_aerien.entities.Aeroport;
import com.simulateur.simulateur_aerien.repositories.AeroportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AeroportService {
    @Autowired
    private AeroportRepository aeroportRepository;
    public List<Aeroport> getAllAeroport(){
        return aeroportRepository .findAll();
    }

    public Optional<Aeroport> getAeroportByLocalisation(String localisation) {
        return aeroportRepository.findByLocalisation(localisation);
    }
    public Optional<String> getLocalisationByIdAeroport(Long idAeroport) {
        Optional<Aeroport> aeroportOptional = aeroportRepository.findById(idAeroport);
        return aeroportOptional.map(Aeroport::getLocalisation);
    }
    public void decrementerNbPlaceSol(Long idAeroport) {
        Optional<Aeroport> aeroportOptional = aeroportRepository.findById(idAeroport);

        aeroportOptional.ifPresent(aeroport -> {
            int nbPlaceSolActuel = aeroport.getNbPlaceSol();
            if (nbPlaceSolActuel > 0) {
                aeroport.setNbPlaceSol(nbPlaceSolActuel - 1);
                aeroportRepository.save(aeroport);
            }
        });
    }
    public void incrementerNbPlaceSol(Long idAeroport) {
        Optional<Aeroport> aeroportOptional = aeroportRepository.findById(idAeroport);

        aeroportOptional.ifPresent(aeroport -> {
            int nbPlaceSolActuel = aeroport.getNbPlaceSol();
            if (nbPlaceSolActuel > 0 && nbPlaceSolActuel<=aeroport.getNbMax()) {
                aeroport.setNbPlaceSol(nbPlaceSolActuel + 1);
                aeroportRepository.save(aeroport);
            }
        });
    }
    public List<Aeroport> getAllAeroports(){
        return (List<Aeroport>) aeroportRepository.findAll();
    }

    public void save(Aeroport aeroport){
        aeroportRepository.save(aeroport);
    }

    public  Aeroport get(Long id) throws VolNotFoundException {
        Optional<Aeroport> result = aeroportRepository.findById(id);
        if(result.isPresent()){
            return result.get();
        }
        throw new VolNotFoundException("Could not find any Aeroport with ID" + id);
    }

    public void delete (Long id) throws VolNotFoundException {
        Long count = aeroportRepository.countByid_aeroport(id);
        if(count == null || count == 0){
            throw new VolNotFoundException("Could not find any Aeroport with ID " + id);
        }
        aeroportRepository.deleteById(id);
    }

}

