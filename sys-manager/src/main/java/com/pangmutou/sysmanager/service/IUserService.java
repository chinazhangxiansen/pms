package com.pangmutou.sysmanager.service;

import com.pangmutou.sysmanager.bean.User;

import java.util.List;

public interface IUserService {

    boolean addUser(User user);

    boolean moveUserByUid(Integer uid);

    boolean modifyUserByUid(User user);

    User findUserByUid(Integer uid);

    List<User> findAllUser();

    List<User> findUsersByUserame(String username);
}
