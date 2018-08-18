import Vue from 'vue'

import Checker from 'vux/src/components/checker/checker.vue'
import CheckerItem from 'vux/src/components/checker/checker-item.vue'

import { Toast } from 'vue-ydui/dist/lib.px/dialog'

Vue.prototype.$dialog = {
    toast: Toast,
};


export default{
    data(){
        return{
            is_attention: 1, // 是否关注了公众号，默认关注了
            show1:false,
            chargeMoney: '', // 充值金额
            gift:'', //选中的礼物方式
            news:'',
        }
    },
    components:{
        Checker,
        CheckerItem,
        Toast
    },
    methods: {
        attention(){ // 获取公众号是否被关注
            this.axios.get('/access/token', {
                params: {
                    openid: localStorage.getItem('openid')
                }
            }).then(res => {
                this.is_attention = res.data.datas
            })
        },
        recharge() { //充值
            if (!this.chargeMoney) {
                this.$dialog.toast({mes: '请输入充值金额！', timeout: 1000 });
                return
            }
            if (parseInt(this.chargeMoney) < 1) {
                this.$dialog.toast({mes: '充值金额不能小于1元！', timeout: 1000 });
                return
            }
            if (!this.gift) {
                this.$dialog.toast({mes: '请选择好礼方式！', timeout: 1000 });
                return
            }
            if (this.is_attention != 1) { // 没有关注公众号
                this.show1 = true
                return
            }
            this.axios.post('/campaign/recharge',{
                ra_id: this.gift.ra_id,
                d_id: this.gift.id,
                money: parseFloat(this.chargeMoney).toFixed(2),
                openid: localStorage.getItem('openid')
            }).then(res=>{
                if (res.data.result) {
                    this.wechatInfo = res.data.datas.wx_info.datas
                    if (typeof WeixinJSBridge == "undefined") {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', this.jsApiCall(), false);
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', this.jsApiCall());
                            document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall());
                        }
                    } else {
                        // 唤起微信支付
                        this.jsApiCall();
                    }
                } else {
                    console.log("err")
                    alert('支付失败');
                }
            })
        },
        jsApiCall: function () {
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
                        // this.$dialog.toast({mes: '支付成功', timeout: 1500});
                        that.$router.push({ path: "/my/center" })
                        // window.location.href = "/my/center";//成功后要跳转的页面或控制器
                    } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                        Toast({
                            mes: "支付取消",
                            timeout: 2000
                        });
                        // this.$dialog.toast({mes: '支付失败', timeout: 1500});
                    }
                }
            );
        },
       //获取充值送礼的活动信息
       getNews(){
           this.axios.get("/recharge/activity").then(res => {
               console.log(res)
               this.news = res.data.datas
           })
       }
    },
    created(){
        this.attention()
        this.getNews()
    }
}