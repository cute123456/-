/**
 * 最新公告
 * @file notice.js 
 * @author kun 
 * @date 2018-07-6 09:44:26 
 */
import Vue from 'vue';
import navHead from '@/components/navHead';
import {
    InfiniteScroll
} from 'vue-ydui/dist/lib.px/infinitescroll'

Vue.component(InfiniteScroll.name, InfiniteScroll);

export default {
    name: 'home',
    data() {
        return {
            page: 1, // 滚动加载
            pageSize: 2,
            limit: 10,
            noticeList: [
                // {
                //   img: '/static/imgs/notice_banner.png',
                //   title: '店铺投资送红包，邀请好友在翻倍！',
                //   time: '2018-07-05',
                // },
                // {
                //   img: '/static/imgs/notice_banner.png',
                //   title: '店铺投资送红包，邀请好友在翻倍！',
                //   time: '2018-07-05',
                // },
                // {
                //   img: '/static/imgs/notice_banner.png',
                //   title: '店铺投资送红包，邀请好友在翻倍！',
                //   time: '2018-07-05',
                // },

            ]
        }
    },
    components: {
        navHead
    },
    methods: {
        /**
         * 获取公告列表
         */
        getList() {
            this.axios.get('/wechatauth/announcement/search', {
                params: {
                    offset: (this.page - 1) * this.limit,
                    limit: this.limit
                }
            }).then(res => {
                const _list = res.data.datas.rows;
                this.pageSize = res.data.datas.total;
                this.noticeList = this.noticeList.concat(_list);
                this.noticeList.forEach(element => {
                    element.createdAt = element.createdAt.slice(0, 10);
                });
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

    created() {
        this.getList()
    },
    beforeCreate() { // 调取分享方法
        this.SDKRegister(this, () => {
            console.log('首页调用分享')
        })
    },
    mounted() {},
}