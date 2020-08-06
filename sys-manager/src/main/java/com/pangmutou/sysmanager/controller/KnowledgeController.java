package com.pangmutou.sysmanager.controller;

import com.pangmutou.sysmanager.bean.Knowledge;
import com.pangmutou.sysmanager.service.impl.KnowledgeServiceImpl;
import com.pangmutou.sysmanager.utils.GsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Random;

@Controller
@RequestMapping("knowledge")
public class KnowledgeController {

    @Autowired
    private KnowledgeServiceImpl knowledgeService;

    @ResponseBody
    @RequestMapping("random")
    public String random(){
        int count = knowledgeService.selectAllCount();
        int max=count;
        int min=1;
        Random random = new Random();
        int s = random.nextInt(max)%(max-min+1) + min;
        System.out.println(s);
        Knowledge knowledge = new Knowledge();
        knowledge.setId(s);
        knowledge = knowledgeService.selectById(knowledge);
        return GsonUtil.GsonString(knowledge);
    }


}
