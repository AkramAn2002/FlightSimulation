package com.simulateur.simulateur_aerien.controllers;


import com.simulateur.simulateur_aerien.entities.Vol;
import com.simulateur.simulateur_aerien.services.VolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/vols")
public class VolController {

    private final VolService volService;

    @Autowired
    public VolController(VolService volService) {
        this.volService = volService;
    }

    @GetMapping("/vol")
    public List<Vol> getAllVols() {
        return volService.getAllVols();
    }

}