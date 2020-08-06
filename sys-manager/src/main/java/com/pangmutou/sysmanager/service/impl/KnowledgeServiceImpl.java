package com.pangmutou.sysmanager.service.impl;

import com.pangmutou.sysmanager.bean.Knowledge;
import com.pangmutou.sysmanager.dao.KnowledgeDao;
import com.pangmutou.sysmanager.service.KnowledgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KnowledgeServiceImpl implements KnowledgeService {

    @Autowired
    private KnowledgeDao knowledgeDao;


    @Override
    public void insert(Knowledge knowledge) {
        knowledgeDao.insert(knowledge);
    }

    @Override
    public List<Knowledge> knowledgeList(Knowledge knowledge) {
        return knowledgeDao.knowledgeList(knowledge);
    }

    @Override
    public List<Knowledge> selectAll(Knowledge knowledge) {
        return knowledgeDao.selectAll(knowledge);
    }

    @Override
    public int selectAllCount() {
        return knowledgeDao.selectAllCount();
    }

    @Override
    public Knowledge selectById(Knowledge knowledge) {
        return knowledgeDao.selectById(knowledge);
    }
}
