import Vue from 'vue'

import navHead from '@/components/navHead';
import Checker from 'vux/src/components/checker/checker.vue'
import CheckerItem from 'vux/src/components/checker/checker-item.vue'
import { Toast, Confirm } from 'vue-ydui/dist/lib.px/dialog'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.prototype.$dialog = {
    toast: Toast,
    confirm: Confirm,
};


export default {
    data() {
        return {
            payMethods: ['微信支付', '易豆支付'], // 支付方式
            paymethod: [], // 选中的支付方式
            inputMoney: '', //输入的金额
            user: {}, // 用户信息
            shopDetail:{}, // 商家资料
            yradio: '',//比例
            orderId:'',
        }
    },
    components: {
        Checker,
        CheckerItem,
        navHead,
    },
    computed: {
        totalYmoney(){
            return Math.ceil(this.inputMoney * this.shopDetail.b_yratio)
        },
        lastPayMoney() { //最后支付的钱
            if (this.paymethod == '微信' && this.inputMoney) { // 仅微信支付
                return '微信支付' + this.inputMoney + '元'
            } 
            else if (this.paymethod == '易豆' && this.inputMoney) {
                if ( parseInt(this.user.yi_peas) >= parseFloat(this.totalYmoney)) { // 用户的易豆数 大于等于 支付易豆数
                    return '易豆支付' + this.totalYmoney
                } 
                else { // 用户的易豆数 小于 支付易豆数
                    let temp = Math.ceil((this.totalYmoney - this.user.yi_peas) / this.shopDetail.b_yratio)
                    return '还需微信支付' + temp + '元'
                }
            } 
            else if (this.paymethod == '余额' && this.inputMoney) {
                if ( parseFloat(this.user.balance) >= parseFloat(this.inputMoney)) { // 用户的易豆数 大于等于 支付易豆数
                    return '余额支付' + this.inputMoney
                }
                else { // 用户的易豆数 小于 支付易豆数
                    let temp = parseFloat(this.inputMoney - this.user.balance).toFixed(2)
                    return '还需微信支付' + temp + '元'
                }
            }
            else { // 没有易豆,没有选择方式
                return '微信支付'
            }
        }
    },
    methods: {
        getShop(){ // 获取商家资料
            this.axios.get("/business/info",{params:{
                id:this.$route.query.shopId
            }}).then(res => {
                this.shopDetail = res.data.datas
            })
        },
        getBalance() { // 获取余额
            this.axios.get('/wechatauth/user/info', {
                params: {
                    openid: localStorage.getItem('openid')
                }}).then(res => {
                if (res.data.result) {
                    this.user = res.data.datas;
                }
            })
        },
        payNotice() {  // 支付提示
            if (this.paymethod != '微信' &&  this.paymethod != '易豆' && this.paymethod != '余额') {
                this.$dialog.toast({mes: '请选择支付方式', timeout: 1500});
                return
            }

            if (this.paymethod == '易豆' && parseInt(this.user.yi_peas) >= parseFloat(this.totalYmoney)) { // 全易豆支付成功
                this.$dialog.confirm({
                    title: '支付提示',
                    mes: '确认用易豆支付此单？',
                    opts: [
                        {
                            txt: '取消',
                            color: false,
                            callback: () => {
                                this.$dialog.toast({mes: '取消易豆支付', timeout: 1500});
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
            if (this.paymethod == '余额' && parseFloat(this.user.balance) >= parseFloat(this.inputMoney) ) { // 全余额支付成功
                this.$dialog.confirm({
                    title: '支付提示',
                    mes: '确认用余额支付此单？',
                    opts: [
                        {
                            txt: '取消',
                            color: false,
                            callback: () => {
                                this.$dialog.toast({mes: '取消余额支付', timeout: 1500});
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
        pay(){// 生成订单
            if (!this.inputMoney){
                this.$dialog.toast({mes: '请输入支付金额', timeout: 1500});
                return                
            }
            if (this.paymethod != '微信' &&  this.paymethod != '易豆' && this.paymethod != '余额') {
                this.$dialog.toast({mes: '请选择支付方式', timeout: 1500});
                return
            }
            
            this.axios.post('/offline/order', { 
                o_bid: this.shopDetail.id,
                openid: localStorage.getItem('openid'),
                o_price: this.inputMoney,
            }).then(res => {
                console.log(res.data)
                this.orderId = res.data.id
                this.mallPay()
            })
        },
        mallPay: function () { //微信预支付
            this.axios.post('/order/wx/pay', { // 微信预支付
                openid: localStorage.getItem('openid'),
                orders: this.orderId,
                type: this.paymethod == '易豆' ? 1 : this.paymethod == '余额' ? 2 : 0  //微信为0，易豆为1，余额为？
            }).then(res => {
                console.log(res.data)
                if (res.data.result) {
                    if (this.paymethod == '易豆' && parseInt(this.user.yi_peas) >= parseFloat(this.totalYmoney)) { // 全易豆支付成功
                        this.$dialog.toast({mes: '易豆支付成功', timeout: 2000});
                        // window.location.href="/shopCar/writeOff?orderId=" + this.orderId
                        this.$router.push('/shopCar/writeOff?orderId=' + this.orderId)
                        return
                    }
                    if (this.paymethod == '余额' && parseFloat(this.user.balance) >= parseFloat(this.inputMoney) ) { // 全余额支付成功
                        this.$dialog.toast({mes: '余额支付成功', timeout: 2000});
                        // window.location.href="/shopCar/writeOff?orderId=" + this.orderId
                        this.$router.push('/shopCar/writeOff?orderId=' + this.orderId)
                        return
                    }
                    // 全微信支付，易豆加微信支付, 余额加微信支付
                    if (this.paymethod == '微信' || (this.paymethod == '易豆' && parseInt(this.user.yi_peas) < parseFloat(this.totalYmoney)) ||  (this.paymethod == '余额' && parseFloat(this.user.balance) < parseFloat(this.inputMoney)) ) {
                        this.$dialog.loading.open('调取中,请稍候~')
                        this.wechatInfo = res.data.datas.datas
                        if (typeof WeixinJSBridge == "undefined") {
                            this.$dialog.loading.close()
                            if (document.addEventListener) {
                                document.addEventListener('WeixinJSBridgeReady', this.jsApiCall(), false);
                            } else if (document.attachEvent) {
                                document.attachEvent('WeixinJSBridgeReady', this.jsApiCall());
                                document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall());
                            }
                        } else {// 唤起微信支付
                            this.jsApiCall();
                        }
                    }
                } else {
                    console.log("err")
                    alert('支付失败');
                }
            })
        },
        jsApiCall: function () {
            this.$dialog.loading.close()
            console.log('this.wechatInfo',this.wechatInfo)
            let that = this
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId": this.wechatInfo.appId,     //公众号名称，由商户传入     
                    "timeStamp": this.wechatInfo.timeStamp,         //时间戳，自1970年以来的秒数     
                    "nonceStr": this.wechatInfo.nonceStr, //随机串     
                    "package": this.wechatInfo.package,
                    "signType": this.wechatInfo.signType,         //微信签名方式：     
                    "paySign": this.wechatInfo.paySign //微信签名
                },
                function (res) {
                    WeixinJSBridge.log(res.err_msg);
                    if (res.err_msg == "get_brand_wcpay_request:ok") { //如果微信支付成功
                        Toast({
                            mes: "支付成功",
                            timeout: 2000
                        });
                        // window.location.href="/shopCar/writeOff?orderId=" + that.orderId
                        that.$router.push('/shopCar/writeOff?orderId=' + that.orderId)
                        
                    } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                        Toast({
                            mes: "支付取消",
                            timeout: 2000
                        });
                    }
                }
            );
        },
    },
    created() {
        this.getShop() // 获取商家资料
        this.getBalance() //获取用户余额
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.axios.post("/qrcode/share/generate", { openid: localStorage.getItem("openid")}).then((res) => {
                if (res.data.result) {
                    vm.shareImgData = res.data.datas.share_img
                    vm.shareUrl = res.data.datas.share_url
                }
            });
        });
    },
    beforeCreate(){
        this.SDKRegister(this, ()=>{
            console.log('首页调用分享')
        })
    },

}