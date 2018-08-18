// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
// import MintUI from 'mint-ui'
import 'vue-resource'
import App from './App'
import store from './store'
import router from './router'
import gobal from './global.js'
import iconSvg from '@/components/iconSvg'
import VueLazyload from 'vue-lazyload'
import WechatPlugin from 'vux/src/plugins/wechat/index.js'
import {
    Confirm,
    Alert,
    Toast,
    Notify,
    Loading
} from 'vue-ydui/dist/lib.px/dialog'
import YDUI from 'vue-ydui';
import 'vue-ydui/dist/ydui.base.css';
// 引入vue-amap
import VueAMap from 'vue-amap'

Vue.use(gobal)
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '/static/imgs/loading.jpg',
    loading: '/static/imgs/loading.jpg',
    attempt: 1
})

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// Vue.prototype.$axios = axios;
Vue.use(VueAxios, axios)
Vue.component('icon-svg', iconSvg) // fontIcon 若在阿里图标中添加了新图标,请在index.html中更新代码
Vue.config.productionTip = false
    // Vue.use(MintUI)
Vue.use(YDUI);
Vue.use(VueAMap)
    // 初始化vue-amap

Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
}

VueAMap.initAMapApiLoader({
    // 高德的key
    key: 'e91ae96ed8069274f966bcaf2de7137a',
    // 插件集合
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geolocation', 'AMap.Geocoder']
});


//测试版
// Vue.prototype.HTTP = 'http://localhost/';
// axios.defaults.baseURL = 'http://localhost/';
// 正式版
Vue.prototype.HTTP = 'http://shopapi.anasit.com/';
axios.defaults.baseURL = 'http://shopapi.anasit.com/';
// axios.defaults.baseURL = 'http://192.168.1.102';

Vue.prototype.imgUrl = 'http://shopapi.anasit.com/';

// 判断用户是否绑定手机号
Vue.prototype.bindMobile = function(redirectPath) {
        axios.get('/wechatauth/user/info', {}).then(res => {
            if (res.data.result) {

                console.log(res.data.datas.mobile)
                if (!res.data.datas.mobile) { //如果没有电话号
                    // 没有绑定手机号跳到登录页
                    this.$dialog.toast({
                        mes: "请绑定手机号"
                    })
                    window.location.href = '/my/mobile/bind?redirect=' + redirectPath

                }

            }
        })
    }
    // 添加实例方法,微信分享
Vue.prototype.SDKRegister = (that, callback) => {
    setTimeout(() => {
        Vue.use(WechatPlugin) //  微信
        let url = window.location.href
        that.axios.get('/wechatauth/user/info', {}).then(res => {
            if (res.data.result) {
                that.user = res.data.datas;
            }
        })
        that.axios.get('/wechatauth/get/jsapiticket', {
            params: {
                url: url
            }
        }).then(res => { // 获得签名配置
            var Data = res.data.datas;

            that.$wechat.config({
                debug: false, // 调试模式,
                appId: Data.appid, // 公众号的唯一标识
                timestamp: Data.timestamp, // 生成签名的时间戳
                nonceStr: Data.digit, // 生成签名的随机串
                signature: Data.signature, // 签名
                jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            })
        })

        that.$wechat.ready(() => {
            // 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
            // 则可以直接调用，不需要放在ready函数中。
            that.link = 'http://shopapi.anasit.com/shareConfirm?uid=' + that.user.id;
            // that.link = window.location.href;
            var wxtitle = '您的好友邀您加入百业衍升联盟O2O平台！' // 标题
            var wximg = 'http://shopapi.anasit.com/upload/75a8b08b7aa9dbb0958c515fe78f128e.jpg'
            var wxlink = that.link;
            var wxdesc = '帮买家得折扣赢福利，帮商家销产品引客流，共同营造未来' // 描述(分享给微信/QQ好友/微博时显示)
            that.$wechat.onMenuShareAppMessage({ // 分享给朋友
                title: wxtitle, // 分享标题
                desc: wxdesc, // 分享描述
                link: wxlink,
                imgUrl: wximg, // 分享图标
                // 用户确认分享后执行的回调函数
                success: function() {
                    Toast({
                        mes: "恭喜分享成功",
                        timeout: 2000
                    });
                },
                // 用户取消分享后执行的回调函数
                cancel: function() {
                    Toast({
                        mes: "分享到朋友取消",
                        timeout: 2000
                    });
                }
            });
            //分享到朋友圈
            that.$wechat.onMenuShareTimeline({
                title: wxtitle, // 分享标题
                desc: wxdesc, // 分享描述
                link: wxlink,
                // link: that.link,   // 分享链接
                imgUrl: wximg, // 分享图标
                // 用户确认分享后执行的回调函数
                success: function() {
                    Toast({
                        mes: "分享到朋友圈成功",
                        timeout: 2000
                    });
                },
                // 用户取消分享后执行的回调函数
                cancel: function() {
                    Toast({
                        mes: "分享到朋友圈取消",
                        timeout: 2000
                    });
                }
            });
        })
    }, 1000);

};



router.beforeEach((to, from, next) => {

    if (process.env.NODE_ENV == 'development') { //开发环境
        localStorage.uid = 2
        localStorage.token = 'd14f60893cbc41c18b65f6809ad5f9612b2c883b'
            // localStorage.uid = 11
            // localStorage.token = 'd8e4eba8981d61918a8eb74d6882d7c6e57f2e77'
        next();
    } else {
        // 判断令牌是否失效
        axios.get('/wechatauth/user/check/token', {
            params: {
                id: localStorage.uid ? localStorage.uid : 0,
                token: localStorage.token ? localStorage.token : '0'
            }
        }).then(res => {
            console.log(res)
            if (res.data.result == false) {
                // 令牌失效
                var url = 'http://shop.anasit.com' + to.fullPath

                if (to.query.code !== undefined && to.query.state !== undefined) {
                    axios.get('/wechatauth/auth/token', {
                        params: {
                            code: to.query.code,
                            state: to.query.state
                        }
                    }).then(res => {
                        localStorage.uid = res.data.datas.id
                        localStorage.token = res.data.datas.token
                        next()

                    })

                } else {
                    var url = 'http://shop.anasit.com' + to.fullPath

                    axios.get('/wechatauth/auth/url', {
                        params: {
                            url: url
                        }
                    }).then(res => {
                        window.location.href = res.data.datas
                    })
                }
            } else {
                next()
            }

        })

    }

})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
        App
    }
})