package com.pangmutou.sysmanager.controller;

import com.pangmutou.common.utils.GsonUtil;
import com.pangmutou.sysmanager.bean.Knowledge;
import com.pangmutou.sysmanager.service.impl.KnowledgeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Controller
@RequestMapping("knowledge")
public class KnowledgeController {

    @Autowired
    private KnowledgeServiceImpl knowledgeService;

    @ResponseBody
    @RequestMapping("random")
    public String random(){
        Knowledge knowledge = new Knowledge();
        List<Knowledge> knowledgeList = knowledgeService.selectAll(knowledge);
        int count = knowledgeList.size();
        int max=count;
        int min=1;
        Random random = new Random();
        int s = random.nextInt(max)%(max-min+1) + min;
        knowledge = knowledgeList.get(s);
        return GsonUtil.GsonString(knowledge);
    }

    @ResponseBody
    @RequestMapping(value = "updateStatus",method = {RequestMethod.GET,RequestMethod.POST})
    public String updateStatus(Knowledge knowledge){
        Knowledge target = new Knowledge();
        target.setId(knowledge.getId());
        target.setStatus(1);
        knowledgeService.update(target);
        Map map = new HashMap();
        map.put("code","1");
        map.put("msg","success");
        return GsonUtil.GsonString(map);
    }

    @ResponseBody
    @RequestMapping(value = "add",method = RequestMethod.POST)
    public String doAdd(Knowledge knowledge){
        knowledgeService.insert(knowledge);
        Map map = new HashMap();
        map.put("code","1");
        map.put("msg","success");
        return GsonUtil.GsonString(map);
    }


}
