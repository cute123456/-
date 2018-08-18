/**
 * 商品详情 
 * @file detail.js 
 * @author yangxia 
 * @date 2018-06-20 11:10:29 
 */
import Vue from 'vue'
import Swiper from 'vux/src/components/swiper/swiper.vue'
import SwiperItem from 'vux/src/components/swiper/swiper-item.vue'
import Cell from 'vux/src/components/cell/index.vue'
import Group from 'vux/src/components/group/index.vue'
import XNumber from 'vux/src/components/x-number/index.vue'
import XSwitch from 'vux/src/components/x-switch/index.vue'
import Divider from 'vux/src/components/divider/index.vue'
import Popup from 'vux/src/components/popup/index.vue'
import XButton from 'vux/src/components/x-button/index.vue'
import Checker from 'vux/src/components/checker/checker.vue'
import CheckerItem from 'vux/src/components/checker/checker-item.vue'
import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';

/* 使用px：import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.px/dialog'; */
import WechatPlugin from "vux/src/plugins/wechat/index.js"

import { Slider, SliderItem } from 'vue-ydui/dist/lib.rem/slider';
/* 使用px：import {Slider, SliderItem} from 'vue-ydui/dist/lib.px/slider'; */
Vue.component(Slider.name, Slider);

Vue.component(SliderItem.name, SliderItem);


Vue.prototype.$dialog = {
    toast: Toast,
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
};

