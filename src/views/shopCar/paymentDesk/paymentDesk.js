import Vue from 'vue'

import navHead from '@/components/navHead';
import Checker from 'vux/src/components/checker/checker.vue'
import CheckerItem from 'vux/src/components/checker/checker-item.vue'
import {
    Toast,
    Confirm
} from 'vue-ydui/dist/lib.px/dialog'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.prototype.$dialog = {
    toast: Toast,
    confirm: Confirm,
};


export default {
    data() {
        return {
            // payMethods: ['微信支付', '易豆支付'], // 支付方式
            paymethod: [], // 选中的支付方式
            totalMoney: 0, //总支付钱（不含运费）
            totalYmoney: 0, //总支付豆数（不含运费）
            orderId: [], // 订单id
            orderDatas: [], //订单数据
            show: false,
            newDatas: [],
            user: {}, // 用户信息
            oFreight: '', //运费
            yradio: '', //比例
            joinYgoods: [], //是否参加易货，1参加易货，0不参加既不让用易豆支付
            joinFlag: false, //
            ordersn: '',
            integralPayMethod: true,
            integralPay: 0,
            wechatPay: 0.00,
            isIntegralPay: true, // 是否积分支付
            isIntegral: true,
            deductibleAmount: 1, // 抵扣金额
            couponname: '',
            rate: 0
        }
    },
    components: {
        Checker,
        CheckerItem,
        navHead,
    },
    computed: {
        // 计算微信支付的金额
        wechatPayPrice() {

        }
    },
    methods: {
        isShow() {
            this.show = !this.show
            if (this.show) {
                this.newDatas = this.orderDatas
            } else {
                this.newDatas = this.orderDatas.slice(0, 1)
            }
        },
        changWechatPay(value) {
            // console.log(value[0])
            if (value[0] == '积分') {
                this.wechatPay = parseFloat(this.totalMoney * (1 - this.rate)).toFixed(2)
                this.isIntegral = true
            } else {
                this.wechatPay = this.totalMoney
                this.isIntegral = false
            }
        },
        getOrderInfo() { // 获取订单详情
            this.axios.get('/wechatauth/order/info', {
                params: {
                    id: this.$route.query.orderId
                }
            }).then(res => {
                if (res.data.result) {
                    this.orderDatas = res.data.datas

                    // console.log(res.data.datas)
                    var arr = [];
                    for (var i in this.orderDatas) {
                        if (this.orderDatas[i]['business']['isQuality'] == 1) {

                        }
                        arr.push(this.orderDatas[i]); //属性
                    }
                    for (var i in this.orderDatas) {
                        if (this.orderDatas[i]['business']['isQuality'] == 0) {
                            this.isIntegralPay = false;
                            break;
                        }
                    }
                    for (var i = 0; i < arr.length; i++) {
                        this.totalMoney = this.totalMoney + Number(arr[i].orderTotalPrice);
                    }
                } else {
                    this.$dialog.toast({
                        mes: res.data.message,
                        timeout: 3000
                    })
                }
                this.getUserInfo()

            })
        },
        getUserInfo() {
            this.axios.get('/wechatauth/parameter/get').then(res => {
                this.rate = res.data.datas;
                this.axios.get('/wechatauth/user/info').then(res => {
                    if (res.data.result) {
                        this.user = res.data.datas;
                        console.log(this.rate)
                        if (this.user.vipLevel == 1 && this.isIntegralPay) {
                            // 积分支付额
                            this.integralPay = parseFloat(this.totalMoney * this.rate)
                            if (this.integralPay > parseFloat(this.user.integral)) {
                                this.integralPay = parseFloat(this.totalMoney * this.rate).toFixed(2)
                                this.integralPayMethod = false;
                                this.isIntegral = false;
                                this.wechatPay = this.totalMoney;
                            } else {
                                this.integralPay = parseFloat(this.totalMoney * this.rate).toFixed(2)
                                this.paymethod = ['积分'];
                                this.wechatPay = parseFloat(this.totalMoney * (1 - this.rate)).toFixed(2);
                                // console.log('totalMoney:' + this.totalMoney + ',rate:' + this.rate + ',type:' + typeof this.totalMoney + ',' + this.rate)

                                // console.log(this.wechatPay)
                                this.isIntegral = true;
                            }
                        } else {
                            this.wechatPay = this.totalMoney;
                        }
                    }
                })
            });

        },
        payNotice() {

            if (this.paymethod[0] == '积分' && this.integralPayMethod) {
                this.$dialog.confirm({
                    title: '支付提示',
                    mes: '您将消耗' + this.integralPay + '的积分支付该笔订单，是否确认支付？',
                    opts: [{
                            txt: '取消',
                            color: false,
                            callback: () => {
                                this.$dialog.toast({
                                    mes: '您取消支付，请重新选择',
                                    timeout: 1500
                                });
                                return
                            }
                        },
                        {
                            txt: '确定',
                            color: true,
                            callback: () => {
                                this.pay()
                            }
                        }
                    ]
                });
                return
            }
            this.pay()
        },
        pay: function() {
            //订单支付
            if (this.isIntegral) {
                var integral = 1
            } else {
                var integral = 0
            }
            this.axios.post('/wechatauth/order/pay', {
                orders: this.$route.query.orderId,
                integral: integral
            }).then(res => {
                if (res.data.result) {
                    this.wechatInfo = res.data.datas.signArray
                    this.ordersn = res.data.datas.ordersn
                        // console.log(this.wechatInfo)
                    if (typeof WeixinJSBridge == "undefined") {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', this.jsApiCall(), false);
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', this.jsApiCall());
                            document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall());
                        }
                    } else { // 唤起微信支付
                        this.jsApiCall();
                    }

                } else {
                    // console.log("err")
                    // alert('支付失败');
                    this.$dialog.toast({
                        mes: res.data.message,
                        timeout: 3000
                    });

                }
            })
        },
        jsApiCall: function() {
            let that = this
                // console.log('this.wechatInfo', that.wechatInfo)

            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId": this.wechatInfo.appId, //公众号名称，由商户传入     
                    "timeStamp": this.wechatInfo.timeStamp, //时间戳，自1970年以来的秒数     
                    "nonceStr": this.wechatInfo.nonceStr, //随机串     
                    "package": this.wechatInfo.package,
                    "signType": this.wechatInfo.signType, //微信签名方式：
                    "paySign": this.wechatInfo.paySign //微信签名
                },
                function(res) {

                    WeixinJSBridge.log(res.err_msg);
                    if (res.err_msg == "get_brand_wcpay_request:ok") { //如果微信支付成功
                        // 支付成功，进行微信同步确认
                        that.axios.get('/wechatauth/order/confirm', {
                                ordersn: that.ordersn,
                            }).then(res => {
                                that.$dialog.toast({
                                    mes: "支付成功",
                                    timeout: 3000
                                });
                                that.$router.push({
                                    path: "/my/order"
                                })
                            })
                            // window.location.href="/"

                    } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                        that.$dialog.toast({
                            mes: "支付取消",
                            timeout: 3000
                        });
                        // window.location.href = "/my/order";//成功后要跳转的页面或控制器
                    }
                }
            );
        },
        toSelect() {
            this.$router.push('/my/coupons?orderId=' + this.$route.query.orderId + '&frompage=paymentDesk')
        }
    },
    mounted: function() {
        // 判断用户是否绑定手机
        this.bindMobile(this.$route.fullPath)
        this.getOrderInfo() // 获取订单详情
            // this.getUserInfo() // 获取用户信息
        if (this.$route.query.couponid) {
            this.axios.get("/wechatauth/user/coupon/get", {
                params: {
                    limit: 100,
                    offset: 0,
                }
            }).then(res => {
                const list = res.data.datas.rows;
                list.forEach(element => {
                    if (Number(element.id) === Number(this.$route.query.couponid)) {
                        this.couponname = element.couponName
                    }
                });
            });
        }
    }

}