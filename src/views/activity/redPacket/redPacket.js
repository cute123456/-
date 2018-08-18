import Vue from 'vue'
import navHead from '@/components/navHead';
import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
/* 使用px：import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.px/dialog'; */

Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
};


export default {
    data() {
        return {
            rid: 1,
            payLogId: 226,
            message: {
                logo: '/static/imgs/mined.png',
                text: '百业衍升商城 现金大红包',
                money: '10.23',
            },
            cashList: [{
                num: '40',
                content: '消费满199元即可领取',
                date: '2018.7.02-2018.8.02',
            },
            {
                num: '40',
                content: '消费满199元即可领取',
                date: '2018.7.02-2018.8.02',
            }
            ],
            popupList: {
                logo: '/static/imgs/mined.png',
                name: '百业衍升',
                text: '发了一个现金红包，价值连城',
                content: '消费满199元，即有现金大红包领取！',
            },
            isOpen: false,
            money: '',
            cid: '',
            status: 1,

        }
    },
    components: {
        navHead
    },
    methods: {
        open() {
            this.isOpen = !this.isOpen;
            /** 获取rid
                   */
            this.axios.get('/wechatauth/redenvelopes/get').then(res => {
                this.rid = res.data.datas.id;
                console.log("a",this.rid);
               
            });

              /** 获取开红包
                   */
            this.axios.post('/wechatauth/redenvelopes/open', {
                rid: this.rid,
                payLogId: 226

            }).then((res) => {
                this.money = res.data.datas.replace('恭喜你获得了', "");
                this.money = this.money.replace('元的红包奖励', "");
                console.log(this.money);
                console.log(res);
            });


        },



        /** 获取优惠券列表
         */
        getCouponList() {
            this.axios.get('/wechatauth/coupon/get').then(res => {
                this.cashList = res.data.datas;
                this.cashList.forEach(element => {
                    element.couponName = element.couponName.replace('元代金券', "");
                    element.expiredTime = element.expiredTime.slice(0, 10);
                    element.startTime = element.startTime.slice(0, 10);
                });
            })
        },
        /** 领取优惠券
         */
        getCash(cid) {
            this.axios.get('/wechatauth/user/coupon/add', {
                params: {
                    cid: cid
                }
            }).then(res => {
                this.$dialog.toast({
                    mes: res.data.message,
                    timeout: 1000
                });
            })
        }
    },

    created() {
        this.getCouponList();
    },
}