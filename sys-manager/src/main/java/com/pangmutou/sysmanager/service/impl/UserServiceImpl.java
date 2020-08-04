package com.pangmutou.sysmanager.service.impl;

import java.util.List;

import com.pangmutou.sysmanager.bean.User;
import com.pangmutou.sysmanager.dao.IUserDao;
import com.pangmutou.sysmanager.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private IUserDao userDao;

    @Override
    public boolean addUser(User user) {
        return userDao.insertUser(user);
    }

    @Override
    public boolean moveUserByUid(Integer uid) {
        return userDao.deleteUserByUid(uid);
    }

    @Override
    public boolean modifyUserByUid(User user) {
        return userDao.updateUserByUid(user);
    }

    @Override
    public User findUserByUid(Integer uid) {
        return userDao.selectUserByUid(uid);
    }

    @Override
    public List<User> findAllUser() {
        return userDao.selectAllUser();
    }

    @Override
    public List<User> findUsersByUserame(String username) {
        return null;
    }
}
