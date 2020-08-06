define(['m_msg'], function (m_msg) {
    function component_conf() {
        this.component_id = 'readcard_4aad5f9b';// 组件id
        this.component_name = 'readcard';// 组件名称，对应于apps/serviceapps下组件的目录名称（确保唯一，app工厂维护）
        this.dom_id = '' // 【可选】dom根节点id
        this.compName_domId = '' // 【可选】组件名称_dom根节点id
        this.modules = [] //组件列表 app工厂维护 （业务组件绑定关系）
        this.data = {    // 【可选】 可用于存放变量，在init方法中可通过this.key使用
            donext: true,
            object: null,
            //&compData&-s
            //&compData&-e
        };
        this.m_msg = { // 【可选】m_msg组件配置，用于发布全局消息
            state: { // 定义全局消息
                //&mMsgState&-s
                //&mMsgState&-e
            },
            actions: { // 全局注册的消息主题， state对应消息定义，data则是消息内容
                //&mMsgActions&-s
                //&mMsgActions&-e
            }
        };
        this.load = function (busidata) {  //与非度沟通协商新增
            //  busidata为组件业务参数，加载组件运行时，根据元数据组件入参定义传入业务参数
        };

        this.result = function () { // 用于获取组件的执行结果
            return {
                donext: this.data.donext,
                object: this.data.object
            }
        };
        this.visible = function () { // 组件的显示
            $('#' + component_conf.dom_id).show();
        };
        this.invisible = function () { // 组件的隐藏
            $('#' + component_conf.dom_id).hide();
        };
        this.destory = function () { // 组件的销毁
            $('#' + component_conf.dom_id).remove();
        };
        this.methods = { // 【可选】业务逻辑方法，建议将抽离的方法写于此处，避免init方法块代码过于庞大
            dispatchMsg: function (theme, msg) {
                m_msg.dispatch(theme, msg, "component_conf.component_name");
            }.bind(this),
            onMsg: function () { // 消息订阅示例， 订阅msg
                //&methodsOnMsg&-s
                //&methodsOnMsg&-e
            }.bind(this),
            //&releaseFunc&-s
            //&releaseFunc&-e
        };
        this.init = function () { // 组件初始化，这里编写业务逻辑
            var self = this;
            //&initFunc&-s
            //&initFunc&-e
        }
    }

    return function (domid) {
        var componentConf = new component_conf();
        // var name = componentConf.component_name;
        var state = componentConf.m_msg.state;
        var actions = componentConf.m_msg.actions;
        componentConf.dom_id = domid;
        componentConf.compName_domId = componentConf.component_name + '_' + componentConf.dom_id;
        componentConf.methods.onMsg();
        if (state && actions) {
            // 合并state至全局对象
            m_msg.merge("component_conf.component_name", state)
            // 注册actions
            for (key in actions) {
                if (actions.hasOwnProperty(key)) {
                    m_msg.registerAction(key, actions[key], "component_conf.component_name");
                }
            }
        }
        ;

        return componentConf
    }
})