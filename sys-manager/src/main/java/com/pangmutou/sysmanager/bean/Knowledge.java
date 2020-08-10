package com.pangmutou.sysmanager.bean;

public class Knowledge {

    private Integer id;
    private Integer group;
    private String content;
    private String answer;
    private Integer status;

    public Knowledge() {
    }

    public Knowledge(Integer id, Integer group, String content, String answer) {
        this.id = id;
        this.group = group;
        this.content = content;
        this.answer = answer;
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

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
