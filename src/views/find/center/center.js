/**
 * 发现 
 * @file center.js 
 * @author kun 
 * @date 2018-06-28 09:44:26 
 */
import Vue from 'vue';
import fixBottom from '@/components/fixBottom';
import WechatPlugin from "vux/src/plugins/wechat/index.js"
import { Popup } from 'vue-ydui/dist/lib.px/popup';
import navHead from '@/components/navHead';
import { InfiniteScroll } from 'vue-ydui/dist/lib.px/infinitescroll'

Vue.component(Popup.name, Popup);
Vue.component(InfiniteScroll.name, InfiniteScroll)

export default {
    name: 'home',
    data() {
        return {
            shopList: [],
            page: 1, // 滚动加载
            pageSize: 10,
            limit: 10,
            searchText: ''
        }
    },
    components: {
        fixBottom,
        navHead

    },
    methods: {

        getList() {
            this.axios.get('/wechatauth/quality/store/list', {
                params: {
                    limit: 10,
                    offset: 0,
                    // city: localStorage.getItem('city') ? localStorage.getItem('city') : '南昌市',
                }
            }).then(res => {
                this.shopList = res.data.datas.rows
                console.log(this.shopList);
            });
        },

        /**
         * 滚动加载
         */
        loadList() {
            this.axios.get("/wechatauth/quality/store/list", {
                params: {
                    limit: 10,
                    offset: (this.page) * this.limit,
                    // city: localStorage.getItem('city') ? localStorage.getItem('city') : '南昌市',
                    shopName: this.searchText,

                }
            }).then(res => {
                this.$dialog.loading.close()

                let _list = res.data.datas.rows;
                this.pageSize = res.data.datas.total
                this.shopList = [...this.shopList, ..._list];
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
        /**
         * 搜索店铺
         */
        searchShop() {
            this.$dialog.loading.open('拼命搜索中,请稍候~')
            this.axios.get("/wechatauth/quality/store/list", {
                params: {
                    shopName: this.searchText,
                    // city: localStorage.getItem('city') ? localStorage.getItem('city') : '南昌市',
                    offset: (this.page - 1) * this.limit,
                    limit: this.limit
                }
            }).then(res => {
                this.shopList = res.data.datas.rows;
                setTimeout(() => {
                    this.$dialog.loading.close()
                        // this.loadList()
                }, 300)
            });
        },

    },

    created() {

    },
    beforeCreate() { // 调取分享方法
        // this.SDKRegister(this, () => {
        //     console.log('首页调用分享')
        // })
    },
    mounted() {
        this.getList()
    },

}