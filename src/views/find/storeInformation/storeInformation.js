/**
 * 首页 
 * @file center.js 
 * @author kun 
 * @date 2018-06-28 09:44:26 
 */
import Vue from 'vue'
import WechatPlugin from "vux/src/plugins/wechat/index.js"
import {
    Popup
} from 'vue-ydui/dist/lib.px/popup';
import navHead from '@/components/navHead';
import { InfiniteScroll } from 'vue-ydui/dist/lib.px/infinitescroll';

Vue.component(Popup.name, Popup);
Vue.component(InfiniteScroll.name, InfiniteScroll);
export default {
    name: 'home',
    data() {
        return {
            type: 0,
            shopId: '',
            shopDetail: '',
            commentList: [],
            limit: 10,
            offset: 0,
            goodsList: [],
            goodsLimit: 10,
            goodsOffset: 0,
        }
    },
    components: {
        navHead
    },
    methods: {
        changType(type) {
            this.type = type;
            if (this.type == 1) {
                // this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
                this.offset = 0;
                this.commentList = [];
                this.loadComment();
            } else {
                // this.$refs.goods.$emit('ydui.infinitescroll.reInit');
                this.goodsOffset = 0;
                this.goodsList = [];
                this.loadGoods();
            }
        },
        /**获取店内商品
         * */
        // getGoods(){
        //   this.axios.get('/wechatauth/store/goods', {
        //         shopId: this.$router.query,
        //         offset: this.offset,
        //         limit: this.limit
        //       }, res => {

        //   })
        // }
        /**
         * 获取店铺信息
         */
        getStoreInfo: function () {
            this.axios.get("/wechatauth/get/store/info", {
                params: {
                    id: this.shopId,
                }
            }).then(res => {
                if (res.data.result) {
                    this.shopDetail = res.data.datas[0]
                } else {
                    this.$dialog.toast({
                        mes: res.data.message
                    })
                }
            })
        },
        /**
         * 拼接头像
         */
        HSrc: function (value) {
            let http = value.indexOf('http');
            if (http > -1) {
                return value
            } else {
                return this.HTTP + value
            }
        },
        /**
         * 获取店铺评论
         */
        loadComment() { // 滚动加载
            this.axios.get('/wechatauth/store/comment', {
                params: {
                    id: this.shopId,
                    offset: this.offset,
                    limit: this.limit
                }
            }).then(res => {
                if (res.data.result) {
                    const temp = res.data.datas.rows
                    temp.forEach((element, index) => {
                        if (element.rReviewImgs) {
                            temp[index].images = element.rReviewImgs.split(',');
                        } else {
                            temp[index].images = [];
                        }
                    });
                    this.commentList = this.commentList.concat(temp);
                    if (this.commentList.length == res.data.datas.total) {
                        this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                        return;
                    }
                    /* 单次请求数据完毕 */
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                    this.offset = this.limit + this.offset;
                }

            });
        },
        loadGoods: function () {
            this.axios.get('/wechatauth/store/goods', {
                params: {
                    shopId: this.shopId,
                    offset: this.goodsOffset,
                    limit: this.goodsLimit
                }
            }).then(res => {
                if (res.data.result) {
                    this.goodsList = this.goodsList.concat(res.data.datas.rows);
                    if (this.goodsList.length == res.data.datas.total) {
                        this.$refs.goods.$emit('ydui.infinitescroll.loadedDone');
                        return;
                    }
                    this.$refs.goods.$emit('ydui.infinitescroll.finishLoad');
                    this.goodsOffset = this.goodsLimit + this.goodsOffset;
                }
            });
        }
    },

    created() {
        this.shopId = this.$route.query.id;
        this.getStoreInfo();
        if (this.type == 0) {
            this.loadGoods();
        } else {
            this.loadComment();
        }
    },
    beforeCreate() {
    },
    mounted() {
    },

}
