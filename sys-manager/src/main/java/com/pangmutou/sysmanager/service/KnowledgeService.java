package com.pangmutou.sysmanager.service;

import com.pangmutou.sysmanager.bean.Knowledge;

import java.util.List;

public interface KnowledgeService {

    void insert(Knowledge knowledge);

    void update(Knowledge knowledge);

    List<Knowledge> knowledgeList(Knowledge knowledge);

    List<Knowledge> selectAll(Knowledge knowledge);

    int selectAllCount();

    Knowledge selectById(Knowledge knowledge);

}
