package com.pangmutou.sysmanager.dao;
import java.util.List;

import com.pangmutou.sysmanager.bean.User;
import org.springframework.stereotype.Repository;


@Repository
public interface IUserDao {

    boolean insertUser(User user);

    boolean deleteUserByUid(Integer uid);

    boolean updateUserByUid(User user);

    User selectUserByUid(Integer uid);
    List<User> selectAllUser();
    List<User> selectUsersByUserame(String username);
}
