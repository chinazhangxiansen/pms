package com.pangmutou.sysmanager.bean;

public class Knowledge {

    private Integer id;
    private Integer group;
    private String content;
    private String key;

    public Knowledge() {
    }

    public Knowledge(Integer id, Integer group, String content, String key) {
        this.id = id;
        this.group = group;
        this.content = content;
        this.key = key;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getGroup() {
        return group;
    }

    public void setGroup(Integer group) {
        this.group = group;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }
}
