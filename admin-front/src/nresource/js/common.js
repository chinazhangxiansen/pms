/**
 * Created by wanje on 2017/8/24.
 */
$(function () {
    $(".wok-tab li").click(function(event) {
        /* Act on the event */
        $(this).addClass('on');
        $(this).siblings('li').removeClass('on');
    });
    $(".detal-tab li").click(function(event) {
        /* Act on the event */
        $(this).addClass('active');
        $(this).siblings('li').removeClass('active');
    });
    $(document).on("click",".doub-icon",function(){
        $(this).toggleClass('on');
    });
    $(".sig-cho").click(function(event) {
        /* Act on the event */
        $(this).addClass('on');
        $(this).siblings('div').removeClass('on');
    });
    $(".tog-icon2").click(function(event) {
        /* Act on the event */
        $(this).toggleClass('on');
        $(this).parent('div').siblings('div').toggleClass('hide');
    });
    $(".kud-tip").click(function(event) {
        /* Act on the event */
        $(this).toggleClass('on');
    });
    $(".tur-del").click(function(event) {
        /* Act on the event */
        $(this).parent(".tur-box").remove();
    });
    $(document).on("click",".list-del",function(){
        $(this).parent('td').parent('tr').remove();
    });
    $(document).on("click",".js_element",function(){
        dialog({
            id: 'dg_element',
            title: '规则编辑窗口',
            content: document.getElementById('js_element_box'),
            width: 800
        }).showModal();
    });
   $(document).on("click",".js_element2",function(){
        dialog({
            id: 'dg_element2',
            title: '主套餐选择',
            content: document.getElementById('js_element_box2'),
            width: 800
        }).showModal();
    });
   $(document).on("click",".js_element3",function(){
        dialog({
            id: 'dg_element3',
            title: '资源选择',
            content: document.getElementById('js_element_box3'),
            width: 800
        }).showModal();
    });
   $(document).on("click",".js_element4",function(){
        dialog({
        id: 'dg_element4',
        title: '资费信息选择',
        content: document.getElementById('js_element_box4'),
        width: 800
    }).showModal();
    });
   $(document).on("click","#add",function(){
        $('#each').tmpl().appendTo('#eachList');
    });
   $(document).on("click",".add2",function(){
        $('#each2').tmpl().appendTo('#eachList2');
    });
   $(document).on("click",".add3",function(){
        $('#each3').tmpl().appendTo('#eachList3');
    });
   $(document).on("click",".add4",function(){
        $('#each4').tmpl().appendTo('#eachList4');
    });
});