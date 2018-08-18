import Vue from 'vue'
import navHead from '@/components/navHead'
import { Toast } from 'vue-ydui/dist/lib.px/dialog'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.prototype.$dialog = {
    toast: Toast,
};


export default {
    data() {
        return {
            joinFlag: 0, // 报名活动开关，0 关，1 开
            turnFlag: 0, // 大转盘活动， 0 关，1 开
            joinId: '', // 报名活动id
        }
    },
    components: {
        navHead,
    },
    methods: {
        goRecharge() {
            window.location.href = "/activity/newRecharge"
        },
        goSign(){
            window.location.href = '/activity/joinPay?id=' + this.joinId
        },
        menu() {
            window.scrollTo(0, 0);
        },
        joinActivity(){ // 参加活动开关
            this.axios.get('/enroll/list').then(res=>{
                if (res.data.result) {
                    this.joinFlag = res.data.datas.rows[0].status
                    this.joinId =  res.data.datas.rows[0].id
                } else {
                    this.$dialog.toast({ mes:res.data.message, timeout: 2000})
                }
            })
        },
        turnActivity() { // 大转盘活动开关
            this.axios.get('/draw/rule').then(res=>{
                if (res.data.result) {
                    this.turnFlag= res.data.datas.switch
                } else {
                    this.$dialog.toast({ mes:res.data.message, timeout: 2000})
                }
            })
        }
    },
    created() {
        this.menu();
        this.joinActivity() // 参加活动开关
        this.turnActivity() // 大转盘活动开关
            
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