package com.simulateur.simulateur_aerien.controllers;


import com.simulateur.simulateur_aerien.Exception.VolNotFoundException;
import com.simulateur.simulateur_aerien.entities.Aeroport;
import com.simulateur.simulateur_aerien.services.AeroportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
public class GestionAeroport {

    @Autowired
    private AeroportService aeroportService;

    @GetMapping("/Aeroport")
    public String showVolList(Model model){
        List<Aeroport> listAeroports = aeroportService.getAllAeroports();
        model.addAttribute("listAeroports", listAeroports);
        return "Aeroport";

    }

    @GetMapping("/aeroport/new")
    public String showNewForm(Model model){
        model.addAttribute("aeroport", new Aeroport());
        model.addAttribute("pageTitle", "Ajouter aeroport");
        return"Aeroport_form";
    }

    @PostMapping("/aeroport/save")
    public String saveAeroport(Aeroport aeroport, RedirectAttributes ra) {
        aeroportService.save(aeroport);
        ra.addFlashAttribute("message", "l aeroport a été ajouté avec succés.");
        return "redirect:/Aeroport";
    }

    @GetMapping("/aeroport/edit/{id}")
    public String showEditForm(@PathVariable("id") Long id, Model model, RedirectAttributes ra) {
        try {
            Aeroport aeroport = aeroportService.get(id);
            model.addAttribute("aeroport", aeroport);
            model.addAttribute("pageTitle", "Modifier Aeroport : " + id + "");
            return "Aeroport_form";
        } catch (VolNotFoundException e) {
            ra.addFlashAttribute("message", e.getMessage());
            return "redirect:/Aeroport";
        }

    }

    @GetMapping("aeroport/delete/{id}")
    public String deleteVol(@PathVariable("id") Long id, RedirectAttributes ra) {
        try {
            aeroportService.delete(id);
            ra.addFlashAttribute("message", "L aeroport ID " + id + " a été supprimé.");
        } catch (VolNotFoundException e) {
            ra.addFlashAttribute("message", e.getMessage());
        }
        return "redirect:/Aeroport";
    }
}

