package com.pangmutou.sysmanager.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/index/")
public class IndexController {

    @ResponseBody
    @RequestMapping("demo")
    public String demo(HttpServletRequest request){
        System.out.println("111");
        return "{\"ret_code\":\"1\",\"msg\":\"success\"}";
    }
}
