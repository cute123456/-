import Vue from 'vue'
import { Toast, Loading } from 'vue-ydui/dist/lib.px/dialog'
import Checker from 'vux/src/components/checker/checker.vue'
import CheckerItem from 'vux/src/components/checker/checker-item.vue'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.prototype.$dialog = {
  toast: Toast,
  loading: Loading,
};


export default {
  data() {
    return {
      isReport: true, // 检测用户是否已报名该活动
      member: {},//报名信息
      user: {}, // 用户的易豆
      paymethod: [], // 选中的支付方式
      is_fee: 0, // 收费1，免费0
      infos: {}, // 接口获取的报名活动信息
      isJoin: -1, // 是否参加了活动，-1没参加，1参加了
    }
  },
  components: {
    Checker,
    CheckerItem
  },
  methods: {
    sign() { //立即报名
      if (this.member.name && this.member.phone && this.member.compony && this.member.goodName && this.member.goodPrice && this.member.personNum) {

        if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.member.phone)) {
          this.$dialog.toast({ mes: '请输入正确的手机号', timeout: 400 });
          return false;
        }

        if (this.is_fee == 1) { // 收费
          if (this.paymethod != '微信' && this.paymethod != '易豆') {
            this.$dialog.toast({ mes: '请选择支付方式', timeout: 1500 });
            return
          }

          this.axios.post('/enroll/pay', {
            openid: localStorage.getItem('openid'),
            sign_id: this.$route.query.id,
            pay_way: this.paymethod == '微信' ? 0 : 1, // 微信0， 易豆1
            members: this.member.personNum
          }).then(res => {
            if (res.data.result) {

              if (this.paymethod == '易豆') {
                this.signMes()
              }

              if (this.paymethod == '微信') {
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
                  return
                } else {// 唤起微信支付
                  this.jsApiCall();
                }
              }

            } else {
              this.$dialog.toast({ mes: res.data.message, timeout: 3000 });
              return
            }
          })
        } else if (this.is_fee == 0) { // 免费
          this.signMes()
        }

      } else {
        this.$dialog.toast({ mes: '请补全报名信息并填写完整', timeout: 1500 });
      }

    },
    jsApiCall: function () {
      this.$dialog.loading.close()
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
            that.signMes() // 插入报名信息
            Toast({
              mes: "支付成功",
              timeout: 2000
            });
            // window.location.href="/shopCar/writeOff?orderId=" + that.orderId
            // this.$router.push('/activity/list')

          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
            Toast({
              mes: "支付取消",
              timeout: 2000
            });
          }
        }
      );
    },
    signMes() { // 插入报名信息
      console.log('插入报名信息', this.member)
      this.axios.post("/sign/activity", {
        uid: localStorage.getItem('uid'),
        name: this.member.name,
        mobile: this.member.phone,
        company: this.member.compony,
        y_goods: this.member.goodName,
        y_price: this.member.goodPrice,
        members: this.member.personNum,
      }).then(res => {

        if (res.data.result) {
          this.$dialog.toast({ mes: '恭喜报名成功', timeout: 3000 });
          this.$router.push('/activity/list')
          // window.localtion.href = "/activity/list"
        } else {
          this.$dialog.toast({ mes: res.data.message, timeout: 3000 });
        }

      })
    },
    getUser() { // 获取用户信息
      this.axios.get('/wechatauth/user/info', {
        params: {
          openid: localStorage.getItem('openid')
        }
      }).then(res => {
        if (res.data.result) {
          this.user = res.data.datas;
        } else {
          this.$dialog.toast({ mes: res.data.message, timeout: 2000 })
        }
      })
    },
    getJoinInfo() { // 获取报名活动详情信息
      this.axios.get('/enroll/info', {
        params: {
          id: this.$route.query.id
        }
      }).then(res => {
        if (res.data.result) {
          this.infos = res.data.datas
          this.is_fee = this.infos.is_fee
        } else {
          this.$dialog.toast({ mes: res.data.message, timeout: 2000 })
        }
      })
    },


  },
  created() {
    this.axios.get('/activity/isjoin', {  //判断是否参加了该活动
      params: {
        s_id: this.$route.query.id,
        uid: localStorage.getItem('uid')
      }
    }).then(res => {
      if (res.data.result) {
        this.isJoin = res.data.datas
      } else {
        this.$dialog.toast({ mes: res.data.message, timeout: 3000 });
      }
    })
  },
  mounted() {
    this.getUser() // 获取用户信息
    this.getJoinInfo() //  获取报名活动详情信息
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