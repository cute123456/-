import Vue from 'vue'
import navHead from '@/components/navHead';
import { MessageBox } from 'mint-ui';
import WechatPlugin from "vux/src/plugins/wechat/index.js"


export default {
    data() {
        return {
            orderId: '',
            orderInfos: [], //订单详情
            isBusiness: '', //是不是商家
            // totalMoney:0,//总支付钱
            // totalYmoney:0, // 总需要易豆数
            joinYgoods: [], //是否参加易货，1参加易货，0不参加既不让用易豆支付
            joinFlag: false, //
            afterSale: ''
        }
    },
    components: {
        navHead
    },
    methods: {
        goPge(infos) {
            window.location.href = '/shopCar/paymentDesk?orderId=' + infos.id
        },
        cancelOrder(order) { // 取消订单弹框
            MessageBox.confirm('是否取消此订单?').then(confirm => {
                this.del(order)
            })
        },
        delOrder(order) { //删除订单弹框
            MessageBox.confirm('是否删除此订单?').then(confirm => {
                this.del(order)
            })
        },
        del(order) { //删除订单
            this.axios.delete('/wechatauth/order/del', {
                params: {
                    id: order.id
                }
            }).then(res => {
                if (res.data.result) {
                    this.$dialog.toast({ mes: res.data.message, timeout: 1000 });
                    this.orderInfos.pop()
                    this.$router.push('/my/order')
                }
            });
        },
        getOrderInfo() {
            this.axios.get('/wechatauth/order/info', {
                params: { // 获取订单详情
                    id: this.orderId
                }
            }).then(res => {
                if (res.data.result) {
                    this.orderInfos.push(res.data.datas);
                    if (res.data.datas[this.orderId].business.aftersale.length > 0) {
                        this.afterSale = res.data.datas[this.orderId].business.aftersale[0]
                        console.log(this.afterSale)

                    }
                } else {
                    this.$dialog.toast({ mes: res.data.message, timeout: 2000 });
                }

                // this.$set(this.infos, 0 , res.data.datas)
            })
        },
        confirmSend(infos) { // 确认发货
            this.axios.post('/order/confirm/delivery', {
                id: infos.id,
                openid: localStorage.getItem('openid')
            }).then(res => {
                // console.log(res.data)
                if (res.data.result) {
                    this.$dialog.toast({ mes: '确认发货完成', timeout: 1000 });
                    this.orderInfos = []
                    this.getOrderInfo()

                    // this.$router.push('/')
                } else {
                    this.$dialog.toast({ mes: res.data.message, timeout: 1000 });
                }
            })
        },
        confirmGoods(infos) { //确认收货
            this.axios.put('/wechatauth/order/status/update', {
                id: this.orderId,
                status: 3
            }).then(res => {
                // console.log(res.data)
                if (res.data.result) {
                    this.$dialog.toast({ mes: '确认收货完成', timeout: 1000 });
                    this.orderInfos = []
                    this.getOrderInfo()
                } else {
                    this.$dialog.toast({ mes: res.data.message, timeout: 1000 });
                }
            })
        },
    },
    created() {
        this.orderId = this.$route.query.orderId
            // this.isBusiness = this.$route.query.isBusiness
        this.getOrderInfo()
    }
}