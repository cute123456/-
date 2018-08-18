import Vue from 'vue'
import NavHead from '@/components/navHead'
import { Toast } from 'vue-ydui/dist/lib.px/dialog'
import { InfiniteScroll } from 'vue-ydui/dist/lib.px/infinitescroll'
import { ListTheme, ListItem } from 'vue-ydui/dist/lib.px/list'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

import 'vue-ydui/dist/ydui.base.css'

Vue.component(InfiniteScroll.name, InfiniteScroll)
Vue.component(ListTheme.name, ListTheme)
Vue.component(ListItem.name, ListItem)



export default {
    data() {
        return {
            commendLists: [], // 评论列表
            // img: "http://img0.imgtn.bdimg.com/it/u=3880133255,4090820197&fm=214&gp=0.jpg",
            page: 0, // 滚动加载
            pageSize: 10,
            limit: 10,
            offset: 0
        }
    },
    components: {
        NavHead,
        Toast,
    },
    methods: {
        HSrc: function(value) { // 头像
            let http = value.indexOf('http');
            if (http > -1) {
                return value
            } else {
                return this.HTTP + value
            }
        },
        /**
         * 获取评论列表
         */
        getCommentList() {
            this.axios.get("/wechatauth/goods/comment", {
                params: {
                    id: this.$route.query.id,
                    offset: this.offset,
                    limit: this.limit
                }
            }).then(res => {
                this.commendLists = res.data.datas;
            });
        },
        loadList() { // 滚动加载
            this.axios.get("/wechatauth/goods/comment", {
                params: {
                    id: this.$route.query.id,
                    offset: this.limit * this.page,
                    limit: this.limit
                }
            }).then(res => {
                let _list = res.data.datas.rows;
                this.pageSize = res.data.datas.total
                this.commendLists = [...this.commendLists, ..._list];
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

    },
    mounted() {},
    created() {
        this.loadList(); //获取商品评论列表
    },
    // beforeRouteEnter(to, from, next) {
    //     next(vm => {
    //         vm.axios.post("/qrcode/share/generate", { openid: localStorage.getItem("openid")}).then((res) => {
    //             if (res.data.result) {
    //                 vm.shareImgData = res.data.datas.share_img
    //                 vm.shareUrl = res.data.datas.share_url
    //             }
    //         });
    //     });
    // },
    beforeCreate() {
        // this.SDKRegister(this, ()=>{
        //     console.log('首页调用分享')
        // })
    },
}