/**
 * 首页 
 * @file home.js 
 * @author yangxia 
 * @date 2018-06-19 09:44:26 
 */

import Vue from 'vue'
import fixBottom from '@/components/fixBottom'
import Swiper from 'vux/src/components/swiper/swiper.vue'
import SwiperItem from 'vux/src/components/swiper/swiper-item.vue'
import WechatPlugin from "vux/src/plugins/wechat/index.js"
import {
    Popup
} from 'vue-ydui/dist/lib.px/popup'
import {
    InfiniteScroll
} from 'vue-ydui/dist/lib.px/infinitescroll'
import {
    ListTheme,
    ListItem
} from 'vue-ydui/dist/lib.px/list'
import 'vue-ydui/dist/ydui.base.css'
import {
    RollNotice,
    RollNoticeItem
} from 'vue-ydui/dist/lib.rem/rollnotice';
/* 使用px：import {RollNotice, RollNoticeItem} from 'vue-ydui/dist/lib.px/rollnotice'; */

Vue.component(RollNotice.name, RollNotice);
Vue.component(RollNoticeItem.name, RollNoticeItem);
Vue.component(Popup.name, Popup)
Vue.component(InfiniteScroll.name, InfiniteScroll)
Vue.component(ListTheme.name, ListTheme)
Vue.component(ListItem.name, ListItem)

export default {
    name: 'home',
    data() {
        return {
            classId: '',
            is_attention: 1, //是否关注
            show1: false, // 公众号二维码弹出框
            lists: [], // 首页轮播图
            days: [], // 每日推荐的内容
            list: [], // 一级分类轮播
            classSwiper: [], // 一级分类轮播
            homeClass: [], // 一级分类轮播
            shopList: [], // 一级分类轮播
            recommendList: [], // 推荐商品列表
            address: '', // 城市
            page: 1, // 滚动加载
            pageShop: 1,
            pageSize: 10,
            pageShopSize: 10,
            limit: 6,
            noticeList: [{
                    text: '1【开店有礼】热烈庆祝尚朴旗舰店正式开业'
                },
                {
                    text: '2【开店有礼】热烈庆祝尚朴旗舰店正式开业'
                },
                {
                    text: '3【开店有礼】热烈庆祝尚朴旗舰店正式开业'
                },
            ]
        }
    },
    components: {
        fixBottom,
        Swiper,
        SwiperItem,
    },
    methods: {
        goPage(value) { // 轮播图跳转
            if (value.url) {
                window.location.href = value.url
            }
        },
        // 添加实例方法,微信分享
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
        /**
         * 获取公告列表
         */
        getList() {
            this.axios.get('/wechatauth/announcement/list').then(res => {
                this.noticeList = res.data.datas;
            });
        },
        goRecharge() { // 跳转刷新页面
            window.location.href = '/activity/newRecharge'
        },
        goClassify(id) { // 点击一级分类调到对应分类页
            if (sessionStorage.getItem('classId')) {
                sessionStorage.removeItem('classId')
            }
            this.$router.push({
                path: "/classifyDetail/classify?id=" + id
            });
        },

        /**
         * 获取轮播图
         */
        goSwiperPage() {
            this.axios.get("/wechatauth/wechat/banner/all").then(res => {
                this.lists = res.data.datas;
                // this.lists.forEach(element => {
                //     if (element.bannerSrc.indexOf('https://hello1024.oss-cn-beijing.aliyuncs.com/' == -1)) {
                //         element.bannerSrc = 'https://hello1024.oss-cn-beijing.aliyuncs.com/' + element.bannerSrc;
                //     }
                // });
            })
        },
        /**
         * 获取首页推荐分类
         */
        getClassList() {
            this.axios.get('/wechatauth/get/recommend').then(res => {
                this.homeClass = res.data.datas;
            });
        },
        /**
         * 签到
         */
        qiandao() {
            this.axios.post('/wechatauth/user/signin').then(res => {
                this.$dialog.toast({
                    mes: res.data.message,
                    timeout: 1000
                });
            });
        },

        /**
         * 获取每日推荐
         */
        getDay() {
            this.$dialog.loading.open('加载中');
            this.axios.get("/wechatauth/goods/list", {
                params: {
                    limit: this.limit,
                    offset: 0,
                    isRecommend: 1,
                    goodsType: '',
                    // city: this.address
                }
            }).then(res => {
                this.$dialog.loading.close();
                this.days = res.data.datas.rows;
                this.days.forEach((item) => {
                    item.goodsImages = item.goodsImages.split(',')[0];
                });
            })
        },
        /**
         * 获取推荐店铺
         */
        getShopList() {
            this.$dialog.loading.open('加载中');
            this.axios.get("/wechatauth/isrecommend/store", {
                params: {
                    limit: this.limit,
                    offset: 0,
                    // city: this.address
                }
            }).then(res => {
                this.$dialog.loading.close();
                this.shopList = res.data.datas.rows;
            })
        },
        /**
         * 获得左侧分类列表信息
         */
        getLists() {
            this.axios.get('/wechatauth/goods/type/one').then(res => {
                this.classId = res.data.datas[0].id;
            })
        },
        /**
         * 滚动加载, 精品推荐
         */
        loadListGoods() {
            this.axios.get("/wechatauth/goods/list", {
                params: {
                    limit: this.limit,
                    offset: (this.page) * this.limit,
                    isRecommend: 1,
                    goodsType: '',
                    // city: this.address
                }
            }).then(res => {
                let _list = res.data.datas.rows;
                this.days = this.days.concat(_list);
                this.pageSize = res.data.datas.total;
                if (this.days.length >= this.pageSize || this.page >= Math.ceil(this.pageSize / this.limit)) {
                    /* 所有数据加载完毕 */
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                    return;
                }

                /* 单次请求数据完毕 */
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                this.page++;
            });
        },
        /**
         * 滚动加载, 精品推荐
         */
        loadListShop() {
            this.axios.get("/wechatauth/isrecommend/store", {
                params: {
                    limit: this.limit,
                    offset: (this.pageShop) * this.limit,
                    // city: this.address
                }
            }).then(res => {
                let list = res.data.datas.rows;
                this.shopList = this.shopList.concat(list);
                this.pageShopSize = res.data.datas.total;
                if (this.shopList.length >= this.pageShopSize || this.pageShop >= Math.ceil(this.pageShopSize / this.limit)) {
                    /* 所有数据加载完毕 */
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                    return;
                }

                /* 单次请求数据完毕 */
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                this.pageShop++;
            });
        },

        getUser() { // 获取用户信息
            this.axios.get('/wechatauth/user/info', {}).then(res => {
                if (res.data.result) {
                    this.user = res.data.datas;
                    this.share()
                }
            })
        }
    },
    created() {
        // this.address = localStorage.city ? localStorage.city : '南昌市';
        this.getShopList();
        this.getClassList();
        setTimeout(() => {
            this.getDay() // 获取每日优惠
            this.goSwiperPage() // 获取首页轮播
                // this.goList() // 获取一级分类
                // this.getRecommend() // 获取推荐
                // this.loadList()
            this.getUser()
        }, 300);

    },
    beforeCreate() { // 调取分享方法
        // this.SDKRegister(this, () => {
        //     console.log('首页调用分享')
        // })
    },
    mounted() {
        this.getLists();
        this.getList();
    },

}