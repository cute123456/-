import Vue from 'vue';
import Popup from 'vux/src/components/popup/index.vue';
import {
    Button
} from 'vue-ydui/dist/lib.px/button';
import {
    Toast
} from 'vue-ydui/dist/lib.px/dialog';
import {
    Radio,
    RadioGroup
} from 'vue-ydui/dist/lib.rem/radio';

import WechatPlugin from "vux/src/plugins/wechat/index.js";

Vue.prototype.$dialog = {
    toast: Toast,
};
Vue.component(Button.name, Button);
Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);

export default {
    data: function() {
        return {
            is_attention: 1, // 是否关注了公众号，默认关注了
            show1: false,
            showPayMethods: false,
            activeName: '微信支付',
            orderId: [], // 获取的订单id
            orderDatas: [],
            orderInfo: {},
            total: '', // 地址列表总数
            addressList: '', // 地址列表数据
            orderPhone: '',
            orderLinker: '',
            wechatInfo: '',
            hasAddressFlag: '', //有地址的标志,默认显示默认地址，解决闪现
            level: '',
            discountPrice: '',
            discountFlag: false,
            balance: '',
            message: '', // 留言
            activeModel: [], // 商品选中的规格
            uid: localStorage.getItem('uid'), //用户id
            services: [], // 服务
            totalYmoney: 0, // 总需要易豆数
            method: [], //检测店铺的服务方式是否存在到店方式
            joinYgoods: [], //是否参加易货，1参加易货，0不参加既不让用易豆支付
            joinFlag: false,
            shopId: '',
            distribution: [], // 配送
            distributionList: [], // 配送模板列表
            templeSelect: '',
            freightList: [], //运费列表
            freightNum: 0,
            templateId: '',
            province: '',
            selected: 0,
            isDefaultList: [], //是否默认
            smallPlan: '',
            disShop: [],
            showWay: '',
            totalPrice: 0,
            freight: ''
        }
    },
    components: {
        Popup
    },
    mounted: function() {
        this.$nextTick(function() {
            // 判断用户是否绑定手机
            this.bindMobile(this.$route.fullPath);
            console.log(this.$route);
            this.getAddress().then(() => {
                this.getOrderInfo(); //获取订单详情
            })
        })
    },
    filters: {
        formatMoney: function(value) {
            if (typeof value == "number") {
                return "￥" + value.toFixed(2);
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
        goPay() { // 提交订单
            if (!this.addressList) {
                this.$dialog.toast({
                    mes: '请填写地址',
                    timeout: 2000
                });
                return;
            }
            // if (this.is_attention != 1) { // 没有关注公众号
            //     this.show1 = true
            //     return
            // }
            var ordersInfo = [];
            for (var key in this.orderDatas) {
                ordersInfo.push({
                    address: this.addressList.reapProvince + this.addressList.reapCity + this.addressList.reapCounty + this.addressList.detailAddress,
                    orderIds: this.orderDatas[key].id,
                    consignee: this.addressList.consignee,
                    mobile: this.addressList.reapMobile + "",
                    remark: this.orderDatas[key].message,
                    logisticTemplate: this.orderDatas[key].freight.id
                })
            }
            this.axios.put('/wechatauth/order/update', {
                ordersInfo: JSON.stringify(ordersInfo)
            }).then(res => {
                if (res.data.result) {
                    // this.$dialog.loading.open('加载中,请稍候~')
                    window.location.href = '/shopCar/paymentDesk?orderId=' + this.$route.query.orderId
                } else {
                    this.$dialog.toast({
                        mes: res.data.message
                    });
                }
                console.log('pay', res)
            })
        },
        getOrderInfo() { // 获取订单详情
            this.axios.get('/wechatauth/order/info', {
                params: {
                    id: this.$route.query.orderId
                }
            }).then(res => {
                for (var key in res.data.datas) {
                    let element = res.data.datas[key];
                    element.message = "";
                    (() => {
                        element.business.template.forEach((v, index) => {
                            if (v.isDefault == 1) {
                                element.selected = index;
                                this.getFreight(v.id, element);
                                return false;
                            }
                        });
                    })(element);
                }
                this.orderDatas = res.data.datas;
            });
        },
        goSelectAddress() { // 选择地址
            this.$router.push('/my/selectAddress?orderId=' + this.$route.query.orderId);
        },
        getAddress() { // 获取地址
            return new Promise(resolve => {
                if (this.$route.query.addressId) { // 检测到从选择地址页来的，就获取该地址详情
                    this.axios.get('/wechatauth/user/address/detail', {
                        params: {
                            id: this.$route.query.addressId
                        }
                    }).then(res => {
                        this.addressList = res.data.datas;
                        this.province = this.addressList.reapProvince;
                        resolve();
                    })
                } else {
                    this.axios.get('/wechatauth/user/address/default', { // 获取默认地址
                    }).then(res => {
                        this.addressList = res.data.datas;
                        resolve();
                    })
                }
            })
        },
        /**
         * 获取运费
         */
        getFreight(templateId, shop) {
            this.axios.get('/wechatauth/order/logistic/freight', {
                params: {
                    templateId: templateId,
                    province: this.province,
                }
            }).then(res => {
                shop.freight = res.data.datas;
                shop.totalPrice = parseFloat(shop.freight.freight);
                shop.business.orderGoods.forEach(v => {
                    shop.totalPrice += parseFloat(v.goodsPrice);
                });
                shop.totalPrice.toFixed(2); // 保留两位小数
                // this.goPay(templateId, shop.totalPrice);
            });
        },
        /**
         * 弹出运费模板选择
         */
        showPopup(shop) {
            this.$forceUpdate()
            this.$set(shop, 'showWay', true);
            console.log(shop.showWay)
            this.$forceUpdate()
        },
        /**
         * 选择配送方式重新查运费
         */
        templateChange(shop) {
            this.getFreight(shop.business.template[shop.selected].id, shop);
        }
    },
    watch: {
        orderDatas: {
            handler() {
                let totalPrice = 0;
                for (var key in this.orderDatas) {
                    totalPrice += parseFloat(this.orderDatas[key].totalPrice);
                }
                this.totalPrice = totalPrice;
            },
            deep: true
        }
    }
}