import Vue from 'vue'
import navHead from '@/components/navHead';
import { MessageBox } from 'mint-ui';
import WechatPlugin from "vux/src/plugins/wechat/index.js"
import { InfiniteScroll } from 'vue-ydui/dist/lib.px/infinitescroll'
import { ListTheme, ListItem } from 'vue-ydui/dist/lib.px/list'
import 'vue-ydui/dist/ydui.base.css'

Vue.component(InfiniteScroll.name, InfiniteScroll)
Vue.component(ListTheme.name, ListTheme)
Vue.component(ListItem.name, ListItem)

export default {
    name: 'order',
    data() {
        return {
            Flag: '', // tab栏激活
            collectLists: [], // 订单列表
            img: "http://img0.imgtn.bdimg.com/it/u=3880133255,4090820197&fm=214&gp=0.jpg",
            menu: [ // tab栏状态
                { id: -1, name: "全部订单" },
                { id: 1, name: "待确认" },
                { id: 3, name: "已完成" }
            ],
            limit: 10,
            page: 1,
            pageSize: 10,

        }
    },
    components: {
        navHead
    },
    methods: {
        getLength(data) {
            if (!data) {
                return '载入中'
            } else if (data.length <= 0) {
                return false
            } else {
                return true
            }
        },
        loadList() {
            this.axios.get('/wechatauth/get/collection/goods', {
                params: {
                    offset: (this.page - 1) * this.limit,
                    limit: this.limit,
                    c_uid: localStorage.getItem('uid'),
                }
            }).then(res => {
                // console.log('收藏列表',res.data)
                this.$dialog.loading.close();
                const _list = res.data.datas.rows;
                this.pageSize = res.data.datas.total
                this.collectLists = [...this.collectLists, ..._list];
                console.log('coll', this.collectLists)

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
        // delOrder(order) { //删除订单弹框
        //     MessageBox.confirm('是否删除此订单?').then(confirm => {
        //         this.del(order)
        //     })
        // },
        // del(order) { //删除订单
        //     this.axios.delete('/wechatauth/goods/collection/delete', {
        //         params: {
        //             id: order.id
        //         }
        //     }).then(res => {
        //         if (res.data.result) {
        //             this.$dialog.toast({ mes: res.data.message, timeout: 1000 });
        //         }
        //         //删除页面上的订单
        //         var _index = this.collectLists.indexOf(order);
        //         this.collectLists.splice(_index, 1);

        //     });
        // },
        HSrc: function(value) { // 头像
            let http = value.indexOf('http');
            if (http > -1) {
                return value
            } else {
                return this.HTTP + value
            }
        },
    },
    mounted() {
        this.$nextTick(function() {
            this.Flag = -1
                // this.$dialog.loading.open();
            this.loadList();
        })

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
    beforeCreate() {
        this.SDKRegister(this, () => {
            console.log('首页调用分享')
        })
    },


}