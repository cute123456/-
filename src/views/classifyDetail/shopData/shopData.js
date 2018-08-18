import Vue from 'vue'
import navHead from '@/components/navHead'
import {
  Toast
} from 'vue-ydui/dist/lib.px/dialog'
import Checker from 'vux/src/components/checker/checker.vue'
import CheckerItem from 'vux/src/components/checker/checker-item.vue'
import WechatPlugin from "vux/src/plugins/wechat/index.js"
import {
  InfiniteScroll
} from 'vue-ydui/dist/lib.px/infinitescroll'
import {
  ListTheme,
  ListItem
} from 'vue-ydui/dist/lib.px/list'
import 'vue-ydui/dist/ydui.base.css'

Vue.component(InfiniteScroll.name, InfiniteScroll)
Vue.component(ListTheme.name, ListTheme)
Vue.component(ListItem.name, ListItem)

export default {
  data: function () {
    return {
      is_attention: 1, // 是否关注了公众号，默认关注了
      show1: false,
      total: '', //【评价总数
      payMethods: ['微信支付', '余额支付', '易豆支付'], // 支付方式
      paymethod: [], // 选中的支付方式
      offline: 0, //1是线下商品，0是线上
      shopDetail: '',
      money: '', //支付金额
      commendLists: [], // 评论列表
      page: 1, // 滚动加载
      pageSize: 10,
      limit: 10,
    }
  },
  components: {
    navHead,
    Checker,
    CheckerItem,
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
    goPay() {
      if (this.is_attention != 1) { // 没有关注公众号
        this.show1 = true
        return
      }
      window.location.href = '/shopCar/pay?shopId=' + this.shopDetail.id
      // this.$router.push('/shopCar/pay?shopId=' + this.shopDetail.id)
    },
    getShop() { // 获取商家资料
      this.axios.get("/wechatauth/get/store/info", {
        params: {
          id: this.$route.query.id
        }
      }).then(res => {
        console.log(res)
        if (res.data.result) {
          this.shopDetail = res.data.datas[0]
          console.log('商家资料', this.shopDetail)
        } else {
          this.$dialog.toast({
            mes: res.data.message
          })
        }

      })
    },
    HSrc: function (value) { // 头像
      let http = value.indexOf('http');
      if (http > -1) {
        return value
      } else {
        return this.HTTP + value
      }
    },
    loadList() { // 滚动加载
      this.axios.get('/wechatauth/store/comment', {
        params: {
          id: this.$route.query.id
        }
      }).then(res => {
        this.commendLists = res.data.datas;
        this.$dialog.loading.close()

        // let _list = res.data.datas.rows;
        // this.pageSize = res.data.datas.count
        // this.commendLists = [...this.commendLists, ..._list];
        // if (_list.length >= this.pageSize || this.page >= Math.ceil(this.pageSize / this.limit)) {
        //   /* 所有数据加载完毕 */
        //   this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
        //   return;
        // }

        /* 单次请求数据完毕 */
        this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
        this.page++;
      });
    },
    shareShop() { // 分享商家
      // 添加实例方法,微信分享
      setTimeout(() => {
        let that = this
        Vue.use(WechatPlugin)
        // let openid=localStorage.getItem('openid')
        let url = window.location.href
        that.axios.get('/wechatauth/auth/token', {
          params: {
            url: url
          }
        }).then(res => { // 获得签名配置
          var Data = res.data.datas;
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，
          that.$wechat.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wx246a6ae36dab8bd5', // 必填，公众号的唯一标识
            timestamp: Data.timestamp, // 必填，生成签名的时间戳
            nonceStr: Data.digit, // 必填，生成签名的随机串
            signature: Data.signature, // 必填，签名，见附录1
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
        })

        that.$wechat.ready(() => {
          console.log('产品数据', that.shopDetail)
          console.log('名字', that.shopDetail.b_name)
          // 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
          // 则可以直接调用，不需要放在ready函数中。
          that.link = window.location.href
          // console.log(that.link)
          var wxtitle = '亿货惠为您推荐商铺' + that.shopDetail.b_name + ',快来看看好货吧' // 标题
          var wximg = that.HTTP + that.shopDetail.b_img
          var wxlink = that.link
          var wxdesc = that.shopDetail.b_province + that.shopDetail.b_city + that.shopDetail.b_county + that.shopDetail.b_detail_address // 描述(分享给微信/QQ好友/微博时显示)
          that.$wechat.onMenuShareAppMessage({ // 分享给朋友
            title: wxtitle, // 分享标题
            desc: wxdesc, // 分享描述
            link: wxlink,
            imgUrl: wximg, // 分享图标
            // 用户确认分享后执行的回调函数
            success: function () {
              Toast({
                mes: "恭喜分享成功",
                timeout: 2000
              });
            },
            // 用户取消分享后执行的回调函数
            cancel: function () {
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
            success: function () {
              Toast({
                mes: "分享到朋友圈成功",
                timeout: 2000
              });
            },
            // 用户取消分享后执行的回调函数
            cancel: function () {
              Toast({
                mes: "分享到朋友圈取消",
                timeout: 2000
              });
            }
          });
        })
      }, 300);
    },

  },
  created() {
    this.attention()
    this.offline = this.$route.query.offline
    this.getShop()
    this.loadList()
  },
  mounted() {
    // this.axios.get("/business/info", {
    //   params: {
    //     id: this.$route.query.bId
    //   }
    // }).then(res => {
    //   if (res.data.result) {
    //     this.shopDetail = res.data.datas
    //     console.log('商家资料', this.shopDetail)
    //     this.shareShop()

    //   } else {
    //     this.$dialog.toast({
    //       mes: res.data.message
    //     })
    //   }

    // })
  }

}