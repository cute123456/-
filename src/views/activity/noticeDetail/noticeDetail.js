/**
 * 最新公告
 * @file notice.js 
 * @author kun 
 * @date 2018-07-6 09:44:26 
 */
import Vue from 'vue';
import navHead from '@/components/navHead';

export default {
    name: 'home',
    data() {
        return {
            shopList: [],
            page: 1, // 滚动加载
            pageSize: 10,
            limit: 10,
            noticeDetail: {
                // banner: '/static/imgs/notice_banner.png',
                // title: '618粉丝狂欢节！',
                // time: '2018-07-05',
                // content: '好消息！近日，来个单品与知名第三方支付公司通联支付携手签约， 建立正式战略合作关系。 本次合作标志着来个单品支付体系再度升级， 家人伙伴们可以享受到更快的提现到账体验， 银行卡提现24小时内即可到账（ 节假日除外）！ ',
                // image: '/static/imgs/notice_banner.png',
            }
        }
    },
    components: {
        navHead
    },
    methods: {
        getDetail() {

            this.axios.get('/wechatauth/announcement/get', {
                params: {
                    id: this.$route.query.id
                }
            }).then(res => {
                this.noticeDetail = res.data.datas;
                this.noticeDetail.createdAt = this.noticeDetail.createdAt.slice(0, 10);
                console.log(this.noticeDetail);
            });
        },
    },

    created() {
        this.getDetail();
    },
    beforeCreate() { // 调取分享方法
        // this.SDKRegister(this, () => {
        //     console.log('首页调用分享')
        // })
    },
    mounted() {},

}