/**
 * 代金券 
 * @file coupon.js 
 * @author yangxia 
 * @date 2018-07-05
 */
import Vue from 'vue'
import { Toast } from 'vue-ydui/dist/lib.px/dialog'
import WechatPlugin from "vux/src/plugins/wechat/index.js"
import navHead from '@/components/navHead'

Vue.prototype.$dialog = {
    Toast
};


export default {
    components: {
        navHead,
    },
    data() {
        return {
            tabIndex: 1,
            limit: 10,
            offset: 0,
            page: 1,
            pageShopSize: 0,
            totalA: 0,
            totalB: 0,
            list: [{
                    money: 40,
                    fullMoney: 199,
                    start: '2018.7.02',
                    end: '2018.8.02'
                },
                {
                    money: 20,
                    fullMoney: 160,
                    start: '2018.7.02',
                    end: '2018.8.02'
                },
                {
                    money: 60,
                    fullMoney: 299,
                    start: '2018.7.02',
                    end: '2018.8.02'
                },
                {
                    money: 10,
                    fullMoney: 99,
                    start: '2018.7.02',
                    end: '2018.8.02'
                },
            ],
            listUsed: [{
                    money: 40,
                    fullMoney: 199,
                    start: '2018.7.02',
                },
                {
                    money: 60,
                    fullMoney: 299,
                    start: '2018.7.02',
                },
                {
                    money: 10,
                    fullMoney: 99,
                    start: '2018.7.02',
                },
            ],
            isFrompay: false
        }
    },
    methods: {
        /**
         * 滚动加载, 精品推荐
         */
        loadLoading() {
            this.axios.get("/wechatauth/user/coupon/get", {
                params: {
                    limit: this.limit,
                    offset: (this.page) * this.limit,
                }
            }).then(res => {
                let list = res.data.datas.rows;
                let listA, listB;
                // 未使用的代金券列表
                listA = list.filter((value) => value.status === 0);
                listA.forEach(item => {
                    item.couponName = item.couponName.replace('元代金券', '');
                });
                this.list = this.list.concat(listA);

                // 已使用的代金券列表
                listB = list.filter((value) => value.status === 1);
                listB.forEach(item => {
                    item.couponName = item.couponName.replace('元代金券', '');
                });
                this.listUsed = this.listUsed.concat(listB);
                if (this.list.length >= this.totalA || this.listUsed.length >= this.totalB || this.page >= Math.ceil(this.totalB / this.limit) || this.page >= Math.ceil(this.totalA / this.limit)) {
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
         * 获取我的代金券
         */
        getMyCard() {
            this.axios.get('/wechatauth/user/coupon/get', {
                params: {
                    limit: this.limit,
                    offset: this.offset,
                }
            }).then(res => {
                if (res.data.result) {
                    let temp = res.data.datas.rows;
                    this.list = temp.filter((value) => value.status === 0);
                    this.list.forEach(item => {
                        item.couponName = item.couponName.replace('元代金券', '');
                    });
                    this.listUsed = temp.filter((value) => value.status === 1);
                    this.listUsed.forEach(item => {
                        item.couponName = item.couponName.replace('元代金券', '');
                    });
                }
            });
        },
        /**
         * 获取已使用和未使用代金券总数目
         */
        getTotal() {
            this.axios.get('/wechatauth/user/coupon/get', {
                params: {
                    limit: 100,
                    offset: this.offset,
                }
            }).then(res => {
                if (res.data.result) {
                    let temp = res.data.datas.rows;
                    this.totalA = temp.filter((value) => value.status === 0).length;
                    this.totalB = temp.filter((value) => value.status === 1).length;
                }
            });
        },
        toUse(id) {
            if (this.isFrompay) {
                this.$router.push('/shopCar/paymentDesk?orderId=' + this.$route.query.orderId + '&couponid=' + id)
            }
        }
    },
    created() {
        this.getTotal();
        this.getMyCard();
        if (this.$route.query.frompage === 'paymentDesk') {
            this.isFrompay = true
        } else {
            this.isFrompay = false
        }
    },
}