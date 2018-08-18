import Vue from 'vue'
import NavHead from '@/components/navHead';
import { Loadmore } from 'mint-ui';
import { Toast } from 'vue-ydui/dist/lib.px/dialog';
import { Button, ButtonGroup } from 'vue-ydui/dist/lib.px/button';
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.component(Button.name, Button);
Vue.component(ButtonGroup.name, ButtonGroup);

Vue.component(Loadmore.name, Loadmore)
Vue.prototype.$dialog = {
    toast: Toast,
};

export default {
    data() {
        return {
            page: 1, // 滚动加载
            pageSize: 0,
            limit: 10,
            balanceList: [{
                    name: '消费支出',
                    time: '2017-12-14',
                    price: '800.00',
                    change: '50.00'
                },
                {
                    name: '消费支出',
                    time: '2017-12-14',
                    price: '800.00',
                    change: '50.00'
                }
            ],
            user: {
                balance: 0
            },
            countAll: {}, // 统计数据
            moneys: [], // 明细
            offset: 0,
            limit: 10,
            no_message: false,
            pageNo: 1,
            bottomText: '',
            totalPage: '',
            allLoad: false,
            hidden: false,
        }
    },
    components: {
        NavHead
    },
    methods: {
        goPage(num) {
            if (num == 1) {
                window.location.href = "/activity/rechargeMoney"
            }
            if (num == 2) {
                this.$router.push('/my/backMoney')
            }
        },
        //获取余额详情
        getDetail() {
            this.axios.get("/wechatauth/integral/detail/search", {
                params: {
                    limit: this.limit,
                    offset: 0
                }
            }).then(res => {
                this.balanceList = res.data.rows;
                this.pageSize = res.data.total;
                this.balanceList.forEach(item => {
                    item.createdAt = item.createdAt.slice(0, 10);
                })
            })
        },
        /**
         * 滚动加载
         */
        loadList() {
            this.axios.get("/wechatauth/balance/detail/search", {
                params: {
                    limit: 10,
                    offset: (this.page) * this.limit,
                }
            }).then(res => {
                this.$dialog.loading.close()
                let _list = res.data.rows;
                this.pageSize = res.data.total
                this.balanceList = [...this.balanceList, ..._list];
                if (_list.length >= this.pageSize || this.page >= Math.ceil(this.pageSize / this.limit)) {
                    /* 所有数据加载完毕 */
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                    return;
                }

                /* 单次请求数据完毕 */
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                this.page++;
            });
        },
        getUser() { // 获取用户信息
            this.axios.get('/wechatauth/user/info').then(res => {
                if (res.data.result) {
                    this.user = res.data.datas;
                }
            })
        },
        getCount() { // 获取用户的统计数据
            // this.axios.get('/user/statistics', {
            //     params: {
            //         openid: localStorage.getItem('openid')
            //     }
            // }).then(res => {
            //     if (res.data.result) {
            //         this.countAll = res.data.datas.balance
            //     } else {
            //         this.$dialog.toast({ mes: res.data.message, timeout: 1000 });
            //     }
            // })
        }

    },
    created() {
        this.getDetail()
        this.getUser()
        this.getCount() // 获取用户的统计数据
    }
}