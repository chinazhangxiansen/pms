/**
 *
 * 扩展按钮事件处理
 *
 * @author xiacj
 * @version 1.0
 * @date 2020-02-16
 *
 */



layui.use(['element', 'form', 'table', 'checkForm', 'laydate', 'mapChooser'], function() {

	var form = layui.form,
		layer = layui.layer,
		$ = layui.$;
	table = layui.table;

	checkForm = layui.checkForm;

	laydate = layui.laydate;

	mapChooser = layui.mapChooser;

	//自定义插件
	var customPlugins = {};
	customPlugins["mapChooser"] = mapChooser;

	var $window = $(window);


	var file_types = {

		"application/pdf": "pdf",
		"application/x-zip-compressed": "zip",
		"image/gif": "gif",
		"image/png": "png",
		"image/jpg": "jpg",
		"image/bmp": "bmp",
		"image/jpeg": "jpg",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document":"doc",
		"application/msword":"doc",
		"application/vnd.ms-excel":"excel",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":"excel",
		"application/vnd.openxmlformats-officedocument.presentationml.presentation":"ppt"

	};

	/**
	 * 获取表单json格式参数
	 *
	 * @param {Object} formId
	 */
	function getFormJson(form) {

		var paramJson = {};
		var arr = $(form).find("input[type!=checkbox][name],textarea[name]");

		for (var i = 0; i < arr.length; i++) {
			paramJson[arr[i].name] = $(arr[i]).val();
		}

		var arr2 = $(form).find("select[name]");
		for (var i = 0; i < arr2.length; i++) {

			paramJson[arr2[i].name] = $(arr2[i]).val();



			if(!util.isNull(paramJson[arr2[i].name])){

				var nameKey = $(arr2[i]).attr("ag-sel-name");

				var text = $(arr2[i]).find("option:selected").text();

				paramJson[nameKey] = text;
			}


		}

		//复选框
		$(".ag-chkbox").each(function(idx, chkDiv) {
			var key = $(chkDiv).attr("ag-chkbox-name");
			var chkVal = "";
			$("input[name=" + key + "]").each(function(chkIdx, chk) {
				if ($(chk)[0].checked) {
					chkVal = chkVal + $(chk).attr("customVal") + ",";
				}
			});

			if (!util.isNull(chkVal)) {

				chkVal = chkVal.substr(0, chkVal.length - 1);
				paramJson[key] = chkVal;
			}
		});



		var agFile = $(form).find("[ag-file-submit-key]");

		/**
		 * 存储附件ID
		 */
		if (agFile.length > 0) {

			var key = agFile.eq(0).attr("ag-file-submit-key");

			if (!util.isNull(key)) {

				var arr = new Array();

				$.each(agFile.eq(0).find(".ag-file-item-li"), function(i, item) {

					if (!util.isNull($(item).data("ag-file-name-savename"))) {

						arr.push($(item).data("ag-file-name-savename"));
					}

				});

				paramJson[key] = arr.join(",");
			}


		}

		return paramJson;
	};



	/**
	 * 初始化查按钮的点击事件
	 *
	 */
	function initBtnLsnr() {

		$(".ag-btn-query").on("click", queryList);

		$(".ag-btn-add").on("click", addInit);

		$(".ag-btn-update").on("click", updateInit);

		$(".ag-btn-cancel").on("click", cancel);

		$(".ag-btn-save").on("click", save);
		//用bind方法绑定可能会导致重负提交
		$(".ag-btn-del").on("click", del);

		$(".ag-btn-reset").on("click",resetForm);

		$(".ag-data-tree").on("click",initAgZtree);

    $(".ag-btn-export").on("click", exportOrder);

	};

	function resetForm(){

			var index = $(this).attr("ag-data-index");
			var form = $(".ag-form[ag-data-index=" + index + "]");

			$.each(form.find("[name]"),function(i ,item){

					$(item).val("");
			});

			layui.form.render();

	}

	/**
	 *
	 * 处理分页按钮事件,数据加载之后调用
	 *
	 */
	function addPageLisnr(page, index) {

		var pageHtml =
			'<a href="#" rel="pre" class="ag-btn-page-pre">&lt; 上一页</a> <a href="#" rel="next" class="ag-btn-page-next">下一页&gt;</a><span id="totalPageSpan"></span>|<span id="totalRecordSpan"></span>|<span id="pageNoSpan"></span>';
		$(".ag-area-page").html(pageHtml);

		//上一页
		$(".ag-btn-page-pre").unbind();
		$(".ag-btn-page-pre").bind("click", function() {

			var pageNo = parseInt(page.pageNo);
			if (pageNo >= 2) {

				pageNo = pageNo - 1;
				var pageSize = page.pageSize;


				var pageJson = {
					"pageNo": pageNo,
					"pageSize": pageSize
				};
				var pageJsonStr = JSON.stringify(pageJson);
				$("input[name=page]").val(pageJsonStr);

				$(".ag-btn-query[ag-data-index=" + index + "]").click();

			}


		});

		//下一页
		$(".ag-btn-page-next").unbind();
		$(".ag-btn-page-next").bind("click", function() {

			var pageNo = parseInt(page.pageNo);
			var totalPage = parseInt(page.totalPage);

			if ((pageNo + 1) <= totalPage) {

				pageNo = pageNo + 1;
				var pageSize = page.pageSize;
				var pageJson = {
					"pageNo": pageNo,
					"pageSize": pageSize
				};
				var pageJsonStr = JSON.stringify(pageJson);
				$("input[name=page]").val(pageJsonStr);

				$(".ag-btn-query[ag-data-index=" + index + "]").click();
			}

		});


		$("#totalPageSpan").html("总页数:" + page.totalPage);
		$("#totalRecordSpan").html("总记录数:" + page.totalRecord);
		$("#pageNoSpan").html("当前页:" + page.pageNo);

	};


	/**
	 * 根据列配置信息和数据，装饰数据，加入链接处理
	 *
	 * @param {Object} colInfo
	 * @param {Object} data
	 */
	function decorateData(colsStr) {

		var colModel = $.parseJSON(colsStr);

		for (var i = 0; i < colModel.length; i++) {

			for (var k = 0; k < colModel[i].length; k++) {


				if (!colModel[i][k].align) {

					colModel[i][k].align = "center";
				}

				if (colModel[i][k].btns) {

					if (!$.isArray(colModel[i][k].btns)) {

						return;
					}
					var id = "tpl_btns_" + util.randomWord(false, 8);

					colModel[i][k].templet = "#" + id;

					var appendAHtml = "";

					for (var z = 0; z < colModel[i][k].btns.length; z++) {


						var item = colModel[i][k].btns[z];


						var realUrl = decorateTpl(item.url);

						var lsnrStr = getHrefLsnr(item.openType);

						var opts = {"ag-data-url":realUrl,
									"ag-win-title":item.openTitle,
									"ag-win-width":item.width,
									"ag-win-height":item.height,
									"ag-data-refresh":item.refresh,
                  "ag-data-ctx":item.ctx}

						var aFunc = lsnrStr + "("+JSON.stringify(opts)+")";

						var a = "<a href='javascript:void(0)'  style='padding:0px 5px' class=' layui-table-link " + item.className +
							"' onclick='" + aFunc + " '>" + (item.btnVal ? item.btnVal : "操作") + "</a>";

						appendAHtml += a;

					}

					appendScript(id, appendAHtml);
				}

        //imgs
        if (colModel[i][k].imgs) {

        	if (!$.isArray(colModel[i][k].imgs)) {

        		return;
        	}
        	var id = "tpl_imgs_" + util.randomWord(false, 8);

        	colModel[i][k].templet = "#" + id;

        	var appendAHtml = "";

        	for (var z = 0; z < colModel[i][k].imgs.length; z++) {


        		var item = colModel[i][k].imgs[z];


        		var realUrl = decorateTpl(item.url);



        		var a = "<img alt='点击放大' onclick='showBigImage(this)' src='data:image/jpg;base64,"+item.btnVal+"' height='30' width='30'/>";

        		appendAHtml += a;


        	}

        	appendScript(id, appendAHtml);
        }


			}


		}

		return colModel;

	}

	/**
	 *根据href的类型获取链接处理函数名称
	 *
	 * @param {Object} openType
	 */
	function getHrefLsnr(openType) {

		var hrefLsnr = {
			"openType0": "_listHrefDownloadFile",
			"openType1": "_listHrefWindow",
			"openType2": "_listHrefTab",
			"openType3":"_listHrefPost",
		};
		var funcName = hrefLsnr["openType" + openType];
		return funcName;
	}

	function appendScript(id, a) {

		if ($("#" + id).length > 0) {

			$("#" + id).remove();
		}


		var scr = $("<script type='text/html' id='" + id + "'>"+a+"</script>");

		scr.appendTo($(document.body));



	}

	/**
	 *
	 * 根据配置url和参数 转换模板
	 *
	 */
	function decorateTpl(inUrl, model) {



		var reg = new RegExp("&amp;","g");
		var url = inUrl.replace(reg, "&");
		var realUrl = url;

		if (url.indexOf("?") != -1) {

			var tempArr = url.split("?");

			var realParam = "";

			var urlNoParam = tempArr[0];

			var paramStr = tempArr[1];

			var paramArr = paramStr.split("&");




			for (var k = 0; k < paramArr.length; k++) {

				var pair = paramArr[k].split("=");

				if (pair.length == 1 || util.isNull(pair[1])) {

					realParam += paramArr[k] + "&";

					continue;

				}

				/**
				 * $Query 代表从查询参数获取
				 */

				if ("$Query" == pair[1]) {

					if ($("[name=" + pair[0] + "]").length > 0) {

						realParam += pair[0] + "=" + $("[name=" + pair[0] + "]").eq(0).val() + "&";

					} else {

						realParam += pair[0] + "=" + "&";
					}

					continue;

				}

				var arr = pair[1].match(/@(\S*)@/g);

				 arr = arr == null ? [] :arr;

				var arr1 = pair[1].match(/#(\S*)#/g);

				arr1 = arr1 == null ? [] :arr1;

				for( var i = 0 ; i < arr1.length ; i++){

					arr.push(arr1[i]);
				}

				if (arr != null) {

					for (var i = 0 ;  i < arr.length ; i++){

						pair[1] = pair[1].replace(arr[i], "{{d." + arr[i].substring(1, arr[i].length - 1) + "}}");
					}

					realParam += pair[0] + "=" + pair[1] + "&";

					continue;
				}


				realParam += paramArr[k] + "&";


			}

			realUrl = urlNoParam + "?" + realParam;
		}

		realUrl = realUrl.replace("@ctx@",ctx);


		return realUrl;

	}

	/**
	 *
	 * 查询方法
	 */
	function queryList() {

    //var index = $(this).attr("ag-data-index");
		var index = $(this).attr("ag-data-index");
		var form = $(".ag-form[ag-data-index=" + index + "]");
		var url = $(this).attr("ag-data-url");

		var checkRet = checkForm.validateForm(form);

		if (!checkRet) {

			return false;
		}

		initPage(index);

		var param = getFormJson($(".ag-form[ag-data-index=" + index + "]"));

		var queryParams = $(this).data("query-params");

		if(!util.isNull(queryParams)){

			var queryJson  = $.parseJSON(queryParams);

			delete queryJson.page;

			var checkParam = $.extend({},param);

			delete checkParam.page;

			if(JSON.stringify(queryJson) != JSON.stringify(checkParam)){

				$(" input[name=page]",form).val('{"pageNo":"1","pageSize":"20"}');

				param.page = '{"pageNo":"1","pageSize":"20"}';

			}

		}

		$(this).data("query-params",JSON.stringify(param));

		var agCtx = util.getAgCtx(this);

		url = ctx + "/" + agCtx + url;

		util.ajaxJson("查询中,请稍后...", url, param, function(page) {

			var colsStr = $(".ag-table-header[ag-data-index=" + index + "]").html();

			var cols = decorateData(colsStr);

			//执行一个 table 实例
			table.render({

				elem: $(".ag-table[ag-data-index=" + index + "]"),
				height: $(".ag-table[ag-data-index=" + index + "]").height()-35 ,
				data: page.data, //数据接口
				title: '用户表',
				page: false, //开启分页
				totalRow: false, //开启合计行
				limit:$.parseJSON(param.page).pageSize,
				cols: cols
			});

			buildPage(page, index);

		}, function(req) {

			var page = $("input[name=page]").val();
			req.setRequestHeader("page", page);

		});
	};


	function initPage(idx) {



		if ($(".ag-form[ag-data-index=" + idx + "] > input[name=page]").length == 0  ){

			var input = $("<input type='hidden' name='page' value=''>");

			$(".ag-form[ag-data-index=" + idx + "]").append(input);

		}

		if(util.isNull($(".ag-form[ag-data-index=" + idx + "] > input[name=page]").val())){

			$(".ag-form[ag-data-index=" + idx + "] > input[name=page]").val('{"pageNo":"1","pageSize":"20"}');

		}

		var pager = $(".ag-table[ag-data-index=" + idx + "] ").siblings(".ag-area-page");


		if (pager.length == 0) {

			return;
		}

		if (pager.children(".layui-table-page").length > 0) {

			return;

		}

		pager.empty();



		var pageSize  = $.parseJSON($(".ag-form[ag-data-index=" + idx + "] > input[name=page]").val()).pageSize;

		var pageDiv = $('<div class="layui-table-page"></div>');

		var box = $("<div class='layui-box layui-laypage layui-laypage-default'></div>");

		var firstA = $(
			'<a href="javascript:;" class="layui-laypage-prev layui-disabled" data-page="1"><i class="layui-icon"></i></a>');

		box.append(firstA);

		var lastA = $(
			'<a href="javascript:;" class="layui-laypage-next layui-disabled" data-page="1"><i class="layui-icon"></i></a>');

		box.append(lastA);

		var search = $(
			'<span class="layui-laypage-skip">到第<input type="text" min="1" max = "1" value="1" class="layui-input">页<button type="button" class="layui-laypage-btn">确定</button></span>'
		);

		box.append(search);

		var count = $('<span class="layui-laypage-count">共 0 条</span>');

		box.append(count);

		var limit = $(
			'<span class="layui-laypage-limits"><select class="page-select"><option value="10" >10 条/页</option><option value="20">20 条/页</option><option value="30">30 条/页</option><option value="40">40 条/页</option><option value="50">50 条/页</option><option value="60">60 条/页</option><option value="70">70 条/页</option><option value="80">80 条/页</option><option value="90">90 条/页</option></select></span>'
		);


		box.append(limit);

		pageDiv.append(box);

		pager.append(pageDiv);

		pager.find(".page-select").val(pageSize);


		/**
		 *  上一页、下一页、页码点击事件绑定
		 */
		pager.delegate(".layui-laypage-prev,.layui-laypage-next,.ipage:not(.layui-laypage-curr)", "click", function(e) {

			if ($(this).hasClass("layui-disabled")) {

				return;
			}

			var dataPage = $(this).attr("data-page");


			var pageInput = $(".ag-form[ag-data-index=" + idx + "] > input[name=page]");

			var json  =  $.parseJSON(pageInput.val());

			json.pageNo = dataPage;

			pageInput.val(JSON.stringify(json));

			$(".ag-btn-query").trigger("click");

			/**
			 * 输入页码点击确定事件绑定
			 */
		}).delegate(".layui-laypage-skip .layui-laypage-btn", "click", function() {

			var input = $(this).parent().find("input");

			var min = input.attr("min");

			var max = input.attr("max");

			if (isNaN(input.val())) {

				util.showDialog("请输入数字！", 0);

				return;
			}


			if (parseInt(input.val()) < min) {

				util.showDialog("最小页码：1，请重新输入！", 0);

				return;
			}

			if (parseInt(input.val()) > max) {

				util.showDialog("最大页码：" + max + "，请重新输入！", 0);

				return;
			}

			var pageInput = $(".ag-form[ag-data-index=" + idx + "] > input[name=page]");

			var json  =  $.parseJSON(pageInput.val());

			json.pageNo = input.val();

			pageInput.val(JSON.stringify(json));

			$(".ag-btn-query").trigger("click");

		}).delegate(".layui-laypage-limits select", "change", function() {

			var pageInput = $(".ag-form[ag-data-index=" + idx + "] > input[name=page]");

			var json  =  $.parseJSON(pageInput.val());

			json.pageSize =  $(this).val();

			pageInput.val(JSON.stringify(json));

      $(".ag-btn-query").trigger("click");

		});



	}

	function buildPage(data, idx) {

		var pager = $(".ag-table[ag-data-index=" + idx + "] ").siblings(".ag-area-page");


		if (pager.length == 0) {

			return;
		}

		if (data == undefined) {

			data = {};

			data.pageNo = 1;

			data.totalPage = 1;

			data.totalRecord = 0;

		}
		pager.find(".ipage").remove();

		pager.find(".layui-laypage-count").html("共 " + data.totalRecord + " 条");


		pager.find(".layui-laypage-skip input").attr("max", data.totalPage);

		var prev = pager.find(".layui-laypage-prev");

		var next = pager.find(".layui-laypage-next");

		prev.removeClass("layui-disabled");

		next.removeClass("layui-disabled");

		prev.attr("data-page", parseInt(data.pageNo) <= 1 ? "1" : parseInt(data.pageNo) - 1);

		next.attr("data-page", parseInt(data.pageNo) >= parseInt(data.totalPage) ? data.totalPage : parseInt(data.pageNo) +
			1);

		var endNum = 0;

		var startNum = 0;

		if (parseInt(data.pageNo) <= 1) {

			endNum = parseInt(data.totalPage) >= 3 ? parseInt(data.pageNo) + 2 : parseInt(data.totalPage);

			startNum = 1;

			prev.addClass("layui-disabled");


		}

		if (parseInt(data.pageNo) >= parseInt(data.totalPage)) {

			endNum = parseInt(data.pageNo);

			startNum = parseInt(data.totalPage) < 3 ? 1 : parseInt(data.pageNo) - 2;

			next.addClass("layui-disabled");

		}

		if (parseInt(data.pageNo) > 1 && data.pageNo < data.totalPage) {

			startNum = parseInt(data.pageNo) - 1;

			endNum = parseInt(data.pageNo) + 1;



		}

		for (var i = startNum; i <= endNum; i++) {

			if (i == parseInt(data.pageNo)) {

				var currSpan = $('<span class="layui-laypage-curr ipage"><em class="layui-laypage-em"></em><em>' + data.pageNo +
					'</em></span>');

				next.before(currSpan);

			} else {

				var a = $('<a href="javascript:;" class="ipage" data-page="' + i + '">' + i + '</a>');

				next.before(a);
			}
		}



	}


	var btnOpt={
		"ag-data-index":"",
		"ag-win-check":"",
		"ag-data-url":"",
		"ag-win-id":"0",
		"ag-data-pk":"id",
		"ag-win-width":"800",
		"ag-win-height":"600",
		"ag-win-title":"",
		"ag-win-type":"1",
		"data":"",
		"ag-data-ctx":"sysmgr",
		"ag-data-refresh":""

	}

	function buildBtnOpt(obj){

		var opt = $.extend({},btnOpt);

		for(var key in btnOpt){

			var val =  $(obj).attr(key);

			if(!util.isNull(val)){

				opt[key] = val;
			}

		}

		var tableId = $("table[ag-data-index=" + opt["ag-data-index"] + "]").attr("id");

		var checkStatus = table.checkStatus(tableId);

		opt.data = checkStatus.data; //获取选中行数据

		var appendUrl = "";


		if(!util.isNull(opt.data) && $.isArray(opt.data) && opt.data.length > 0){


			$.each(opt["ag-data-pk"].split(","),function(i,t){

					appendUrl = appendUrl + t +"=" + opt.data[0][t] +"&";

			})

			var url = opt["ag-data-url"];

			if(!util.isNull(url)){

				if (url.indexOf("?") == -1) {

					url = url + "?" + appendUrl;

				} else {

					url = url + "&" + appendUrl;
				}

				opt["ag-data-url"] = url;
			}


		}





		return opt;
	}
	/**
	 *
	 * 修改初始化方法
	 *
	 ***/
	function updateInit() {


		var opt  = buildBtnOpt(this);

		if (opt.data.length == 0) {

			util.warning('请选择一条数据库记录!');

			return;
		}

		if(!util.isNull(opt["ag-win-check"]) && !util.call(opt["ag-win-check"],opt)){


			return ;
		}

		util.call(getHrefLsnr(opt["ag-win-type"]),opt);


	};

	function cancel() {
		util.closeWin();
	};


	/**
	 *添加初始化方法
	 *
	 ***/
	function addInit() {

		var opt  = buildBtnOpt(this);
		if(!util.isNull(opt["ag-win-check"]) && !util.call(opt["ag-win-check"],opt)){


			return ;
		}

		util.call(getHrefLsnr(opt["ag-win-type"]),opt);

	};

	/***
	 *保存方法-增加或者修改的保存方法
	 *
	 **/
	function save() {

		var index = $(this).attr("ag-data-index");

		var form = $(".ag-form[ag-data-index=" + index + "]");

		var checkRet = checkForm.validateForm(form);
		if (!checkRet) {
			return false;
		}

		var agCtx = util.getAgCtx(this);

		var url = ctx + "/" + agCtx + $(this).attr("ag-data-url");

		var param = getFormJson(form);

		var that = this;

		util.ajaxJson("保存中,请稍后....",url,param,function(data){

				var result = data.result;
				var desc = data.desc;

				if (result == 0) {
					util.success(desc);

					var queryBtn = parent.layui.$(".ag-btn-query");
					if (queryBtn.length > 0) {
						$(queryBtn).click();
						//util.closeWin();
					}

					var func = $(that).attr("ag-back-func");

					if (!util.isNull(func)) {

						if(func.indexOf(".") != -1){

							eval(func);

							return ;
						}

						window[func](data);
					}


				} else {
					util.error(desc);
				}




		});


	};

	function del() {

		var opt  = buildBtnOpt(this);

		if (opt.data.length == 0) {

			util.warning('请选择一条数据库记录!');

			return;
		}

		if(!util.isNull(opt["ag-win-check"]) && !util.call(opt["ag-win-check"],opt)){

			return ;
		}


		util.showDialog("您确定要删除选中记录么?", 3, doDel, opt);

	}

	function doDel(opt) {


		var url = ctx + "/" + opt["ag-data-ctx"]  + opt["ag-data-url"];


		util.ajaxJson("删除中,请稍后!", url, {}, function(data) {

			var result = data.result;
			var desc = data.desc;

			if (result == 0) {

				util.success(desc);

				var queryBtn = layui.$(".ag-btn-query");

				if (queryBtn.length > 0) {

					$(queryBtn).click();
				}

				var func = $(this).attr("ag-back-func");

				if (!util.isNull(func)) {

					if(func.indexOf(".") != -1){

						eval(func);

						return ;
					}

					window[func](data);
				}
			} else {
				util.error(desc);
			}

		});
	}

	function createFile() {

		var formFile = new Object();

		formFile.config = {

			"ag-file-multiple": "true",
			"ag-file-delete": "true",
			"ag-file-add": "true",
			"ag-file-down": "true",
			"ag-file-max": 99,
			"ag-file-iframe-down-url":"/sys/settings/file/download",
			"ag-file-iframe-del-url" : "/sys/settings/file/delFile",
			"ag-file-iframe-add-url":"/sys/settings/file/upload",
			"ag-file-iframe-name":"downloadHidenFr",
			"ag-data-ctx":"sysmgr"
		}

		formFile.loadForm = function(obj) {

			this.form = $(obj);
			/**
			 * 当存在附件时生成附件dom 并 绑定附件相关事件
			 */
			this.loadFormFiles();
			/**
			 * 绑定事件
			 */
			this.bindLsnr();

		}




		formFile.bindLsnr = function() {

			var that = this;

			var width = that.form.width();

			that.form.find(".ag-file").width(parseInt(width /305) * 305 - 120 );

			window.onresize = function(){

					var width = that.form.width();

					var num = parseInt(width /305);

					that.form.find(".ag-file").width( num* 305 - 120 -(num == 1 ? 5 : 0));

			}

			// that.form.delegate(".ag-file .ag-file-header .ag-file-header-button", "click", function() {
			// 	$(this).siblings(".ag-file-header-file").trigger("click");

			// });
			/**
			 *  附件添加事件
			 */
			that.form.delegate(".ag-file .ag-file-header .ag-file-header-file", "change", function(e) {

				var inputFile = $(this);

				var agFile = that.form.find(".ag-file").eq(0);

				var items = agFile.find(".ag-file-item-li");

				var maxNum = agFile.attr("ag-file-max");

				if (parseInt(maxNum) <= items.length) {

					util.showDialog("最大添加附件数量:" + maxNum + ",无法继续添加!", 0);

				} else {

					var IEVersion = util.IEVersion();

					if(IEVersion > 0 && IEVersion < 10 ){

						that.addFileIE(inputFile,inputFile.parent().parent());


					}else{

						$.each(inputFile[0].files, function(i, file) {

							that.addIfile(file, inputFile.parent().parent());

						});


						inputFile.after(inputFile.clone().val(""));


						inputFile.remove();

					}



				}







			});


			/*****预览事件****/
			that.form.delegate(".ag-file .ag-file-item-li-thumb .ag-file-item-li-thumb-icon", "click", function() {

			});


			$.each(that.form.find(".ag-file"), function(i, f) {

				f = $(f);

				if (f.attr("ag-file-down") == "true") {

					f.delegate(".ag-file-item-li-thumb-icon", "click", function() {


						$(this).parent().parent().parent().find(".ag-file-item-li-title").trigger("click");

					});


					/*****下载事件****/
					f.delegate(".ag-file-item-li .ag-file-item-li-title", "click", function() {


						var li = $(this).parents(".ag-file-item-li:first");



						var saveName = li.data("ag-file-name-savename");

						if (util.isNull(saveName)) {

							util.showDialog("未上传,不能下载！", 0);

							return;
						}

						var url = f.data("ag-file-iframe-down-url");

						url = ctx + "/" + util.getAgCtx(f) + url;

						_listHrefDownloadFile({"ag-data-url":url + "?saveName=" + saveName + "&fileId=" + saveName});

					});

				}

				if (f.attr("ag-file-delete") == "true") {

					/*****删除事件****/
					f.delegate(".ag-file-item-li .ag-file-delete .layui-icon.layui-icon-delete", "click", function() {

						var li = $(this).parents(".ag-file-item-li:first");

						var saveName = li.data("ag-file-name-savename");

						var fileThat = $(this);

						if (util.isNull(saveName)) {

							fileThat.parents(".ag-file-item-li:first").remove();

							return;
						}


						var url = f.data("ag-file-iframe-del-url");

						url = ctx + "/" + util.getAgCtx(f) + url;

						util.showDialog("您确定要删除选中附件么?", 3, function(){

							util.ajaxJson("删除中,请稍后...", url, {
								"fileId": saveName
							}, function(data) {

								if (data.result == "0") {

									fileThat.parents(".ag-file-item-li:first").remove();

									util.showDialog("删除成功!", 2);

									return;
								}

								util.showDialog("删除失败!", 0);


							});

						}, {});



					});

				}


			});


		}





		/**
		 * 当存在附件类名时，生成附件dom
		 */
		formFile.loadFormFiles = function() {

			var that = this;

			var fileDiv = that.form.find(".ag-file");

			if (fileDiv.length == 0) {

				return;
			}

			var defaultOpt = $.extend({},that.config);

			$.each(fileDiv, function(i, f) {

				f = $(f);

				for (var key in defaultOpt) {

					if (util.isNull(f.attr(key))) {

						f.attr(key, defaultOpt[key]);
					}

					f.data(key,f.attr(key));

				}

				/**
				 * 判断是否可新增附件
				 */
				if (f.attr("ag-file-add") == "true") {

					that.appendFileHeadeTpl(f);


				}


				var item = $("<ol class='ag-file-item'></ol>");

				f.append(item);

				/*********插入下载配置*********/
				if ($("[name="+f.data("ag-file-iframe-name")+"]").length == 0) {

					var iframe = $("<iframe name='"+f.data("ag-file-iframe-name")+"' class='layui-hide'></iframe>");

					f.append(iframe);
				}

			});

		}


		/**
		 * 追加添加附件区域
		 */
		formFile.appendFileHeadeTpl = function(f) {

			var headerDiv = $("<div class='ag-file-header'></div>");

			var headerTextDiv = $("<span class='ag-file-header_text'></span>");

			var headerIcon = $("<span class='ag-file-header_icon'></span>");

			var headerBtn = $("<button type='button' class='ag-file-header-button'> 添加附件.</button>");

			var multiple = f.attr("ag-file-multiple");

			var headerInput = $("<input class='ag-file-header-file' name='file' type='file' " + (multiple == "true" ? "multiple" : "") +
				" />");

			headerDiv.append(headerTextDiv);
			headerDiv.append(headerIcon);
			headerDiv.append(headerBtn);
			headerDiv.append(headerInput);


			f.append(headerDiv);
		}
		/**
		 * 上传事件
		 */

		formFile.uploadFile = function(file, layFilter) {


			var that = this;

			var form = new FormData();

			form.append("file", file);

			var moduleName = that.form.find(".ag-file").eq(0).attr("ag-file-module");

			form.append('moduleName', moduleName);

			var url = that.form.find(".ag-file").eq(0).data("ag-file-iframe-add-url");

			url = ctx + "/" + util.getAgCtx(that.form.find(".ag-file").eq(0)) + url;

			util.ajaxFile("上传中,请稍后...", url, form, function(data) {


				if (data.result != 0) {

					that.error(layFilter, data.desc.length > 50 ? "上传失败!":data.desc);

					return;
				}

				that.succ(layFilter, data.body);

			}, function(data) {


				var msg = "上传失败...";

				try {

					var json = $.parseJSON(data.responseText);

					if (json.message && json.message.indexOf("Maximum") != -1) {

						msg = "附件大小超出服务器限制";
					}
				} catch (e) {

				}


				that.error(layFilter, msg);

			}, function(myXhr) {

				if (myXhr.upload) {

					myXhr.upload.addEventListener('progress', function(e) {

						var progressRate = parseInt(e.loaded * 100 / e.total) + '%';


						layui.element.progress(layFilter, progressRate == "100%" ? "99%" : progressRate);

					}, false);

				}
				return myXhr;
			});




		}

		formFile.error = function error(layFilter, msg) {

				var that = this;

				$("[lay-filter=" + layFilter + "]", that.form).children().removeClass("layui-bg-green").addClass("layui-bg-red")
					.width("100%").text(
						msg).css("text-align", "center");
				$("[lay-filter=" + layFilter + "]", that.form).parents(".ag-file-item-li:first").data("ag-file-name-savename",
					"");

		}
		formFile.succ = function (layFilter, data) {

				var that = this;

				layui.element.progress(layFilter, "100%");

				$("[lay-filter=" + layFilter + "]", that.form).parents(".ag-file-item-li:first").data("ag-file-name-savename",
					data.saveName);
				$("[lay-filter=" + layFilter + "]", that.form).children().width("100%").text(
					'上传成功!').css({
					"text-align": "center",
					"color": "white"
				});

		}

		formFile.addFileIE = function(obj,f){

			var that = this;

			var moduleName = that.form.find(".ag-file").eq(0).attr("ag-file-module");

			var url = that.form.find(".ag-file").eq(0).data("ag-file-iframe-add-url");

			var iframeName = that.form.find(".ag-file").eq(0).data("ag-file-iframe-name");

			url = ctx + "/" + util.getAgCtx(that.form.find(".ag-file").eq(0)) + url+"IE";

			$("form[form_"+iframeName+"]").remove();

			var form = $('<form method="post" style="display:none;"    name="form_'+iframeName+'" enctype="multipart/form-data" />');

			obj.after(obj.clone().val(""));

			obj.appendTo(form);

			form.append($("<input type='hidden' name='moduleName' value='"+moduleName+"'/>"));

			form.append($("<input type='hidden' name='agileauthtoken' value='"+util.getToken()+"'/>"));

			$(document.body).append(form);

			form.ajaxSubmit({
				async:false,
				type:"post",
				url:url,
				dataType:"text/html",
				beforeSubmit:function(formData, jqForm, options){

					util.load("附件上传ing..");
				},
				success:function(data){


					util.disLoad();

					data = $.parseJSON(util.decode(data));

					if(data.result == "0"){

						var body  =data.body;

						body.fileType = file_types[body.fileType] ? file_types[body.fileType] : "default";

						body.fileSize = Math.ceil(body.fileSize / 1024);

						var layFilter = that.appendFileItemTpl(body, f);

						that.succ(layFilter, body);

						return ;
					}

					util.error("上传失败!");



				},
				error:function(xhr, status, error,form){


					util.disLoad();

					util.error("上传失败!");


				}

			});






		}
		/**
		 *  插入附件 obj 可能是file对象 也可能是查询返回的bean
		 * @param {Object} obj
		 */
		formFile.addIfile = function(obj, f) {

			var that = this;

			var data = {};

			if (obj instanceof File) {

				data.fileType = file_types[obj.type] ? file_types[obj.type] : "default";

				data.fileName = obj.name;

				data.fileSize = Math.ceil(obj.size / 1024);

				data.file = obj;

				data.opTime = util.getTime();

				if(data.fileSize/1024 > 30){

					util.error("最大上传文件大小20M!");

					return ;
				}

			} else {

				$.extend(true, data, obj);

				data.fileType = file_types[obj.fileType] ? file_types[obj.fileType] : "default";

				data.fileSize = Math.ceil(data.fileSize / 1024);
			}

			/**
			 * 根据数据追加附件模板 返回进度条唯一标识
			 */
			var layFilter = that.appendFileItemTpl(data, f);

			/**
			 * 如果是附件上传操作则向后台发送请求传输对象
			 */
			if (data.file) {

				$("[lay-filter=" + layFilter + "]", that.form).removeClass("layui-hide");

				$("[lay-filter=" + layFilter + "]", that.form).children().removeClass("layui-bg-red").removeClass(
					"layui-bg-green");

				that.uploadFile(obj, layFilter);

			}

		}

		/**
		 *  追加附件模板到指定区域
		 * @param {Object} data
		 */
		formFile.appendFileItemTpl = function(data, f) {

			var that = this;


			var li = $('<li  class="ag-file-item-li"></li>');

			li.data("ag-file-name-filename", data.fileName);
			li.data("ag-file-name-savename", data.saveName);
			li.data("ag-file-name-optime", data.opTime);
			li.data("ag-file-name-filesize", data.fileSize);

			var thumb = $('<div class="ag-file-item-li-thumb"></div>');

			var span = $('<span class="ag-file-item-li-thumb-icon ag-form-type-'+data.fileType+'"></span>');

			var a = $('<a href="#" title="点击下载：' + data.fileName + '"></a>');

			a.append(span);

			var random = util.randomWord(false, 32);

			var progress = $('<div class="layui-progress   layui-progress-big	" lay-filter="' + random +
				'" lay-showPercent="true">  <div class="layui-progress-bar text-white" lay-percent="0%"><span class="layui-progress-text">0%</span></div></div>'
			);

			var dl = $("<dl></dl>");

			var dt = $("<dt></dt>");

			var span = $("<span class='ag-file-blender'></span>");

			var deleteDiv = $(
				"<div class='ag-file-delete' ><a title='删除此附件' href='#' ><span class=' layui-icon layui-icon-delete'></span></a></div>"
			);

			var downA = $("<a href='#' class='ag-file-item-li-title' title='点击下载：" + data.fileName + "' >" + data.fileName +
				"</a>");

			var sizeDd = $("<dd class='ag-file-item-li-size' >" + data.fileSize + "kb</dd>");

			var timeDd = $("<dd class='ag-file-item-li-date'><time >" + util.timeDiff(data.opTime) + "</time></dd>");

			dt.append(span);


			if (f.attr("ag-file-delete") == "true") {

				dl.append(deleteDiv);
			}

			dt.append(downA);

			dl.append(dt);
			dl.append(sizeDd);
			dl.append(timeDd);

			thumb.append(a);



			thumb.append(progress);

			li.append(thumb);

			li.append(dl);



			that.form.find(".ag-file-item").append(li);


			return random;


		}


		return formFile;
	}



	/**
	 * 初始化表单数据-修改表单
	 *
	 */
	function initForm() {


		var param = util.getUrlParam();

		$(".ag-form").each(function(idx, agForm) {

			var formFile = createFile();

			formFile.loadForm(agForm);

			var condiCnt = 0;
			var dataUrl = $(agForm).attr("ag-data-url");

			$.each($(agForm).find("[ag-select-func]"),function(i,item){

				form.on("select("+$(item).attr("lay-filter")+")",function(data){

					window[$(item).attr("ag-select-func")].call(item,data);
				});

			});

			if (!util.isNull(dataUrl)) {

				for (var name in param) {

					var val = param[name];

					if (!util.isNull(val)) {
						$(agForm).find("input[name=" + name + "],select[name=" + name + "]").val(val);
						condiCnt++;
					}
				}

				var formParam = getFormJson($(agForm));
				//加载数据并补充初始化表单
				var url = ctx + "/" + util.getAgCtx($(agForm)) + dataUrl;

				util.loadShade();

				util.ajaxJson("",url,formParam,function(data){


						util.closeAll();

						/**
						 * 复选框
						 *
						 */
						var chkBoxDivArr = $(agForm).find(".ag-chkbox");
						if (chkBoxDivArr.length > 0) {
							var chkStr = "";
							$(chkBoxDivArr).each(function(idx, chkboxDiv) {

								var key = $(chkboxDiv).attr("ag-chkbox-name");
								var dataArr = data[key + "ChkBox"];
								$(dataArr).each(function(idxData, chkData) {
									var checked = 'checked=""';
									if (util.isNull(chkData.selected)) {
										checked = '';
									}
									var record = '<input type="checkbox" customVal="' + chkData.optCode + '" value="' + chkData.optCode +
										'" name="' + key + '" lay-skin="primary" title="' + chkData.optName + '" ' + checked + '>'
									chkStr = chkStr + record;
								});

								$(chkboxDiv).html(chkStr);
								form.render('checkbox');


							});



						}


						/**
						 * 附件
						 */
						if (formFile.form.find(".ag-file").length > 0) {

							var key = formFile.form.find(".ag-file").eq(0).attr("ag-file-key");

							if (!util.isNull(data[key]) && data[key].length > 0) {

								$.each(data[key], function(ind, file) {

									formFile.addIfile(file, formFile.form.find(".ag-file").eq(0));
								});
							}


						}


						for (var name in data) {

							var val = data[name];
							if (!util.isNull(val)) {
								$(agForm).find("input[name=" + name + "],textarea[name="+name+"]").val(val);
							}

							if (name.endWith("Opt")) {

								var optArr = data[name];

								optArr = util.isNull(optArr) ? [] : optArr;

								var selectStr = "";

								var selObj = $("select[name=" + name.substr(0, name.length - 3) + "]");
                
								if (selObj.attr("ag-select-default-val") == "true") {

									selectStr += "<option value=''>-请选择-</option>"
								}
							if(optArr!=null){
                var optBean = "";
								for (var i = 0; i < optArr.length; i++) {
								  var selectedStr = optArr[i].selected;
								  if (util.isNull(selectedStr)) {
                    selectedStr = "";
								  }
                  if(selObj.attr("ag-select-default-selected")=="true" 
                     &&optArr[i].optCode==selObj.attr("ag-select-default-key")){
                      optBean = "<option selected value='" + optArr[i].optCode + "' " + selectedStr + ">" + optArr[i].optName +
                      "</option>";
                      selectStr = selectStr + optBean;
                      continue;
                  }
                  optBean = "<option value='" + optArr[i].optCode + "' " + selectedStr + ">" + optArr[i].optName +
                    "</option>";
                  
								  selectStr = selectStr + optBean;
								}
							}



								$(selObj).html(selectStr);
								form.render('select');
							}

							if(name.endWith("Tree")){

								var treeObj = $("[name=" + name.substr(0, name.length - 4) + "]");


								treeObj.data("ag-tree-data",data[name]);


							}

						}

						//自定义插件入口
						var pluginName = $(agForm).attr("ag-plugin-name");

						if (!util.isNull(pluginName)) {
							//init参数根据需要在扩展
							customPlugins[pluginName].init(data);
						}

						var agCallBack = $(agForm).attr("ag-form-callBack");

						if (!util.isNull(agCallBack)) {

							util.call(agCallBack,data);
						}

				}) ;




				};




		});


		renderForm();


	}

	//渲染表单-date
	function renderForm() {
		var agDateArr = $(".ag-date");
		$(agDateArr).each(function(idx, input) {


			var opt = {
				elem: input,
				type: $(input).attr("ag-date-format")
			}
			laydate.render(opt);
		});

	}

	function initFormHeight(){

		//目前没有唯一标识判断 先根据查询按钮判断是不是查询页面
		//如果是查询页面则返回.
		if($(".ag-btn-query").length > 0 ){

			return;
		}


		$(".ag-form").css("overflow-y","auto");

		var ie = util.IEVersion();

		if(!isNaN(ie) && ie > 0  && ie < 10){

			$(".ag-form").css("height",$(window).height() - 140 +"px");

			return ;
		}

		$(".ag-form").css("height","calc( 100vh - 140px)");




	}




	function initListHeight() {

		var agTable = $(".ag-table");

		if (agTable.length == 0) {

			return;
		}

		var sibHeight = 0;

		//获取容器父级--父级所有兄弟节点
		var $query = agTable.parent().siblings(":visible").not("script").not("iframe").not(".datagrid-mask,.datagrid-mask-msg");



		for (var i = 0; i < $query.length; i++) {

			if (!$($query[i]).attr("class") || $($query[i]).attr("class").indexOf("layui-layer") != -1) {

				continue;
			}


			sibHeight += ($($query[i]).outerHeight() + util.getMarginHeight($query[i]));

		}



		sibHeight += util.getRealityOrderHeight(agTable.parent());

		var parentDiffHeight  = sibHeight;

		//获取容器兄弟节点高度
		$.each(agTable.siblings(":visible").not("script").not("iframe").not(".layui-form.layui-border-box.layui-table-view"),
			function(i, t) {

				sibHeight += ($(t).outerHeight() + util.getMarginHeight($(t)));
			});


		var ie = util.IEVersion();


		agTable.parent().attr("style", "");


		if(!isNaN(ie) && ie > 0  && ie < 10){

			agTable.parent().css('height',  $(window).height() - parentDiffHeight +"px");

			agTable.css('height', $(window).height() - sibHeight +"px");

			return ;
		}
		agTable.parent().css('height', 'calc( 100vh - ' + parentDiffHeight + 'px)');

		agTable.css('height', 'calc( 100vh - ' + sibHeight + 'px)');
	}


	function initAgZtree(){

		var id = $(this).attr("id");

		if(util.isNull(id)){

			id = util.getMSecond();

			$(this).attr("id",id);
		}

		var title = $(this).attr("ag-tree-title");

		if(util.isNull(title)){

			util.error("请设置ag-tree-title属性");

			return ;
		}

		util.openWin("/views/ztree/ztreeInit.html?id="+id,title,800,600);

	}

	/**
	 * 无title属性补丁
	 */
	function addTitle(){

		$.each($("[ag-win-title]:not([title])"),function(i,t){

			$(t).attr("title",$(t).attr("ag-win-title"));

		});

		$(".ag-btn-del:not([title])").attr("title","删除");
	}



	$(document).ready(function() {

		initBtnLsnr();

		initForm();

		initListHeight();

		initFormHeight();

		addTitle();

	});


});

/**
 * 列表链接,post请求
 *
 * @param {Object} url
 */
function _listHrefPost(opt){

	util.showDialog(opt["ag-win-title"], 3, _post,opt);

}



function _post(opt){

	var url = ctx+"/"+opt["ag-data-ctx"]+opt["ag-data-url"];

	util.ajaxJson("处理中...",url,{},function(data){

		if(data){

			if("0" == data.result){

				util.success(data.desc? data.desc:"成功");

				if(!util.isNull(opt["ag-data-refresh"]) && (opt["ag-data-refresh"] == true || opt["ag-data-refresh"] =="true") ){

					$(".ag-btn-query").click();
				}


			}else if( "1" ==  data.result){

				util.error(data.desc? data.desc:"失败");

			}

		}

	},"json");
}


function exportOrder(){
  var index = $(this).attr("ag-data-index");

  var url = $(this).attr("ag-data-url");
  var agCtx = util.getAgCtx(this);

  var opt ={
      "ag-data-url": ctx + "/" + agCtx + url,
      "ag-data-index":index
  }

  _listHrefDownloadFile(opt)

}

	/**
	 * 列表链接，下载文件
	 *
	 * @param {Object} url
	 */
function _listHrefDownloadFile(opt) {

		util.showDialog("确定下载文件么?", 3, "ret=_doRealDownLoad('" + opt["ag-data-url"] + "','"+opt["ag-data-index"]+"')");


}

function _doRealDownLoad(url,index) {

	if ($("[name=downloadHidenFr1").length == 0) {

		var iframe = $("<iframe name='downloadHidenFr1' class='layui-hide'></iframe>");

		iframe.appendTo('body');
	}

  url = util.addUrlToken(url);

	var form = $("<form></form>").attr("action", url).attr("method", "post");
  
  if(!util.isNull(index)){

    form = $(".ag-form[ag-data-index=" + index + "]").clone();
      
    form.attr("action", url).attr("method", "post");
  }
  var checkRet = checkForm.validateForm(form);

		if (!checkRet) {

			return false;
		}

  form[0].target = "downloadHidenFr1";

	form.appendTo('body').submit().remove();



}


function _listHrefWindow(opt) {


	var opts = {
		"winId": opt["ag-win-id"]
	}

	util.openWin(util.decode(opt["ag-data-url"]), opt["ag-win-title"], opt["ag-win-width"], opt["ag-win-height"],opts);
}


function _listHrefTab(opt) {


	util.addTab(opt["ag-data-url"], opt["ag-win-title"]);

}

 function showBigImage(e) {
    layer.open({
        type: 1,
        title: false,
        closeBtn: 1,
        shadeClose: true, //点击阴影关闭
        area: [$(e).width + 'px', $(e).height + 'px'], //宽高
        content: "<img src=" + $(e).attr('src') + " />"
    });
}
