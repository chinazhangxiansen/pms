/**
 * @author jiangyong
 *
 * @date 2018年3月27日 09:34:44
 *
 * layui校验formjs
 *
 * 1。两个输入参数，第一个参数定义该插件的依赖插件;第二个参数是回调函数，编写我们自定义插件的业务逻辑
 * 2.返回插件，调用exports函数，两个参数分别是 插件名称和插件对象
 *
 */
layui.define(['jquery', 'form'], function(exports) {


	"use strict";

	var $ = layui.jquery,
		form = layui.form;


	var checkForm = function() {
		this.config = {
			verify: {
				required: [
					/[\S]+/, '必填项不能为空'
				],
				phone: [
					/^1\d{10}$/, '请输入正确的手机号'
				],
				ip: [
					/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
					'请输入正确IP地址'
				],
				email: [
					/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, '邮箱格式不正确'
				],
				url: [
					/(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/, '链接格式不正确'
				],
				charSet: function(value) {
					if (!value || (value != "GBK" && value != "UTF-8")) return '只能填写GBK,或UTF-8'
				},
				strMax30:function(value){

					if(!value || value.length > 30) return '请填写30个字以内!';

				},
				strMax150:function(value){

					if(!value || value.length > 150) return '请填写150个字以内!';

				},
				number: function(value) {
					if (!value || isNaN(value)) return '只能填写数字'
				},
				number5: function(value) {
					if (!value || isNaN(value) || parseInt(value) > 4 || parseInt(value) < 0) return '请填写不小于0,小于5数字'
				},
				numberChar:[/^[0-9a-zA-Z]*$/g,'只是输入数字与字母'],
				number100: function(value) {

					var patrn = /^(0|[1-9]\d?|100)$/;
					if (value.search(patrn) == -1) {
						return "请输入0-100!";
					}
					return null;

				},
				date: [
					/^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/, '日期格式不正确'
				],
				identity: [
					/(^\d{15}$)|(^\d{17}(x|X|\d)$)/, '请输入正确的身份证号'
				],
				len:function(value,obj){

					var min = $(obj).attr("ag-len-min");

					var max = $(obj).attr("ag-len-max");

					if(util.isNull(min) && util.isNull(max)){

						return null;
					}


					if(!util.isNull(min) && !isNaN(min) && (!value || value.length < min)){

						return "请输入最少"+min+"个字!";

					}

					if(!util.isNull(max) && !isNaN(max) && !util.isNull(value) && value.length > max ){

						return "请输入最多"+max+"个字!";

					}

					return null;

				},
				requiredFile:function(value,othis){

					if( util.hasClass(othis,"ag-file")){

						var lis = $(othis).find(".ag-file-item-li");

						return lis.length == 0 ? "请上传附件!" : util.isNull($(lis[0]).data("ag-file-name-savename"))? "请上传附件!":null;
					}

					return null;

				},
				radio_required: function(value, obj) {

					var name = obj.name;
					if (obj.type == "radio") {
						var numChecked = 0;
						var input = $("[ag-verify='radio_required']");
						for (var i = 0; i < input.length; i++) {
							if (input[i].name == name) {
								if (input[i].checked) {
									numChecked++;
								}
							}
						}
						return numChecked == 0 ? '必选项!' : null;
					}
				},
				table_name: function(value, obj) {

					var patrn = /^[a-zA-Z][a-zA-Z0-9_]*$/;
					if (value.search(patrn) == -1) {
						return "必须以英文开头!";
					}
					return null;
				},
				tab_en: [/^[a-z_0-9]+$/, '列配置：英文表名必须为小写英文或者下划线！'],
				tab_required: [/[\S]+/, '列配置:必填项不能为空!'],
				tab_length: function(value) {
					if (!value || isNaN(value)) return '列配置:字段长度 必须为数字！'
				},
        limitNums:function(value,obj){
        	var min = $(obj).attr("minNum");

        	var max = $(obj).attr("maxNum");

        	if(util.isNull(min) && util.isNull(max)){

        		return null;
        	}


        	if(!util.isNull(min) && !isNaN(min) && (new Number(value)  < new Number(min))){

        		return "请最少上传"+min+"个文件!";

        	}

        	if(!util.isNull(max) && !isNaN(max) &&  new Number(value) > new Number(max) ){

        		return "请最多上传"+max+"个文件!";

        	}

        	return null;

        }

			}


		};
	};


	//验证规则设定
	checkForm.prototype.verify = function(settings) {

		var that = this;

		$.extend(true, that.config.verify, settings);

		form.verify(that.config.verify);

		return that;
	};

	/**
	 * 校验表单
	 *
	 */
	checkForm.prototype.validateForm = function(form) {


		var $this = this;
		var DANGER = 'layui-form-danger';
		var verifyElem = $(form).find('*[ag-verify]');
		var verify = $this.config.verify;
		var stop = null;


		$(verifyElem).each(function(_, item) {


			var othis = $(this),
				vers = othis.attr('ag-verify').split('|'),
				verType = othis.attr('lay-verType') //提示方式
				,
				value = othis.val();

			value = util.isNull(othis.val()) ? "" : value;

			othis.removeClass(DANGER);

			$(vers).each(function(_, thisVer) {



				var isTrue //是否命中校验
					, errorText = '' //错误提示文本
					,
					isFn = typeof verify[thisVer] === 'function';

				//匹配验证规则
				if (verify[thisVer]) {

					var isTrue = isFn ? errorText = verify[thisVer](value, item) : !verify[thisVer][0].test(value);

					var verMsg = $(item).attr("ag-verify-msg");

					errorText = errorText || verify[thisVer][1];

					if(!util.isNull(verMsg)){

						errorText = verMsg;
					}

					//如果是必填项或者非空命中校验，则阻止提交，弹出提示
					if (isTrue) {
						//提示层风格
						if (verType === 'tips') {

							layer.tips(errorText, function() {
								if (typeof othis.attr('lay-ignore') !== 'string') {
									if (item.tagName.toLowerCase() === 'select' || /^checkbox|radio$/.test(item.type)) {
										return othis.next();
									}
								}
								return othis;
							}(), {
								tips: 1
							});

						} else if (verType === 'alert') {

							layer.alert(errorText, {
								title: '提示',
								shadeClose: true
							});

						} else {

							layer.msg(errorText, {
								icon: 5,
								shift: 6
							});
						}

						item.focus();

						othis.addClass(DANGER);

						stop = true;

						return false;
					}
				}

			});


			if (stop) return false;

		});

		if (stop) {
			return false;
		} else {
			return true;
		};
	};

	checkForm.prototype.render = function(type, filter) {


		if (filter != undefined) {
			//局部渲染
			form.render(type, filter);

		} else if (type != undefined) {
			//元素类型渲染，select、checkbox、radio
			form.render(type);

		} else {
			//全部渲染
			form.render();
		}
	};



	//表单事件监听
	checkForm.prototype.on = function(events, callback) {

		form.on(events, callback);

	};

	var check = new checkForm();

	// check.render();

	form.verify(check.config.verify);

	exports("checkForm", check);
});
