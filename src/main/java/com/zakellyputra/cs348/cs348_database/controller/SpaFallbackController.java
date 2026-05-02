package com.zakellyputra.cs348.cs348_database.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaFallbackController {

    @GetMapping(value = {
        "/{x:[^\\.]*}",
        "/{x:[^\\.]*}/{y:[^\\.]*}",
        "/{x:[^\\.]*}/{y:[^\\.]*}/{z:[^\\.]*}"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
