package com.simulateur.simulateur_aerien.controllers;


import com.simulateur.simulateur_aerien.Exception.VolNotFoundException;
import com.simulateur.simulateur_aerien.entities.Vol;
import com.simulateur.simulateur_aerien.services.VolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/vols")
public class GestionVolController {

    @Autowired
    private VolService volsService;

    @GetMapping("/Vol")
    public String showVolList(Model model){
        List<Vol> listVols = volsService.getAllVol();
        model.addAttribute("listVols", listVols);
        return "Vol";

    }

    @GetMapping("/vol/new")
    public String showNewForm(Model model){
        model.addAttribute("vol", new Vol());
        model.addAttribute("pageTitle", "Ajouter un vol");
        return"Vols_form";
    }

    @PostMapping("/vol/save")
    public String saveVol(@ModelAttribute("vol") Vol vol, @RequestParam(value = "stop", required = false) Boolean stop, RedirectAttributes ra) {
        vol.setStop(stop != null && stop); // Si la case à cocher est cochée, setStop à true, sinon false
        volsService.save(vol);
        ra.addFlashAttribute("message", "le vol a été ajouté avec succès.");
        return "redirect:/vols/Vol";
    }


    @GetMapping("/vol/edit/{id}")
    public String showEditForm(@PathVariable("id") Long id, Model model, RedirectAttributes ra) {
        try {
            Vol vol = volsService.get(id);
            model.addAttribute("vol", vol);
            model.addAttribute("pageTitle", "Modifier Vol : " + id + "");
            return "Vols_form";
        } catch (VolNotFoundException e) {
            ra.addFlashAttribute("message", e.getMessage());
            return "redirect:/vols/Vol";
        }

    }

    @GetMapping("vol/delete/{id}")
    public String deleteVol(@PathVariable("id") Long id, RedirectAttributes ra) {
        try {
            volsService.delete(id);
            ra.addFlashAttribute("message", "Le vol ID " + id + " a été supprimé.");
        } catch (VolNotFoundException e) {
            ra.addFlashAttribute("message", e.getMessage());
        }
        return "redirect:/vols/Vol";
    }
}
