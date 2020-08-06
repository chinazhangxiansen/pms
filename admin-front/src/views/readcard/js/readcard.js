define(['m_msg'], function (m_msg) {
    function component_conf() {
        this.component_id = 'readcard_4aad5f9b';// ���id
        this.component_name = 'readcard';// ������ƣ���Ӧ��apps/serviceapps�������Ŀ¼���ƣ�ȷ��Ψһ��app����ά����
        this.dom_id = '' // ����ѡ��dom���ڵ�id
        this.compName_domId = '' // ����ѡ���������_dom���ڵ�id
        this.modules = [] //����б� app����ά�� ��ҵ������󶨹�ϵ��
        this.data = {    // ����ѡ�� �����ڴ�ű�������init�����п�ͨ��this.keyʹ��
            donext: true,
            object: null,
            //&compData&-s
            //&compData&-e
        };
        this.m_msg = { // ����ѡ��m_msg������ã����ڷ���ȫ����Ϣ
            state: { // ����ȫ����Ϣ
                //&mMsgState&-s
                //&mMsgState&-e
            },
            actions: { // ȫ��ע�����Ϣ���⣬ state��Ӧ��Ϣ���壬data������Ϣ����
                //&mMsgActions&-s
                //&mMsgActions&-e
            }
        };
        this.load = function (busidata) {  //��Ƕȹ�ͨЭ������
            //  busidataΪ���ҵ������������������ʱ������Ԫ���������ζ��崫��ҵ�����
        };

        this.result = function () { // ���ڻ�ȡ�����ִ�н��
            return {
                donext: this.data.donext,
                object: this.data.object
            }
        };
        this.visible = function () { // �������ʾ
            $('#' + component_conf.dom_id).show();
        };
        this.invisible = function () { // ���������
            $('#' + component_conf.dom_id).hide();
        };
        this.destory = function () { // ���������
            $('#' + component_conf.dom_id).remove();
        };
        this.methods = { // ����ѡ��ҵ���߼����������齫����ķ���д�ڴ˴�������init�������������Ӵ�
            dispatchMsg: function (theme, msg) {
                m_msg.dispatch(theme, msg, "component_conf.component_name");
            }.bind(this),
            onMsg: function () { // ��Ϣ����ʾ���� ����msg
                //&methodsOnMsg&-s
                //&methodsOnMsg&-e
            }.bind(this),
            //&releaseFunc&-s
            //&releaseFunc&-e
        };
        this.init = function () { // �����ʼ���������дҵ���߼�
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
            // �ϲ�state��ȫ�ֶ���
            m_msg.merge("component_conf.component_name", state)
            // ע��actions
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