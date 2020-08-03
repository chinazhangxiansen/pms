package com.pangmutou.sysmanager.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/index/")
public class IndexController {

    @ResponseBody
    @RequestMapping("demo")
    public String demo(){
        return "success";
    }
}