export default {
    components: {
        Swiper,
        SwiperItem,
        Cell,
        XNumber,
        Group,
        XSwitch,
        Divider,
        Popup,
        XButton,
        Checker,
        CheckerItem,
    },
    data() {
        return {
            telDetail: '',
            showImg: true,
            openIndex: '',
            goodsDetail: '',
            id: '',
            message: '', // 留言
            is_attention: 1, // 是否关注了公众号，默认关注了
            show1: false,
            lists: [], // 轮播图
            money: '',
            data: { // 商品详情
                business: {}
            },
            commentList: '', // 评论列表
            popupVisible: false, // 弹出框
            isChoice: false, // 选择规格,已选择规格切换
            goodQuent: 1, //购物车里面商品对应的的数量
            quantity: 1, //商品数量
            model: {}, // 选择的规格
            oldMoney: '', // 原价
            model_id: '', // 选中的规格
            oldYnum: '', // 原易豆价,
            popBtn: 2, // 弹框底部按钮文字,默认立即下单
            shopCar: {},
            uid: localStorage.getItem('uid'), // 用户id
            offline: '', //是线下还是线上的商品，1代表线下，0 是线上
            isCollected: false, //是否收藏
        }
    },
    computed: {

        guigePrice() { // 规格价钱之和
            let temp = 0
            let specification = ""
            for (let i in this.model) {
                if (specification == "") {
                    specification = this.model[i]
                } else {
                    specification = specification + "," + this.model[i]
                }
                // if (this.model[i] != '') {
                //     temp = temp + parseFloat(this.model[i].ty_price)
                // }
            }
            for (let k in this.goodsDetail.specificationdetail) {
                if (this.goodsDetail.specificationdetail[k].specificationTitles == specification) {
                    // console.log(specification)
                    temp = parseFloat(this.goodsDetail.specificationdetail[k].goodsPrice)
                        // console.log(temp)
                    break;
                }
            }
            return parseFloat(temp).toFixed(2)
        },
        guigeNum() { // 选中的规格的数量
            let num = 0
            for (let i in this.model) {
                if (this.model[i] != '') {
                    num++
                }
            }
            return num
        },
        orderStorage: function() { // 要去下单的商品信息
            this.shopCar[this.data.business.id][this.data.id].quantity = this.quantity
            this.shopCar[this.data.business.id][this.data.id].model = this.model
            this.shopCar[this.data.business.id][this.data.id].uid = this.uid
            return this.shopCar
        },
    },
    methods: {
        imgScc(index) {
            this.showImg = false;
            this.openIndex = index + 1;
            // console.log(this.openIndex)
        },
        getPhone(phone) { // 获取加密电话号
            if (!phone) {
                return '载入中'
            } else {
                return phone.substring(0, 3) + '****' + phone.substring(7, 11)
            }
        },
        getDate(date) { // 获取年月日的日期
            if (!date) {
                return '载入中'
            } else {
                return date.split(' ')[0]
            }
        },
        getLength(length) { // 获取长度
            if (length > 0) {
                return true
            } else {
                return false
            }
        },
        close() { // 关闭规格弹窗
            this.popupVisible = false
            this.totalMoney()
        },
        changeSize() { // 切换规格
            this.totalMoney()
            this.isChoice = !this.isChoice
        },
        /**
         * 加减按钮加减数量
         */
        changeQuantity(num) { // 
            // if (this.goodsDetail.specification.length !== 0) {
            //     if (!this.isChoice) {
            //         this.$dialog.toast({ mes: '请选择规格' });
            //         return;
            //     }
            // }
            if (num > 0 && this.quantity < this.goodsDetail.goodsStocks) {
                this.quantity++;
            } else if (num > 0 && this.quantity >= this.goodsDetail.goodsStocks) {
                this.$dialog.toast({ mes: '库存不足' });
            } else {
                if (this.quantity > 1) {
                    this.quantity--;
                } else {
                    this.$dialog.toast({ mes: '数量不少于1' });
                    return;
                }
            }
            this.totalMoney()
        },
        totalMoney() { // 计算总价
            let money = this.goodsDetail.goodsPrice // 商品原始价
            if (this.goodsDetail.specification.length > 0) { // 如果有规格
                let single = parseInt(this.guigePrice);
                if (single != 0) {
                    this.money = parseInt(single * this.quantity).toFixed(2);
                }

            } else { // 如果无规格
                this.money = parseFloat(this.goodsDetail.goodsPrice * this.quantity).toFixed(2)
            }
            // console.log(money)
            // this.money = parseFloat(this.goodsDetail.goodsPrice * this.quantity).toFixed(2)
        },
        readShop() { // 读取本地购物车
            this.shopCar = JSON.parse(localStorage.getItem('shopCar'));
            if (!this.shopCar) { // 初始化对象
                return
            } else if (!this.shopCar[this.goodsDetail.shopId]) {
                return
            } else {
                if (this.shopCar[this.goodsDetail.shopId].goods[this.goodsDetail.id]) {
                    this.quantity = this.shopCar[this.goodsDetail.shopId].goods[this.goodsDetail.id].quantity
                }
            }

        },
        addShop() { // 加入购物车
            if (this.goodsDetail.goodsStocks <= 0) {
                this.$dialog.toast({ mes: '库存不足' });
                return;
            }
            let tempCar = JSON.parse(localStorage.getItem('shopCar'));
            if (!tempCar) {
                tempCar = {}
            }
            if (!tempCar[this.goodsDetail.shopId]) { //shopCar下标为店铺id,里面放置店铺名和商品对象
                tempCar[this.goodsDetail.shopId] = {
                    name: this.goodsDetail.shopName,
                    goods: {}
                }
            }
            tempCar[this.goodsDetail.shopId].goods[this.goodsDetail.id] = { // 商品对象
                businessId: this.goodsDetail.shopId,
                id: this.goodsDetail.id,
                quantity: this.quantity,
                model: this.model,
                price: this.money
            }
            localStorage.setItem('shopCar', JSON.stringify(tempCar));
            this.$dialog.toast({ mes: '添加成功', timeout: 1500 });
            this.close()
        },
        // 下单加入购物车
        appointment() {
            if (this.goodsDetail.goodsStocks <= 0) {
                this.$dialog.toast({ mes: '库存不足' });
                return;
            }
            // if (this.goodsDetail.specification.length !== 0) {
            //     if (!this.isChoice) {
            //         this.$dialog.toast({ mes: '请选择规格' });
            //         return;
            //     }
            // }
            let arr = [] // 规格长度
            this.goodsDetail.specification.forEach(value => {
                if (value.specificationNames.length > 0) {
                    arr.push(1)
                }
            })
            if (this.goodsDetail.specification.length > 0 && this.guigeNum < arr.length) {
                this.$dialog.toast({ mes: '请选择规格', timeout: 1500 });
                return
            }
            if (this.popBtn != 1) { // 立即下单
                let temp = {}
                temp[this.goodsDetail.shopId] = {}
                temp[this.goodsDetail.shopId][this.goodsDetail.id] = this.goodsDetail;
                temp[this.goodsDetail.shopId][this.goodsDetail.id].quantity = this.quantity; //商品数量
                temp[this.goodsDetail.shopId][this.goodsDetail.id].model = this.model
                    // temp[this.goodsDetail.shopId][this.goodsDetail.id]['quantity'] = 1; //商品数量
                this.axios.post('/wechatauth/order/generate', {
                    orders: temp
                }).then(res => {
                    if (res) {
                        this.$router.push('/shopCar/settlement?orderId=' + res.data.datas)
                    } else {
                        // this.$dialog.toast({ mes: res.data.message });
                    }
                })

            } else if (this.popBtn == 1) { // 加入购物车
                this.addShop()
            }
        },
        HSrc(value) { // 头像
            let http = value.indexOf('http');
            if (http > -1) {
                return value
            } else {
                return this.HTTP + value
            }
        },
        /**
         * 获取收藏状态
         */
        getCollectStatus() {
            this.axios.get('/collect/is', {
                params: {
                    c_uid: localStorage.getItem('uid'),
                    c_gid: this.$route.query.id
                }
            }).then(res => {
                if (res.data.result) {
                    if (res.data.datas == -1) {
                        this.collectFlag = 0
                    } else {
                        this.collectFlag = 1
                    }
                } else {
                    this.$dialog.toast({ mes: res.data.message, timeout: 1000 })
                }
            })
        },
        /**
         * 收藏与取消收藏
         */
        collect() {
            this.axios.post('/wechatauth/goods/collection/add', {
                id: this.id
            }).then(res => {
                this.isCollected = !this.isCollected;
            });
        },
        /**
         * 获取商品详情
         */
        getGoodsDetail() {
            this.$dialog.loading.open('加载中');
            this.axios.get('/wechatauth/goods/detail', {
                params: {
                    id: this.id
                }
            }).then(res => {
                this.$dialog.loading.close();
                // console.log(res.data.datas);
                this.goodsDetail = res.data.datas;
                localStorage.setItem('goodsDetail', this.goodsDetail);
                let imgs = this.goodsDetail.goodsImages.split(',');
                this.goodsDetail.imgs = imgs;
                this.money = parseInt(this.goodsDetail.goodsPrice).toFixed(2);
                this.isCollected = this.goodsDetail.isCollected

                this.goodsDetail.goodsDetail = this.goodsDetail.goodsDetail.replace(/<img/g, '<img style="max-width:100%;height:auto" ') //防止富文本图片过大
                this.shareGoods(res.data.datas);

            });
            this.axios.get('/wechatauth/get/store/introduction').then(res => {
                this.telDetail = res.data.datas[0].introductionMobile;
                console.log("tel", res.data.datas[0].introductionMobile)
            })
        },


        // getAbout() { // 获取关于我们
        //     this.axios.get('/wechatauth/get/store/introduction').then(res => {
        //         if (res.data.result) {
        //             this.infos = res.data.datas[0];
        //         } else {
        //             this.$dialog.toast({ mes: res.data.message, timeout: 400 });
        //         }
        //     })
        // },



        /**
         * 获取用户评论数量
         */
        getComment() {
            this.axios.get('/wechatauth/goods/comment', {
                params: {
                    id: this.$route.query.id,
                    offset: 0,
                    limit: 10
                }
            }).then(res => {
                this.commentList = res.data.datas.total;
            })
        },
        getUser() { // 获取用户信息
            this.axios.get('/wechatauth/user/info', {}).then(res => {
                if (res.data.result) {
                    this.user = res.data.datas;
                }
            })
        },
        // 添加实例方法,微信分享
        shareGoods(goodsDetail) {
            setTimeout(() => {
                let that = this
                Vue.use(WechatPlugin)
                    // let openid=localStorage.getItem('openid')
                let url = window.location.href
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
                    console.log(goodsDetail)
                        // 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
                        // 则可以直接调用，不需要放在ready函数中。
                    that.link = 'http://shop.anasit.com/my/shareConfirm?uid=' + 59;
                    // console.log(that.link)
                    var wxtitle = '我在百业衍升爆品商城淘到了' + goodsDetail.goodsName + '你也快来看看吧' // 标题
                    var wximg = that.HTTP + goodsDetail.goodsThumb
                    var wxlink = that.link
                    var wxdesc = '超划算' + goodsDetail.goodsName // 描述(分享给微信/QQ好友/微博时显示)
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
            }, 300);
        },
    },
    created() {
        this.id = this.$route.query.id;
        this.getGoodsDetail();
        this.getComment();
        // this.getCollectStatus() // 获取商品收藏状态
    },
}