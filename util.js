import  {IP} from '../config/config'
import axios from 'axios';
let baseUrl = IP
let base = '';

export const post = (url, data,type) =>{
    return new Promise(function(resolve, reject) {
        let xhr = null
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.open('post', (!type?baseUrl:'')+url, true);
        xhr.setRequestHeader('cache-control', 'no-cache')
        xhr.onreadystatechange = function () { // 状态发生变化时，函数被回调
            if (xhr.readyState === 4) { // 成功完成
                // 判断响应结果:
                if (xhr.status === 200) {
                    // 成功，通过responseText拿到响应的文本:
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    // 失败，根据响应码判断失败原因:
                    reject(xhr.status);
                }
            }
        }

        xhr.setRequestHeader("Content-type",'application/json');
        xhr.send(JSON.stringify(data));

    }).catch(function(reason) {
        console.log('catch:', reason);
    })
}

export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: params,
        headers: {
            'cache-control': 'no-cache'
        }
    });
};

export const getUrlParam = ()=> {
    let url = location.search; //获取url中"?"符后的字串
    let theRequest = new Object();
    if (url.indexOf("?") != -1) {
        let str = url.substr(1);
        str = str.split("&");
        for (let i = 0; i < str.length; i++) {
            theRequest[str[i].split("=")[0]] = unescape(str[i].split("=")[1]);
        }
    }
    return theRequest;
}
export const formProductAttr = (attr)=>{
    if(!attr) return {}
    let data = attr.trim()
    if(data === '') return {}
    let row = []
    let attrs = {}
    row = data.split('\n')
    for(let i=0;i<row.length;i++){
        attrs[row[i].split(/[:：]/)[0]] = row[i].split(/[:：]/)[1].split(/[,，]+/)
    }
    return attrs
}
export const fbTrace =(fbId)=> {
    let fbIdDom = ''
    fbId = fbId.split(/[[,，]+/)
    fbId.forEach(v=>{
        if(v){
            if(typeof v === 'string'){
                fbIdDom =  fbIdDom+`fbq('init', '${v}');`
            }else{
                fbIdDom =  fbIdDom+`fbq('init', `+v+`);`
            }
        }
    })
    let fbDom = `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https:\/\/connect.facebook.net\/en_US\/fbevents.js');`+
                fbIdDom+
                `fbq('track', 'PageView');`
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = fbDom
    script.onload = function () {

    };
    (document.head).appendChild(script);
    // var noscript = document.createElement('noscript');
    // noscript.innerHTML = `<img height="1" width="1" style="display:none"src="https://www.facebook.com/tr?id=${fbDId}&ev=PageView&noscript=1"/>`
    // noscript.onload = function () {
    //
    // };
    // (document.head).appendChild(noscript);
}