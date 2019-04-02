<template>
    <div>
        <iframe ref="templet" :src="frameSrc" style="height: 100vh;width: 100vw"/>
    </div>
</template>

<script>
    import {post, getRequest, getUrlParam} from '../utils/util'
    export default {
        name: "index",
        data(){
          return {
              adData:{},
              frameSrc:'',
              mounted:false,
          }
        },
        methods:{
            getId() {
                let _this = this
                return new Promise(function (resolve, reject) {
                    if (getUrlParam().id) {
                        resolve(getUrlParam().id)
                    } else {
                        if (location.pathname.slice(1)) {
                            post('url/getAdIdByUrl', {"url": location.pathname.slice(1)}).then(response => {
                                if (response && response.code == 'success') {
                                    resolve(response.data.id)
                                } else {
                                    reject('')
                                }
                            })
                        }
                    }

                }).catch(function (reason) {
                    console.log('catch:', reason);
                })
            },
            init() {
                this.getId().then(id => {
                    if (id) {
                        let url = this.qiniuDownLoadUrl + 'cod/content/' + (this.getStore('IP') ? this.getStore('IP').replace(/(.*\/\/)/, '') : location.hostname.replace(/(.*\/\/)/, '') + '/')
                        getRequest(url + id + '.txt').then(response => {
                            if (response) {
                                this.adData = response.data
                                this.adData.adId = id
                                document.title =  this.adData.adName;
                                this.frameSrc = location.origin+'/template'+(this.adData.template?this.adData.template:'')+'.jsp'
                                this.loadTemplate( this.adData)
                            }
                        })
                    }
                })
            },
            loadTemplate(data){
                if(!data) return
                if(!this.mounted ||!(this.$refs.templet.contentWindow&&this.$refs.templet.contentWindow.templet)){
                    setTimeout(()=>{
                        this.loadTemplate(data)
                    },50)
                }else{
                    this.$refs.templet.contentWindow.templet.init(data)
                }
            }
        },
        mounted(){
            this.mounted = true
        },
        created(){
            this.init()
        }
    }
</script>

<style>
    body{
        padding: 0;
        margin: 0;
        overflow: hidden;
    }
    iframe{
        border:unset;
    }
</style>