import Vue from 'vue'
import navHead from '@/components/navHead';
import WechatPlugin from "vux/src/plugins/wechat/index.js"

export default {
    data() {
        return {
          
        }
    },
    components: {
        navHead,
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.axios.post("/qrcode/share/generate", { openid: localStorage.getItem("openid")}).then((res) => {
                if (res.data.result) {
                    vm.shareImgData = res.data.datas.share_img
                    vm.shareUrl = res.data.datas.share_url
                }
            });
        });
    },
    beforeCreate(){
        this.SDKRegister(this, ()=>{
            console.log('首页调用分享')
        })
    },

}