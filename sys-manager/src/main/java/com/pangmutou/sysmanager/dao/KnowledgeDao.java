package com.pangmutou.sysmanager.dao;

import com.pangmutou.sysmanager.bean.Knowledge;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeDao {

    void insert(Knowledge knowledge);

    List<Knowledge> knowledgeList(Knowledge knowledge);

    List<Knowledge> selectAll(Knowledge knowledge);

    int selectAllCount();

    Knowledge selectById(Knowledge knowledge);



}
