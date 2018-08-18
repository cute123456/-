import Vue from 'vue'
import navHead from '@/components/navHead'
import { MessageBox } from 'mint-ui'
import { InfiniteScroll } from 'vue-ydui/dist/lib.px/infinitescroll'
import { ListTheme, ListItem } from 'vue-ydui/dist/lib.px/list'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.component(InfiniteScroll.name, InfiniteScroll)
Vue.component(ListTheme.name, ListTheme)
Vue.component(ListItem.name, ListItem)

export default {
    name: 'order',
    data() {
        return {
            Flag: '', // tab栏激活
            orderLists: [], // 订单列表
            menu: // tab栏状态
                [
                { id: -3, name: "全部" },
                { id: 0, name: "待支付" },
                { id: 1, name: "待发货" },
                { id: 2, name: "待收货" },
                { id: 4, name: "已完成" },
                { id: 5, name: "售后 | 退款" }
            ],
            leftNum: 0,
            limit: 10,
            page: 1,
            pageSize: 10,
        }
    },
    components: {
        navHead,
    },
    methods: {
        goPage(orders) {
            window.location.href = '/shopCar/paymentDesk?orderId=' + orders.id
        },
        getLength(data) {
            if (!data) {
                return '载入中'
            } else if (data.length <= 0) {
                return false
            } else {
                return true
            }
        },
        loadList(i) {
            this.axios.get("/wechatauth/order/list", {
                params: {
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit,
                    status: this.Flag
                }
            }).then(res => {
                console.log('order', this.Flag)
                this.$dialog.loading.close();
                const _list = res.data.datas.rows;
                this.pageSize = res.data.datas.count;
                this.orderLists = [...this.orderLists, ..._list];
                if (_list.length >= this.pageSize || this.page >= Math.ceil(this.pageSize / this.limit)) {
                    /* 所有数据加载完毕 */
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                    return;
                }
                /* 单次请求数据完毕 */
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                this.page++;
            });
            if (i == 5) {
                this.axios.get('/wechatauth/order/list', {
                    params: {
                        limit: this.limit,
                        offset: (this.page - 1) * this.limit,
                        status: 6
                    }
                }).then(res => {
                    this.pageSize = res.data.datas.count + this.pageSize;
                    this.orderLists = this.orderLists.concat(res.data.datas.rows);
                });
            }
        },
        confirmGoods(orders) { //确认收货
            this.axios.put('/order/status', {
                order_id: orders.id,
                status: orders.o_status
            }).then(res => {
                this.page = 1
                this.orderLists = []
                this.loadList()
                if (res.data.result) {
                    this.$dialog.toast({ mes: '确认收货完成', timeout: 1000 });
                } else {
                    this.$dialog.toast({ mes: res.data.message, timeout: 1000 });
                }
            })
        },
        changeOrder(i, index) { // 切换tab栏
            this.$dialog.loading.open();
            if (index > 2) {
                this.leftNum = -20 - index * 15
            } else {
                this.leftNum = 0
            }
            this.Flag = i;
            this.page = 1;
            this.pageSize = 10
            this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
            this.orderLists = []
            this.loadList(i)

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
            this.axios.put('/wechatauth/delete/order', {
                // params: {
                id: order.id
                    // }
            }).then(res => {
                // console.log(res)
                if (res.data.result) {

                    this.$dialog.toast({ mes: '删除订单成功', timeout: 1000 });
                    //删除页面上的订单
                    var _index = this.orderLists.indexOf(order);
                    this.orderLists.splice(_index, 1);
                } else {
                    this.$dialog.toast({ mes: res.data.message, timeout: 1000 });
                }
            });
        },
    },
    mounted() {
        this.$nextTick(() => {
            // this.$dialog.loading.open();
            if (this.$route.query.orderId) { // 获取指定状态订单
                this.Flag = this.$route.query.orderId;
                if (this.Flag > 2) {
                    this.leftNum = -20 - this.Flag * 15
                }
            } else { //获取全部订单,-3代表全部订单
                this.Flag = -3
            }
            this.loadList(this.Flag);
        })
    }
}