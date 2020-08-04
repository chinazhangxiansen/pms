package com.pangmutou.sysmanager.controller;

import java.util.ArrayList;
import java.util.List;

import com.pangmutou.sysmanager.bean.User;
import com.pangmutou.sysmanager.service.IUserService;
import com.pangmutou.sysmanager.utils.GsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@RestController
@RequestMapping("/userController")
public class UserController {

    @Autowired
    private IUserService userService;

    @RequestMapping("/addPage")
    public String regesterPage() {
        return "add.html";
    }

    /**
     * 添加user，添加成功重定向到用户信息页面
     * @param user
     * @param model
     * @param attributes
     * @return
     */
    @RequestMapping("/addUser")
    public String addUser(User user, Model model, RedirectAttributes attributes) {
        if (userService.addUser(user)) {
            attributes.addAttribute("uid", user.getUid());
            return "redirect:/userController/findUserByUid";
        }
        return "fail.html";
    }

    /**
     * 删除用户
     * @param uid
     * @return
     */
    @RequestMapping("/moveUser")
    public String moveUser(Integer uid) {
        if (userService.findUserByUid(uid) != null) {
            userService.moveUserByUid(uid);
            return "redirect:/userController/findAllUser";
        }
        return "fail.html";
    }

    /**
     * 查找先要修改的用户，查到跳转到修改页面
     * @param uid
     * @param model
     * @return
     */
    @RequestMapping("/modifyUser")
    public String modifyUser(Integer uid, Model model) {
        User user = userService.findUserByUid(uid);
        if (user != null) {
            model.addAttribute("user", user);
            return "modify.html";
        }
        return "fail.html";
    }

    /**
     * 修改用户，跳转到用户信息页面
     * @param user
     * @return
     */
    @RequestMapping("/modifyUserByUid")
    public String modifyUserByUid(User user) {
        userService.modifyUserByUid(user);
        return "redirect:/userController/findUserByUid?uid=" + user.getUid();
    }

    /**
     * 查所有用户
     * @param model
     * @return
     */
    @RequestMapping("/findAllUser")
    public String findAllUser(Model model) {
        List<User> users = userService.findAllUser();
        model.addAttribute("users", users);
        return  GsonUtil.GsonString(users);
    }

    /**
     * 通过ID查user，显示到用户信息页面
     * @param uid
     * @param model
     * @return
     */
    @RequestMapping("/findUserByUid")
    public String findUserByUid(Integer uid, Model model) {
        User user = userService.findUserByUid(uid);
        if (user != null) {
            List<User> users = new ArrayList<User>();
            users.add(user);
            model.addAttribute("users", users);
            return "userinfo.html";
        }
        return "fail.html";
    }
}
