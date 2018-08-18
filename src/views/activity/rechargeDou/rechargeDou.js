import Vue from 'vue'

import Checker from 'vux/src/components/checker/checker.vue'
import CheckerItem from 'vux/src/components/checker/checker-item.vue'
import navHead from '@/components/navHead'
import { Toast } from 'vue-ydui/dist/lib.px/dialog'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.prototype.$dialog = {
  toast: Toast,
};


export default {
  data() {
    return {
      is_attention: 1, // 是否关注了公众号，默认关注了
      show1: false,
      paymethod: '微信',
      ra_id: '',
      inputMoney: '', // 充值金额
      gift:'', // 选中的充值方式
      recharges: // 几种充值方式
      [
        {
          id:1,
          money: 500,
          yi_moeny:550,
        },
        {
          id:2,
          money: 1000,
          yi_moeny:1100,
        },
        {
          id:3,
          money: 5000,
          yi_moeny:5500,
        },
        {
          id:4,
          money: 10000,
          yi_moeny:11000,
        }

      ] , 
    }
  },
  components: {
    Checker,
    CheckerItem,
    Toast,
    navHead
  },
  computed: {
    realMoney() {
      if (Number(this.inputMoney) < 0 || !this.inputMoney) {
        return 0
      } else if (Number(this.inputMoney) > 0 && Number(this.inputMoney) < 100) {
        return parseInt(this.inputMoney)
      } else {
          return (Number(1.1) * Number(this.inputMoney)).toFixed(2)
      }
    }
  },
  methods: {
    attention() { // 获取公众号是否被关注
      this.axios.get('/access/token', {
        params: {
          openid: localStorage.getItem('openid')
        }
      }).then(res => {
        this.is_attention = res.data.datas
      })
    },
    recharge() { // 充值
      if (!this.inputMoney && this.gift == '') {
        Toast({
          mes: "请输入充值金额或选择充值金额",
          timeout: 2000
        });
      } else {
        if (this.inputMoney) {
        } else if (this.gift) {
          this.inputMoney = this.gift.money
        }
        this.$dialog.loading.open()
        
        this.axios.post('/recharge/yibean', {
          openid: localStorage.getItem('openid'),
          // money: parseInt(this.inputMoney),
          money: this.inputMoney,
        }).then(res => {
          if (res.data.result) {
          this.$dialog.loading.close()
        
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
      }

    },
    jsApiCall: function () {
      console.log('this.wechatInfo', this.wechatInfo)
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

  },
  created() {
    this.gift = this.recharges[0]
    this.attention()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.axios.post("/qrcode/share/generate", { openid: localStorage.getItem("openid") }).then((res) => {
        if (res.data.result) {
          vm.shareImgData = res.data.datas.share_img
          vm.shareUrl = res.data.datas.share_url
        }
      });
    });
  },
  beforeCreate() {
    this.SDKRegister(this, () => {
      console.log('首页调用分享')
    })
  },
}