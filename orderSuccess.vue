<template>
    <el-row justify="center" align="middle" type="flex" style="padding-bottom: 60px" class="contains">
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
            <div class="m-hd">

                <a class="goback" href="javascript:history.go(-1)"><i class="iconfont">&#xe613;</i></a>
                <div class="m-topBar ">
                    <span class="title">{{$t('orderSuccess.orderSuccessTitle')}}</span>
                </div>
            </div>
            <div class="explain">
                <p style="margin-bottom: 38px;" id="order_tips">{{$t('orderSuccess.orderSuccessTip')}}</p>
            </div>
            <div style="text-align: center;">
                <a @click="searchOrder" class="order_quality">{{$t('orderSuccess.orderSuccessSearch')}}</a>
            </div>
            <div class="m-orderItem">
                <div class="reminder_title"><i class="reminder_icon"></i>{{$t('orderSuccess.orderSuccessOtherTitle')}}</div>
                <div class="reminder">
                    {{$t('orderSuccess.orderSuccessOtherTip')}}
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    import  {IP} from '../config/config'
    import {getUrlParam} from '../utils/util'
    export default {
        name: "orderSuccess",
        data(){
          return {

          }
        },
        methods:{
            searchOrder(){
                let id = getUrlParam().id
                window.open(IP+'orderSearch.jsp'+(id?'?id='+id:''),'_self')
            }
        },
        mounted(){

        }
    }
</script>

<style>
@font-face {
    font-family: 'iconfont';  /* project id 876142 */
    src: url('//at.alicdn.com/t/font_876142_o76auf975op.eot');
    src: url('//at.alicdn.com/t/font_876142_o76auf975op.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_876142_o76auf975op.woff') format('woff'),
    url('//at.alicdn.com/t/font_876142_o76auf975op.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_876142_o76auf975op.svg#iconfont') format('svg');
}
.iconfont{
    font-family:"iconfont" !important;
    font-size:16px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;}
body{
    margin: 0;
    padding: 0;
}
.m-hd a{
    text-decoration: none;
}
 .m-hd{
     top: 0;
     left: 0;
     z-index: 5;
     width: 100%;
     height: auto;
     line-height: 22px;
     background: #fff;
 }
 .explain {
     padding: 16px;
     margin-top: 16px;
 }
.goback {
    display: block;
    float: left;
    height: 30px;
    width: 30px;
    /*background: url(./public/image/back.png)no-repeat center;*/
    background-size: 8px 14px;
    margin-top: 10px;
    font-size: 14px;
    color: #aaa;
    line-height: 2.2;
}
 .m-topBar {
     position: relative;
     padding: 0 16px;
     display: flex;
     display: -webkit-flex;
 }
 .explain p {
     text-align: center;
     color: #666;
     margin-top: 8px;
     line-height: 20px;
     word-break: break-all;
     font-size: 14px;
 }
 .m-orderItem {
     margin: 15px;
     padding: 17px 15px;
     font-size: 16px;
     color: #212121;
     border: 1px solid #eee;
 }
 .reminder_title {
     text-align: center;
     font-size: 12px;
     line-height: 16px;
     margin-bottom: 10px;
 }
 .reminder {
     font-size: 12px;
 }
 .title {
     width: 200px;
     font-size: 16px;
     text-align: center;
     padding: 12px 0px;
     overflow: hidden;
     white-space: nowrap;
     text-overflow: ellipsis;
     margin: auto;
 }
.order_quality {
    display: inline-block;
    width: 49%;
    font-size: 12px;
    background-color: #FF5A5F;
    color: #fff;
    line-height: 19px;
    padding: 12px 0;
    border-radius: 5px;
}
</style>