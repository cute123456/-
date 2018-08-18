import Vue from 'vue'
import NavHead from '@/components/navHead';
import { Loadmore } from 'mint-ui';
import { Toast } from 'vue-ydui/dist/lib.px/dialog';
import { Button, ButtonGroup } from 'vue-ydui/dist/lib.px/button';

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
            pageSize: 10,
            limit: 10,
            balanceList:[],
            user: {
                balance: 0
            },
            redenvelope:null,
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
            this.axios.get("/wechatauth/user/redenvelopes/log/get", {
                params: {
                    limit: this.limit,
                    offset: 0
                }
            }).then(res => {
                // console.log(res);
                this.balanceList = res.data.datas;
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
        getRed() { // 获取红包信息
            this.axios.get('/wechatauth/user/redenvelopes/get').then(res => {
                if (res.data.result) {
                    // this.user = res.data.datas;
                    this.redenvelope = res.data.datas;
                }
            })
        },

    },
    created() {
        this.getDetail()
        this.getRed()
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
}