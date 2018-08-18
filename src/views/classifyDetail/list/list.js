/**
 * 搜索列表页 
 * @file list.js 
 * @author yangxia 
 * @date 2018-06-19 17:11:13 
 */
import Vue from 'vue';
import Rater from 'vux/src/components/rater/index.vue';
// import Loading from 'vux/src/components/loading/index.vue';
import WechatPlugin from 'vux/src/plugins/wechat/index.js';
import { InfiniteScroll } from 'vue-ydui/dist/lib.px/infinitescroll'
import { ListTheme, ListItem } from 'vue-ydui/dist/lib.px/list'
import 'vue-ydui/dist/ydui.base.css'

Vue.component(InfiniteScroll.name, InfiniteScroll)
Vue.component(ListTheme.name, ListTheme)
Vue.component(ListItem.name, ListItem)

export default {
    components: {
        Rater,
        // Loading
    },
    data() {
        return {
            activeTitle: 0, // 排序方式，0 默认，1销量， 2最新
            message: '', // 搜索内容
            searchList: [], // 搜索列表
            classId: '', //二级分类id
            rankNum: 0, //排序方式
            page: 1, // 滚动加载
            pageSize: 10,
            limit: 10,
            city: '南昌市'
        };
    },
    methods: {
        search() {
            // this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
            this.$dialog.loading.open('拼命搜索中,请稍候~')
            this.page = 1
            this.searchList = [];
            this.axios.get('/wechatauth/goods/search', {
                params: {
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit,
                    goodsName: this.message,
                }
            }).then(res => {
                this.searchList = res.data.datas.rows;
            });
            this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
            setTimeout(() => {
                this.$dialog.loading.close()
                    // this.loadList()
            }, 300)
        },
        /**
         * 根据id获取列表
         */
        getList() {
            this.axios.get('/wechatauth/goods/list', {
                params: {
                    limit: 10,
                    offset: 0,
                    goodsType: this.classId,
                    // city: this.city
                }
            }).then(res => {
                this.searchList = res.data.datas.rows;
                this.searchList.forEach((item) => {
                    item.goodsImages = item.goodsImages.split(',')[0];
                });
            });
        },
        /**
         * 滚动加载
         */
        loadList() {
            this.axios.get("/wechatauth/goods/list", {
                params: {
                    limit: 10,
                    offset: (this.page) * this.limit,
                    goodsType: this.classId,
                    // city: this.city
                }
            }).then(res => {
                this.$dialog.loading.close()

                let _list = res.data.datas.rows;
                this.pageSize = res.data.datas.total
                this.searchList = [...this.searchList, ..._list];
                if (_list.length >= this.pageSize || this.page >= Math.ceil(this.pageSize / this.limit)) {
                    /* 所有数据加载完毕 */
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                    return;
                }

                /* 单次请求数据完毕 */
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                this.page++;
            });
        }
    },
    created() {
        if (localStorage.getItem('city')) {
            this.city = localStorage.getItem('city')
        }
        this.classId = this.$route.query.id;
        this.getList();
        if (this.$route.query.searchCon) {
            this.message = this.$route.query.searchCon
        }
        // this.loadList()

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
};