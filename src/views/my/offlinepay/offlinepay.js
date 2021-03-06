/*
 * @Author: veggieg8 
 * @Date: 2018-07-16 10:33:02 
 * @Last Modified by: veggieg8
 * @Last Modified time: 2018-07-18 17:32:32
 */
import Vue from 'vue'
import fixBottom from '@/components/fixBottom'
import WechatPlugin from "vux/src/plugins/wechat/index.js"
import {
    Popup
} from 'vue-ydui/dist/lib.px/popup';
import navHead from '@/components/navHead'

Vue.component(Popup.name, Popup);

export default {
    data() {
        return {
            user: {}, //个人信息
            // 默认不是商家
            bussinessMan: 0,
            status: '',
            balance: 0.00,
            shopId: 0,
            storeinfo: {},
            ordersn: ''
        }
    },
    components: {
        fixBottom,
        navHead
    },
    watch: {
        balance: {
            handler(val, oldVal) {
                if (this.balance > 0) {
                    this.balance = (parseInt(this.balance * 100) / 100)
                } else if (this.balance == 0) {
                    this.balance = this.balance
                } else {
                    this.balance = 0
                }
            },
            deep: true
        },
    },
    created() {
        this.getUser(); // 获取个人信息
        // this.isBussiness();
        if (this.$route.query.id) {
            this.shopId = this.$route.query.id
            this.getStore()
        }
    },
    methods: {
        getStore() { // 获取商铺信息
            this.axios.get('/wechatauth/get/store/info', {
                params: {
                    id: this.shopId
                }
            }).then(res => {
                if (res.data.result) {
                    this.storeinfo = res.data.datas[0];
                }
            })
        },
        // 发起微信支付
        wxPay() {
            if (this.balance && this.balance > 0) {
                this.donationMoney();
            } else {
                this.$dialog.toast({ mes: '请输入正确的金额~', timeout: 2000 });
                return;
            }
        },
        //支付金额
        donationMoney() {
            this.axios.post('/wechatauth/order/offline/pay', {
                shopId: this.$route.query.id,
                balance: this.balance
            }).then(res => {
                console.log(res)
                this.wechatInfo = res.data.datas.signArray
                this.ordersn = res.data.datas.ordersn
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', this.jsApiCall(), false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', this.jsApiCall());
                        document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall());
                    }
                    return
                } else { // 唤起微信支付
                    this.jsApiCall();
                }
            })
        },
        jsApiCall: function() {
            console.log('this.wechatInfo', this.wechatInfo)
            let that = this
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId": this.wechatInfo.appId,
                    "timeStamp": this.wechatInfo.timeStamp,
                    "nonceStr": this.wechatInfo.nonceStr,
                    "package": this.wechatInfo.package,
                    "signType": this.wechatInfo.signType,
                    "paySign": this.wechatInfo.paySign
                },
                function(res) {
                    WeixinJSBridge.log(res.err_msg);
                    if (res.err_msg == "get_brand_wcpay_request:ok") { //如果微信支付成功

                        that.axios.get('/wechatauth/order/confirm', {
                            ordersn: that.ordersn
                        }).then(result => {
                            // if (result.data.result) {
                            that.$dialog.toast({ mes: '支付成功！', timeout: 3000 });
                            that.$router.push({ path: "/" })
                                // } else {
                                //     that.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                                // }
                        })

                    } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                        that.$dialog.toast({ mes: '支付取消!', timeout: 3000 });
                    }
                }
            );
        },
        share() {
            setTimeout(() => {
                let that = this
                Vue.use(WechatPlugin)
                let url = window.location.href;
                that.axios.get('/wechatauth/get/jsapiticket', {
                    params: {
                        url: url
                    }
                }).then(res => { // 获得签名配置
                    var Data = res.data.datas;
                    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，
                    that.$wechat.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: Data.appid, // 必填，公众号的唯一标识
                        timestamp: Data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: Data.digit, // 必填，生成签名的随机串
                        signature: Data.signature, // 必填，签名，见附录1
                        jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    })
                })

                that.$wechat.ready(() => {
                    // 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
                    // 则可以直接调用，不需要放在ready函数中。
                    that.link = 'http://shop.anasit.com/my/shareConfirm?uid=' + that.user.id;
                    // console.log(that.link)
                    var wxtitle = '您的好友邀请您加入百业衍升商城联盟' // 标题
                    var wximg = 'http://shopapi.anasit.com/upload/75a8b08b7aa9dbb0958c515fe78f128e.jpg'
                    var wxlink = that.link
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
            }, 300);
        },
        HSrc: function(value) { // 头像
            let http = value.indexOf('http');
            if (http > -1) {
                return value
            } else {
                return this.HTTP + value
            }
        },
        getUser() { // 获取用户信息
            this.axios.get('/wechatauth/user/info', {}).then(res => {
                if (res.data.result) {
                    this.user = res.data.datas;
                    this.share()
                }
            })
        },

        /**
         * 判断该用户是否为商家
         */
        isBussiness() {
            this.axios.get('/wechatauth/user/apply/store').then(res => {
                if (!res.data.result) {
                    // 当bussinessMan为0时不是商家
                    this.bussinessMan = 0;
                } else {
                    this.bussinessMan = 1;
                }
            });
        },
    },

}