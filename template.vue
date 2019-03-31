<template>
	<div>
		<el-row justify="center" align="middle" type="flex" style="padding-bottom: 60px" class="contains">
			<el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
				<div v-if="step === 0">
					<div class="img_wrap">
						<img :src="adData.adImg" alt="">
					</div>
					<div class="dom-sales">
						<h2>{{adData.adName}}</h2>
						<div class="sales_wrap">
							<div class="sales">
								<div class="price">
									<ins>{{adData.currency}}{{adData.price}}</ins>
									<del v-if="adData.orig&&(Number(adData.orig)>Number(adData.price))" style="display: block">{{adData.currency}}{{adData.orig}}</del>
								</div>
								<div class="sales_info">
									<div>

									</div>
									<div class="sales_num">
										<!--8088 {{$t('t.sold')}}-->
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="module_title">
						<div style="font-weight: bold;font-size: 12px;border-bottom: 1px dashed #ddd;padding: 10px;">
							<span style="color: red;">{{$t('t.serviceTip')}}</span>
							<!--<span>{{$t('t.serviceTip1')}}</span>-->
						</div>
					</div>
					<div class="service-tips">
						<div class="service">
							<span></span>
						</div>
					</div>
					<div class="product_info">
						<h2>{{$t('t.productInfo')}}</h2>
						<div v-html="adData.productDetails"></div>
					</div>
					<div id="page-order">
						<h2>{{$t('t.orderInfo')}}</h2>
						<div class="bdbox" id="combo">
							<label class="bdxx"><em>*</em> {{$t('t.productSelect')}} </label>
							<div class="dxbox">
								<label v-if="adData.packages && !adData.packages.length" class="attr" @click="selectAttr('package',-1)" :class="{'selected':-1===productSelectAttr.package}">{{adData.adName}}</label>
								<label v-if="adData.packages && adData.packages.length" class="attr" v-for="item,key in adData.packages" @click="selectAttr('package',item.packageName)" :class="{'selected':item.packageName===productSelectAttr['package']}">
                                    {{item.packageName}}
                                </label>
							</div>
						</div>
						<div style="font-weight: bold;font-size: 12px;border-bottom: 1px dashed #ddd;padding: 10px;">
							<span style="color: red;">{{$t('t.serviceTip')}}</span>
							<!--<span>{{$t('t.serviceTip1')}}</span>-->
						</div>
						<div id="product_attr">
							<div class="item" v-if="!packageType">
								<div class="bdbox" v-for="attr,key in adData.attr">
									<label class="bdxx"><em>*</em>{{key}}</label>
									<div class="dxbox">
										<label class="attr" v-for="value in attr" :class="{'selected':value===productSelectAttr[key]}" @click="selectAttr(key,value)">{{value}}</label>
									</div>
								</div>
							</div>
							<div v-else>
								<div v-for="item,index in packageDetail" class="item">
									<div class="bdbox" v-for="attr,key in item.attr">
										<label class="bdxx"><em>*</em>{{key}}</label>
										<div class="dxbox">
											<label class="attr" v-for="value in attr" :class="{'selected':value===productSelectAttr[index?key+'['+index+']':key]}" @click="selectAttr(key,value,index)">{{value}}</label>
											<!--<label class="attr" v-for="value in attr" :class="{'selected':true}"  @click="selectAttr(key,value,index)">{{value}}</label>-->
										</div>
									</div>
								</div>
							</div>
						</div>
						<section class="form-layer-inline">
							<div class="bdbox" v-for="item,key in userInfo" v-if="key !=='verifyCode'">
								<label class="bdxx"><em v-if="!commonInfoNoRequired.includes(key)">*</em>{{$t('t.'+key)}}</label>
								<div class="textbox">
									<div v-if="commonInfo.includes(key)">
										<el-input :prop="key" v-model="userInfo[key]" :type="commonInfoTextArea.includes(key)?'textarea':'text'" :placeholder="$t('t.'+key+'Tip')"></el-input>
									</div>
									<div v-if="key === 'phoneNumber'">
										<div class="el-input el-input--small">
											<input prop="phoneNumber" type="number" v-model="showPhone" :placeholder="$t('t.phoneNumberTip')" @input="phoneChange();" class="el-input__inner">
										</div>
									</div>
									<div v-if="addressOption[key]">
										<el-select :placeholder="$t('t.'+key+'OptionTip')" :no-data-text="$t('t.'+key+'OptionNoDataTip')" @change="addressData(key)" :prop="key" v-model="userInfo[key]">
											<el-option v-for="item in addressOption[key]" :label="item" :value="item">
											</el-option>
										</el-select>
									</div>
									<div v-if="key === 'prices'">
										{{extras}}
									</div>
									<div v-if="key === 'productNumber'" class="m-selnum">
										<div class="textWrap">
											<input type="number" v-model="productNumber" @input="inputnumber();" :disabled="adData.packages && adData.packages.length">
										</div>
										<div style="float: right" v-if="adData.packages && !adData.packages.length">
											<div @click="minnumber()" class="less z-dis">-</div>
											<div @click="addnumber()" class="more">+</div>
										</div>
									</div>
								</div>
							</div>
							<div class="bdbox">
								<label class="bdxx"><em>*</em>{{$t('t.contactTime')}}</label>
								<div class="textbox">
									<el-time-select v-model="startTime" :picker-options="{
                                              start: '09:00',
                                              step: '00:30',
                                              end: '18:30'
                                            }">
									</el-time-select>
									<el-time-select v-model="endTime" :picker-options="{
                                              start: '09:00',
                                              step: '00:30',
                                              end: '20:00',
                                              minTime: startTime
                                            }">
									</el-time-select>
								</div>
							</div>
							<div class="bdbox">
								<label class="bdxx"><em>*</em>{{$t('t.payTypeLabel')}}</label>
								<div class="textbox">
									<label class="payment_type">
                                        <span class="huo">{{$t('t.COD')}}</span>
                                    </label>
									<div class="huo_info">{{$t('t.CODTip')}}</div>
								</div>
							</div>
						</section>
						<div class="note_text">
							{{$t('orderSuccess.orderSuccessOtherTip')}}
						</div>
					</div>
				</div>
				<div v-else>
					<div class="confirmTitle">
						<span>{{$t('t.buyConfirm')}}</span>
					</div>
					<section class="form-layer-inline confirm">
						<div class="bdbox" v-for="item,key in userInfo" v-if="key !=='verifyCode'">
							<label class="bdxx"><em v-if="!commonInfoNoRequired.includes(key)">*</em>{{$t('t.'+key)}}</label>
							<div class="textbox">
								<div v-if="!noConfirm.includes(key)">
									{{userInfo[key]}}
								</div>
							</div>
						</div>
						<div class="bdbox">
							<label class="bdxx"><em>*</em>{{$t('t.payTypeLabel')}}</label>
							<div class="textbox">
								<label class="payment_type">
                                    <span class="huo">{{$t('t.COD')}}</span>
                                </label>
							</div>
						</div>
					</section>
				</div>
			</el-col>
		</el-row>
		<el-row justify="center" align="middle" type="flex" style="position: fixed;bottom: -2px;width: 100%">
			<el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
				<footer>
					<span v-if="step === 0">
                        <div  class="toTop" @click="handleScrollTop">top</div>
                        <div  class="inquiry">
                            <span>{{$t('t.orderSearch')}}</span>
	</div>
	<div class="buy_now" @click="buyNow">
		<span>{{$t('t.buyNow')}}</span>
	</div>
	</span>
	<span v-else>
                        <div  class="toTop" @click="step = 0">back</div>
                        <div  class="buy_now" @click="confirmBuy">
                            <span>{{$t('t.buyConfirm')}}</span>
	</div>
	</span>
	</footer>
	</el-col>
	</el-row>
	</div>
