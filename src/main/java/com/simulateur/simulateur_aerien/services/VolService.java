package com.simulateur.simulateur_aerien.services;
import com.simulateur.simulateur_aerien.Exception.VolNotFoundException;
import com.simulateur.simulateur_aerien.entities.Vol;
import com.simulateur.simulateur_aerien.repositories.VolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VolService {

    private VolRepository volRepository;

    @Autowired
    public VolService(VolRepository volRepository) {
        this.volRepository = volRepository;
    }

    public List<Vol> getAllVols() {
        return volRepository.findAll();
    }

    public List<Vol> getAllVol(){
        return (List<Vol>) volRepository.findAll();
    }

    public void save(Vol vol){
        volRepository.save(vol);
    }

    public  Vol get(Long id) throws VolNotFoundException {
        Optional<Vol> result = volRepository.findById(id);
        if(result.isPresent()){
            return result.get();
        }
        throw new VolNotFoundException("Could not find any vols with ID" + id);
    }

    public void delete (Long id) throws VolNotFoundException {
        Long count = volRepository.countByidVol(id);
        if(count == null || count == 0){
            throw new VolNotFoundException("Could not find any vols with ID " + id);
        }
        volRepository.deleteById(id);
    }

}

