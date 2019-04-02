<template>
    <div>
        <el-row justify="center" align="middle" type="flex" style="padding-bottom: 60px">
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                <div class="content"   v-loading.fullscreen.lock="fullscreenLoading">

                    <div class="headerTop">

                        <a class="goback" href="javascript:history.go(-1)">
                            <span class="icon-arrow-left"></span>
                        </a>
                        <div class="title">{{$t('search.orderTitle')}}</div>
                    </div>
                    <div class="prompt">{{$t('search.orderTitleTip')}}</div>
                    <div style="overflow: hidden;margin-top: 15px">
                        <div class="el-input el-input--small selectOrder">
                            <input  prop="phoneNumber" type="number" v-model="searchValue" :placeholder="searchType ? $t('t.phoneNumberTip'):$t('search.searchOrderTip')" @input="phoneChange();"
                                    class="el-input__inner">
                            <el-select v-model="searchType" >
                                <el-option
                                        v-for="item in searchTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <el-button  icon="el-icon-search" class="searchButton"  type="danger" @click="searchOrder"></el-button>
                    <div v-if="dataNull" class="data_null">
                        {{$t('search.dataNull')}}
                    </div>
                    <div v-for="order in orderList" class="orderInfo">
                        <div class="orderInfoDetail">

                            <div class="item-info">
                                <span v-if="!order.packageName">{{order.adName}}</span>
                                <span v-else>{{order.packageName}}</span>
                                <span class="item-attr" v-for="item,key in orderDetail(order.orderDetail)">
                                    <span v-for="attr in item" style="padding-right:5px">{{attr}}</span>
                                </span>
                            </div>
                            <div style="text-align: right">
                                <div style="font-size: 14px;line-height: 21px">
                                    <span>
                                       {{order.price/order.productNumber}}
                                    </span>
                                </div>
                                <span  class="productNumber">
                                      x{{order.productNumber}}
                                </span>
                            </div>

                        </div>
                        <div style="border-top:1px dashed #aaa;font-family: serif;padding-top: 5px;text-align: start">
                            {{$t('search.orderState'+order.orderState)}}

                            <div class="searchPrice">
                                <span class="priceTitle">{{$t('search.total')}}</span>
                                <span>{{order.price}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>

</template>

<script>
    import {post,getUrlParam} from '../utils/util'
    export default {
        name: "orderSearch",
        data(){
          return {
              searchValue:'',
              orderList:[],
              fullscreenLoading:false,
              searchType:0,
              searchTypeOptions:[{
                  label:this.$t('search.searchOrder'),
                  value:0,
              },{
                  label:this.$t('search.searchPhone'),
                  value:1,
              },],
              dataNull:false
          }
        },
        methods:{
            phoneChange(){
                if(!/(^[0-9]+[0-9]*$)/.test(this.searchValue)){
                    this.searchValue=this.searchValue.substring(0,this.searchValue.length-1)
                }
            },
            searchOrder(){
                this.fullscreenLoading = true
                let params = {
                    currentPage: 1,
                    pageSize: 10
                }
                if(this.searchType){
                    params.phone=this.searchValue
                }else {
                    params.orderId=this.searchValue
                }
                post('order/getOrders',params).then(response=>{
                    if(response && response.code === 'success'){
                        if(!response.data || response.data.length === 0){
                            this.dataNull = true
                            this.orderList = []
                        }else{
                            this.orderList = response.data
                            this.dataNull = false
                        }
                    }else{
                        this.orderList = []
                        this.$message.warning(this.$t('search.searchOrderError'))
                        this.dataNull = true
                    }
                }).finally(()=>{
                    this.fullscreenLoading = false
                })
            },
            orderDetail(str){
                let attr = {}
                if(!str) return {}
                for(let [key,item] of Object.entries(JSON.parse(str))){
                    if(key === 'package') continue
                    let unique = /(.*?[)(\d*)(])/.test(key)?key.replace(/(.*?[\[])(\d*)([\]])/,'$2'):0
                    if(attr[unique]){
                        attr[unique].push(item)
                    }else{
                        attr[unique] = [item]
                    }
                }
                return attr
            },
        },
        mounted(){
            if(getUrlParam().id){
                this.searchType = 0;
                this.searchValue = getUrlParam().id;
                this.searchOrder()
            }
        }
    }
</script>

<style scoped>
    .content{
        width: calc(100% - 30px);
        max-width: 640px;
        margin: auto;
        padding: 15px;
    }
    .headerTop{
        margin: 0;
        height: 45px;
        line-height: 45px;
        color: #212121;
    }
    .title{
        font-size: 20px;
        color: #222;
        text-align: center;
        font-weight: 500;
        padding-right: 24px;
    }
    .prompt {
        text-align: center;
        font-size: 12px;
        color: #666;
        padding-top: 30px;
    }
    .data_null{
        padding: 16px;
        font-size: 12px;
        background-color: #f6f6f6;
        color: #666;
        clear: both;
        margin-top: 20px;
    }
    .searchPrice{
        float: right;
    }

    .productNameSearch >span{
        font-family: serif;
    }
    .productNumber{
        text-align: right;
        display: block;
        font-size: 12px;
    }
    .priceTitle{
        font-size: 12px;
        padding-right: 5px;
        color:#aaa
    }
    .orderInfo{
        min-height: 60px;
        border:1px solid #aaa;
        border-radius: 4px;
        margin-top:20px;
        clear: both;
        padding: .13333rem .32rem;
        box-sizing: border-box;
    }
    .orderInfoDetail{
        display: -webkit-box;
        display: -moz-box;
        display: -ms-box;
        display: -o-box;
        display: box;
        padding-bottom: 10px;
    }
    .item-info{
        -webkit-box-flex: 1;
        -ms-box-flex: 1;
        -o-box-flex: 1;
        box-flex: 1;
        text-align: start;
        padding-right: 20px;
        word-break: break-all;
    }
    .item-attr{
        display: block;
        padding-top: 5px;
        font-size: 13px;
        color: #aaa;
    }
    .goback{
        float: left;
        left:10px;
        color: #aaa;
        font-size: 24px;
        background-size: 14px;
        background-position: left;
        z-index: 9;
        text-decoration:unset;
    }
    .selectOrder{
        float: left;
        display: flex;
    }
    .searchButton{
        width: 100%;
        margin-top: 20px;
    }
</style>