</template>

<script>
	import { post, formProductAttr, fbTrace, getUrlParam, getRequest } from '../../utils/util'
	import { IP } from '../../config/config'
	import '../../utils/lazyload'
	export default {
		name: "singlePage",
		data() {
			return {
				adData: {},
				productSelectAttr: {},
				productNumber: 1,
				selectNumClone: 1,
				step: 0,
				addressOption: {
					province: [],
					city: [],
					area: [],
				},
				commonInfo: ['userName', 'userNotes', 'zipCode', 'addressDetail'],
				commonInfoTextArea: ['userNotes', 'addressDetail'],
				commonInfoNoRequired: ['zipCode', 'userNotes'],
				noConfirm: ['verifyCode'],
				showPhone: '',
				userInfo: {
					prices: '',
					productNumber: '',
					userName: '',
					phoneNumber: '',
					province: '',
					city: '',
					area: '',
					addressDetail: '',
					zipCode: '',
					userNotes: '',
					verifyCode: '',
				},
				packageType: false,
				packageDetail: [],
				startTime: '9:00',
				endTime: '20:00',
				maxNum: '',
				rate: 0
			}
		},
		methods: {

			getId() {
				let _this = this
				return new Promise(function(resolve, reject) {
					//	              	resolve(251)
					if(getUrlParam().id) {
						resolve(getUrlParam().id)
					} else {
						if(location.pathname.slice(1)) {
							post('url/getAdIdByUrl', {
								"url": location.pathname.slice(1)
							}).then(response => {
								if(response && response.code == 'success') {
									resolve(response.data.id)
								} else {
									reject('')
								}
							})
						}
					}

				}).catch(function(reason) {
					console.log('catch:', reason);
				})
			},
			selectFirstAttr(index) {
				if(this.adData.packages[index].packageDetail != null && this.adData.packages[index].packageDetail[0].attr != null) {
					for(var i = 0; i < this.adData.packages[index].packageDetail[0].count; i++) {
						for(var attrName in this.adData.packages[index].packageDetail[0].attr) {
							var attrName1;
							var valueAttr = this.adData.packages[index].packageDetail[0].attr[attrName].toString();
							if(i > 0) {
								attrName1 = attrName + "[" + i.toString() + "]";
							}
							this.selectAttr(attrName, valueAttr, 0);
						}
					}

				}
			},
			getData() {
				this.getId().then(id => {
					if(id) {
						//                  let url = this.qiniuDownLoadUrl + 'cod/content/' + (this.getStore('IP') ? this.getStore('IP').replace(/(.*\/\/)/, '') : location.hostname.replace(/(.*\/\/)/, '') + '/')
						let url = this.qiniuDownLoadUrl + "cod/content/" + "www.qrcstore.com/";
						getRequest(url + id + '.txt').then(response => {
							if(response && response.data) {
								this.adData = response.data
								this.adData.adId = id
								document.title = this.adData.adName;
								this.init(this.adData)
							}
						})
					}
				})
			},
			loadTemplate(data) {
				if(!data) return
				if(!this.mounted || !(this.$refs.templet.contentWindow && this.$refs.templet.contentWindow.templet)) {
					setTimeout(() => {
						this.loadTemplate(data)
					}, 50)
				} else {
					this.$refs.templet.contentWindow.templet.init(data)
				}
			},
			init(data) {
				if(!data) {
					this.getData()
				}
				if(data) {
					this.adData = data
					for(let k of Object.keys(this.adData.attr)) {
						this.productSelectAttr[k] = ''
					}
					this.adData.fbId && fbTrace(this.adData.fbId)
					this.productSelectAttr.package = -1
					this.maxNum = this.adData.maxNum
					if(Array.isArray(this.adData.packages)) {

						this.adData.packages.forEach((v) => {
							v.packageDetail.forEach(detail => {
								detail.attr = formProductAttr(detail.attr)
							})
							let packageDetail = []
							v.packageDetail.forEach(detail => {
								for(let count = 0; count < detail.count; count++) {
									packageDetail.push(detail)
								}
							})
							v.packageDetail = packageDetail

						})
						if(this.adData.packages.length > 1) {
							this.selectAttr('package', this.adData.packages[0].packageName)
						}

						//this.selectFirstAttr(0)
                key = index ? key + '[' + index + ']' : key
                this.productSelectAttr = Object.assign({}, this.productSelectAttr, {[key]: value})
            },
            orderDetail(str){
                let attr = {}
                if(!str) return {}
                if(typeof str === 'string'){
                    str = JSON.parse(str)
                }
                for(let [key,item] of Object.entries(str)){
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
            handleScrollTop(){
                window.scrollTo(0,0)
            },
            minnumber(){
                if(this.productNumber === 1){
                    return;
                }
                this.productNumber --;
                this.selectNumClone --;
            },
            inputnumber(){
                if(/[^0-9]+/.test(this.productNumber)){
                    this.productNumber = this.selectNumClone
                }else{
                    this.selectNumClone = this.productNumber
                }
            },
            addnumber(){
                if(this.maxNum && this.productNumber == this.maxNum){
                    return
                }
                this.productNumber ++;
                this.selectNumClone ++;
            },
            buyNow(){
				window.userId = new Date().getTime();
                    post('order/recordUserAgent', [{
                                        msg:'用户第一次点击下单按钮',
                                        appName: window.navigator.appName,
                                        appCodeName: window.navigator.appCodeName,
                                        appVersion: window.navigator.appVersion,
                                        userAgent: window.navigator.userAgent
                                        }]);
                if(!this.preBuyCheck()){
					document.querySelector('#page-order').scrollIntoView()
					post('order/recordUserAgent', [{
					msg:'号码检查不通过',
					id:window.userId,
                                       appName: window.navigator.appName,
                                       appCodeName: window.navigator.appCodeName,
                                       appVersion: window.navigator.appVersion,
                                       userAgent: window.navigator.userAgent
                                           }]);
                    return;
                }
                if(!this.confirmAddOrderCheck()){
					document.querySelector('.form-layer-inline').scrollIntoView()
					post('order/recordUserAgent', [{
					msg:'必填项不完整',
					id:window.userId,
                                       appName: window.navigator.appName,
                                       appCodeName: window.navigator.appCodeName,
                                       appVersion: window.navigator.appVersion,
                                       userAgent: window.navigator.userAgent
                                           }]);
                    return;
                }
                this.step = 1
                post('order/recordUserAgent', [{
					msg:'用户跳转到确认下单界面',
					id:window.userId,
                                       appName: window.navigator.appName,
                                       appCodeName: window.navigator.appCodeName,
                                       appVersion: window.navigator.appVersion,
                                       userAgent: window.navigator.userAgent
                                           }]);
            },
            confirmBuy(){
//       	var flay=this.$data.adData.switch;
         	var flay=""+this.adData.switch
            	if(flay=="true"){
            		  this.codeRequest();
            	}else{
            		this.addOrder();
            	}
            },
            addOrder(){
                let params = {},USD = this.extras/this.rate
                let orderDetail = JSON.parse(JSON.stringify(this.productSelectAttr))
                if(!USD){
                    USD=0.0;
                }else{
                    USD=USD.toFixed(6);
                }
                delete orderDetail.package
                params = Object.assign(params,this.userInfo,
                    {   adId:this.adData.adId,
                        productId:this.adData.productId,
                        productNumber:this.productNumber,
                        contactTime:this.startTime+'-'+this.endTime,
                        packageName:this.productSelectAttr.package&&this.productSelectAttr.package!==-1?this.productSelectAttr.package:null,
                        orderDetail:JSON.stringify(orderDetail)})
             try{
				 post('order/recordUserAgent', [{
					msg:'发送确认订单请求',
					id:window.userId,
                                       appName: window.navigator.appName,
                                       appCodeName: window.navigator.appCodeName,
                                       appVersion: window.navigator.appVersion,
                                       userAgent: window.navigator.userAgent
                                           }]);
                post('order/addOrders',[params]).then(response=>{
                    if(response && response.code === 'success'){
                        this.$message.success(this.$t('t.buySuccess'))
                         fbq('track','Purchase',{
                                     value:USD,
                                     currency:'USD'
                                      })
                                     fbq('track','InitiateCheckout')
                        post('order/recordUserAgent', [{
												msg:'fbq调用成功',
												id:window.userId,
                                                appName: window.navigator.appName,
                                                appCodeName: window.navigator.appCodeName,
                                                appVersion: window.navigator.appVersion,
                                                userAgent: window.navigator.userAgent
                                                    }]);
                        window.open(IP+'orderSuccess.jsp?'+'id='+response.data.id,'_self')
                    }
                    else {
                        if(response && response.code == '0006'){
                            this.$message.error(this.$t('t.repeatOrder'))
                        }else{
                            this.$message.error(this.$t('t.buyError'))
                        }
                    }
                }).catch((e)=>{
                     post('order/recordUserAgent', [{
												msg:'下单promise逻辑出错'+JSON.stringify(e),
												id:window.userId,
                                                appName: window.navigator.appName,
                                                appCodeName: window.navigator.appCodeName,
                                                appVersion: window.navigator.appVersion,
                                                userAgent: window.navigator.userAgent
                                                    }]);
                 })
            }catch(e){
                 post('order/recordUserAgent', [{
												msg:'下单逻辑出错'+JSON.stringify(e),
												id:window.userId,
                                                appName: window.navigator.appName,
                                                appCodeName: window.navigator.appCodeName,
                                                appVersion: window.navigator.appVersion,
                                                userAgent: window.navigator.userAgent
                                                    }])
                 }
            },
            initRate(){
                let createScript = (url,callback)=>{
                    let new_element = document.createElement("script");//创建新的script节点
                    new_element.setAttribute("type", "text/javascript");
                    new_element.setAttribute("src", url);
                    if (new_element.addEventListener) {
                        new_element.addEventListener('load', function () {
                            callback();
                         }, false);
                    } else if (new_element.attachEvent) {
                        new_element.attachEvent('onreadystatechange', function () {
                            let target = window.event.srcElement;
                            if (target.readyState == 'loaded') {
                                callback();
                            }
                        });
                    }
                    (document.body).appendChild(new_element);//添加到body节点的末尾
                };
                window.op_aladdin_callback = (v)=>{
                    if(v&&v.data[0]){
                        this.rate =Number(v.data[0].number2)
                    }
                }
            },
                key = index ? key + '[' + index + ']' : key
                this.productSelectAttr = Object.assign({}, this.productSelectAttr, {[key]: value})
            },
            orderDetail(str){
                let attr = {}
                if(!str) return {}
                if(typeof str === 'string'){
                    str = JSON.parse(str)
                }
                for(let [key,item] of Object.entries(str)){
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
            handleScrollTop(){
                window.scrollTo(0,0)
            },
            minnumber(){
                if(this.productNumber === 1){
                    return;
                }
                this.productNumber --;
                this.selectNumClone --;
            },
            inputnumber(){
                if(/[^0-9]+/.test(this.productNumber)){
                    this.productNumber = this.selectNumClone
                }else{
                    this.selectNumClone = this.productNumber
                }
            },
            addnumber(){
                if(this.maxNum && this.productNumber == this.maxNum){
                    return
                }
                this.productNumber ++;
                this.selectNumClone ++;
            },
            buyNow(){
                if(!this.preBuyCheck()){
                    document.querySelector('#page-order').scrollIntoView()
                    return;
                }
                if(!this.confirmAddOrderCheck()){
                    document.querySelector('.form-layer-inline').scrollIntoView()
                    return;
                }
                this.step = 1
            },
            confirmBuy(){
//       	var flay=this.$data.adData.switch;
         	var flay=""+this.adData.switch
            	if(flay=="true"){
            		  this.codeRequest();
            	}else{
            		this.addOrder();
            	}
              
            },
            addOrder(){
                let params = {},USD = this.extras/this.rate
                let orderDetail = JSON.parse(JSON.stringify(this.productSelectAttr))
                delete orderDetail.package
                params = Object.assign(params,this.userInfo,
                    {   adId:this.adData.adId,
                        productId:this.adData.productId,
                        productNumber:this.productNumber,
                        contactTime:this.startTime+'-'+this.endTime,
                        packageName:this.productSelectAttr.package&&this.productSelectAttr.package!==-1?this.productSelectAttr.package:null,
                        orderDetail:JSON.stringify(orderDetail)})
                post('order/addOrders',[params]).then(response=>{
                    if(response && response.code === 'success'){
                        this.$message.success(this.$t('t.buySuccess'))
                        fbq('track','Purchase',{
                            value:USD,
                            currency:'USD'
                        })
                        fbq('track','InitiateCheckout')
                        window.open(IP+'orderSuccess.jsp?'+'id='+response.data.id,'_self')
                    }
                    else {
                        if(response && response.code == '0006'){
                            this.$message.error(this.$t('t.repeatOrder'))
                        }else{
                            this.$message.error(this.$t('t.buyError'))
                        }
                    }
                })
            },
            initRate(){
                let createScript = (url,callback)=>{
                    let new_element = document.createElement("script");//创建新的script节点
                    new_element.setAttribute("type", "text/javascript");
                    new_element.setAttribute("src", url);
                    if (new_element.addEventListener) {
                        new_element.addEventListener('load', function () {
                            callback();
                        }, false);
                    } else if (new_element.attachEvent) {
                        new_element.attachEvent('onreadystatechange', function () {
                            let target = window.event.srcElement;
                            if (target.readyState == 'loaded') {
                                callback();
                            }
                        });
                    }
                    (document.body).appendChild(new_element);//添加到body节点的末尾
                };
                window.op_aladdin_callback = (v)=>{
                    if(v&&v.data[0]){
                        this.rate =Number(v.data[0].number2)
                    }
                }
            },					
	    }
					document.title = this.adData.adName
					setTimeout(() => {
						window.lazyload('', {
							selector: '[_src]'
						})
					}, 200)
					this.addressData()
				}
			},
			addressData(key) {
				let params = {}
				if(key === 'province') {
					params.province = this.userInfo.province
				} else if(key === 'city') {
					params.city = this.userInfo.city
				} else if(key === 'area') {
					params.province = this.userInfo.province
					params.city = this.userInfo.city
					params.area = this.userInfo.area
					// return
				}
				post('http://www.qrcstore.com/location/getLocations', params).then(response => {
					//       	post('location/getLocations',params).then(response=>{
					if(response && response.code === 'success') {
						if(key === 'province') {
							this.addressOption.city = response.data
							this.addressOption.area = []
							this.userInfo.city = ''
							this.userInfo.area = ''
						} else if(key === 'city') {
							this.addressOption.area = response.data
							this.userInfo.area = ''
						} else if(key === 'area') {
							if(response.data) {
								this.userInfo.zipCode = response.data[0]
							} else {
								this.userInfo.zipCode = ''
							}
						} else if(!key) {
							this.addressOption.province = response.data
						}
					}
				})
			},
			selectAttr(key, value, index) {
				//debugger
				//          	console.log("haos1:",key,value,index)
				if(key === 'package' && (this.productSelectAttr.package || value != -1)) {
					if(value == this.productSelectAttr.package) return;
					this.productSelectAttr = Object.assign({}, {})

					if(value == -1) {
						this.packageType = false;

						for(let k of Object.keys(this.adData.attr)) {
							this.productSelectAttr[k] = ''
						}
					} else {
						this.packageType = true;
						this.adData.packages.forEach((v, i) => {
							if(v.packageName === value) {
								this.packageDetail = v.packageDetail
								for(var indexA = 0; indexA < v.packageDetail.length; indexA++) {
									var atr = v.packageDetail[indexA].attr;
									var keyatrA = "";
									var valatrA = "";
									for(var k = 0; k < Object.keys(atr).length; k++) {
										console.log("haos:", Object.keys(atr)[k], atr[Object.keys(atr)[k]][0], k)
										keyatrA = Object.keys(atr)[k];
										valatrA = atr[Object.keys(atr)[k]][0];
										/*let key = indexA ? k + '[' + indexA + ']' : k
										this.productSelectAttr[key] = v.packageDetail[indexA].attr[k];
										this.productSelectAttr = Object.assign({}, this.productSelectAttr)*/
										//                                     console.log("haos:",keyatrA,valatrA,indexA)
										this.selectAttr(keyatrA, valatrA, indexA);
									}
								}
							}
						})
					}
				}

				key = index ? key + '[' + index + ']' : key
				this.productSelectAttr = Object.assign({}, this.productSelectAttr, {
					[key]: value
				})
			},
			orderDetail(str) {
				let attr = {}
				if(!str) return {}
				if(typeof str === 'string') {
					str = JSON.parse(str)
				}
				for(let [key, item] of Object.entries(str)) {
					if(key === 'package') continue
					let unique = /(.*?[)(\d*)(])/.test(key) ? key.replace(/(.*?[\[])(\d*)([\]])/, '$2') : 0
					if(attr[unique]) {
						attr[unique].push(item)
					} else {
						attr[unique] = [item]
					}
				}
				return attr
			},
			handleScrollTop() {
				window.scrollTo(0, 0)
			},
			minnumber() {
				if(this.productNumber === 1) {
					return;
				}
				this.productNumber--;
				this.selectNumClone--;
			},
			inputnumber() {
				if(/[^0-9]+/.test(this.productNumber)) {
					this.productNumber = this.selectNumClone
				} else {
					this.selectNumClone = this.productNumber
				}
			},
			addnumber() {
				if(this.maxNum && this.productNumber == this.maxNum) {
					return
				}
				this.productNumber++;
				this.selectNumClone++;
			},
			buyNow() {
				if(!this.preBuyCheck()) {
					document.querySelector('#page-order').scrollIntoView()
					return;
				}
				if(!this.confirmAddOrderCheck()) {
					document.querySelector('.form-layer-inline').scrollIntoView()
					return;
				}
				this.step = 1
			},
			confirmBuy() {
				//       	var flay=this.$data.adData.switch;
				var flay = "" + this.adData.switch
				if(flay == "true") {
					this.codeRequest();
				} else {
					this.addOrder();
				}

			},
			addOrder() {
				let params = {},
					USD = this.extras / this.rate
				let orderDetail = JSON.parse(JSON.stringify(this.productSelectAttr))
				if(!USD) {
					USD = 0.0;
				}else{
					USD=USD.toFixed(6)
				}
				fbq('track', 'Purchase', {
					value: USD,
					currency: 'USD'
				})
				fbq('track', 'InitiateCheckout')
				delete orderDetail.package
				params = Object.assign(params, this.userInfo, {
					adId: this.adData.adId,
					productId: this.adData.productId,
					productNumber: this.productNumber,
					contactTime: this.startTime + '-' + this.endTime,
					packageName: this.productSelectAttr.package && this.productSelectAttr.package !== -1 ? this.productSelectAttr.package : null,
					orderDetail: JSON.stringify(orderDetail)
				})
				post('order/addOrders', [params]).then(response => {
					if(response && response.code === 'success') {
						this.$message.success(this.$t('t.buySuccess'))
						window.open(IP + 'orderSuccess.jsp?' + 'id=' + response.data.id, '_self')
					} else {
						if(response && response.code == '0006') {
							this.$message.error(this.$t('t.repeatOrder'))
						} else {
							this.$message.error(this.$t('t.buyError'))
						}
					}
				})
			},
			initRate() {
				let createScript = (url, callback) => {
					let new_element = document.createElement("script"); //创建新的script节点
					new_element.setAttribute("type", "text/javascript");
					new_element.setAttribute("src", url);
					if(new_element.addEventListener) {
						new_element.addEventListener('load', function() {
							callback();
						}, false);
					} else if(new_element.attachEvent) {
						new_element.attachEvent('onreadystatechange', function() {
							let target = window.event.srcElement;
							if(target.readyState == 'loaded') {
								callback();
							}
						});
					}
					(document.body).appendChild(new_element); //添加到body节点的末尾
				};
				window.op_aladdin_callback = (v) => {
					if(v && v.data[0]) {
						this.rate = Number(v.data[0].number2)
					}
				}
				createScript('https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query=1%E7%BE%8E%E5%85%83%E7%AD%89%E4%BA%8E%E5%A4%9A%E5%B0%91%E5%8D%B0%E5%B0%BC%E5%8D%A2%E6%AF%94&co=&resource_id=6017&t=1540990915057&cardId=6017&ie=utf8&oe=gbk&cb=op_aladdin_callback&format=json&tn=baidu', () => {})
			},

			preBuyCheck() {
				let valid = true;
				for(let i of Object.values(this.productSelectAttr)) {
					if(i === '') {
						valid = false;
						this.$message.warning(this.$t('t.selectProductAttrTip'))
						return valid;
					}
				}
				return valid;
			},
			confirmAddOrderCheck() {
				this.phoneCheck()
				let valid = true;
				let required = ['province', 'city', 'area', 'addressDetail', 'phoneNumber', 'userName']
				for(let [k, v] of Object.entries(this.userInfo)) {
					if(required.includes(k) && v === '') {
						valid = false
						this.setError(k)
					} else {
						this.setError(k, true)
					}
				}
				return valid
			},
			setError(key, del) {
				let selector = '[prop=' + key + ']'
				let dom = document.querySelector(selector + ' input') || document.querySelector(selector)
				if(!dom) {
					return
				}
				if(del) {
					dom.classList.remove('is-error')
				} else {
					dom.classList.add('is-error')
				}
			},
			phoneCheck() {
				let re = /(^['062','62','08','8','1'][0-9]{8,15})/
				if(re.test(this.showPhone)) {
					this.userInfo.phoneNumber = this.showPhone
				} else {
					return ''
				}
			},
			phoneChange() {
				if(!/(^[0-9]+[0-9]*$)/.test(this.showPhone)) {
					this.showPhone = this.showPhone.substring(0, this.showPhone.length - 1)
				}
			},
			codeRequest() {
				let params = {
					phoneNumber: this.userInfo.phoneNumber
				}
				post('verify/sendVerify', params).then(response => {
					if(response && response.code === 'success') {
						// this.codeCheck()
					}
				})
				this.codeCheck()
			},
			codeCheck() {
				const h = this.$createElement;
				let _this = this
				let code = []
				const codeV = (e, index) => {
					if(/([^0-9])/.test(e.target.value)) {
						e.target.value = code[index] || ''
						return
					}
					code[index] = e.target.value
					index < 3 && e.target.nextSibling.focus()
				}
				this.$msgbox.prompt('', _this.$t('t.identifyingCode'), {
					confirmButtonText: _this.$t('t.confirm'),
					showCancelButton: false,
					center: true,
					showInput: false,
					closeOnClickModal: false,
					message: h('p', {
						class: ['code']
					}, [
						h('input', {
							style: '',
							attrs: {
								maxlength: 1,
							},
							domProps: {
								value: code[0]
							},
							on: {
								input: function(e) {
									codeV(e, 0)
								}
							}
						}),
						h('input', {
							style: '',
							attrs: {
								maxlength: 1,
							},
							domProps: {
								value: code[1]
							},
							on: {
								input: function(e) {
									codeV(e, 1)
								}
							}
						}),
						h('input', {
							style: '',
							attrs: {
								maxlength: 1,
							},
							domProps: {
								value: code[2]
							},
							on: {
								input: function(e) {
									codeV(e, 2)
								}
							}
						}),
						h('input', {
							style: '',
							attrs: {
								maxlength: 1,
							},
							domProps: {
								value: code[3]
							},
							on: {
								input: function(e) {
									codeV(e, 3)
								}
							}
						}),
					]),
				}).then((action, instance) => {
					this.userInfo.verifyCode = code.join('')
					this.addOrder()
				}).catch(() => {
					this.addOrder()
				});
			},
		},
		created() {
			window.templet = this

			this.initRate()
		},
		mounted() {
			this.getData()
		},
		computed: {
			extras() {
				if(!this.adData || !this.adData.packages) {
					return 0
				}
				this.userInfo.prices = this.productNumber * ((this.productSelectAttr.package && this.productSelectAttr.package !== -1) ? this.adData.packages.filter(v => {
					return v.packageName === this.productSelectAttr.package
				})[0].price : this.adData.price)
				return this.productNumber * ((this.productSelectAttr.package && this.productSelectAttr.package !== -1) ? this.adData.packages.filter(v => {
					return v.packageName === this.productSelectAttr.package
				})[0].price : this.adData.price)
			}
		},
		watch: {
			productNumber: {
				immediate: true,
				handler: function(v, o) {
					//执行代码
					this.userInfo.productNumber = v
				}
			}
		}
	}
</script>

<style>
	@import "../../assert/css/singlePage.css";
</style>