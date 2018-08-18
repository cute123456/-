/**
 * 首页 
 * @file complaints.js 
 * @author yangxia 
 * @date 2018-07-03 13:37:15 
 */
import Vue from 'vue'
import navHead from '@/components/navHead';
import { Toast, Confirm, Alert } from 'vue-ydui/dist/lib.px/dialog'
import WechatPlugin from "vux/src/plugins/wechat/index.js"
import { Radio, RadioGroup } from 'vue-ydui/dist/lib.rem/radio';
/* 使用px：import {Radio, RadioGroup} from 'vue-ydui/dist/lib.px/radio'; */

Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);

Vue.prototype.$dialog = {
    toast: Toast,
    confirm: Confirm,
    alert: Alert,
};

export default {
    created() {
        this.orderId = this.$route.query.orderId
            // this.isBusiness = this.$route.query.isBusiness
        this.getOrderInfo()
    },
    data() {
        return {
            radio: '',
            comment: '', //绑定的评论内容
            imgStr: '', // 图片数组转字符串
            remnant: 0, //输入字符的长度
            orderId: '',
            orderInfos: {}, //订单详情
            goods: {},
            reason: ['质量不好', '不想要了', '描述不符', '价格太贵'],
            show: false
        }
    },
    components: {
        navHead,
    },
    methods: {
        getPic(pic) {
            if (!pic) {
                return ''
            } else {
                return pic.split(',')[0]
            }
        },

        descInput() {
            var txtVal = this.comment.length; //desc 是设置v-model的值
            this.remnant = txtVal;
            if (this.remnant > 200) {
                this.$dialog.toast({ mes: '字数已达上线', timeout: 2000 });
                this.remnant = 200
                this.comment = this.comment.substring(0, 200)
            }
        },
        /**
         * 获取订单详情
         */
        getOrderInfo() {
            this.axios.get('/wechatauth/order/info', {
                params: {
                    id: this.orderId
                }
            }).then(res => {
                if (res.data.result) {
                    this.orderInfos = res.data.datas[this.orderId].business;
                    this.goods = res.data.datas[this.orderId].business.orderGoods[0].goods;

                } else {
                    this.$dialog.toast({ mes: res.data.message, timeout: 2000 });
                }

                // this.$set(this.infos, 0 , res.data.datas)
            })
        },
        /**
         * 提交申请
         */
        GoComment() { //去评论
            if (!this.comment) {
                this.$dialog.toast({ mes: '请输入退款说明', timeout: 2000 });
                return
            }
            this.axios.post('/wechatauth/order/refund', {
                reason: this.comment,
                orderId: this.$route.query.orderId
            }).then(res => {
                if (res.data.result) {
                    this.$dialog.toast({ mes: res.data.message, timeout: 3000 });
                    window.setTimeout(res => {
                        this.$router.back();
                    }, 4000);
                } else {
                    this.$dialog.toast({ mes: res.data.message, timeout: 2000 });
                }
            })
        }
    },
    // beforeRouteEnter(to, from, next) {
    //     next(vm => {
    //         vm.axios.post("/qrcode/share/generate", { openid: localStorage.getItem("openid") }).then((res) => {
    //             if (res.data.result) {
    //                 vm.shareImgData = res.data.datas.share_img
    //                 vm.shareUrl = res.data.datas.share_url
    //             }
    //         });
    //     });
    // },
    beforeCreate() {

    },
}