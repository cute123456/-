import Vue from 'vue'

import navHead from '@/components/navHead'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

export default {
    data() {
        return {
            infos: [], // 关于我们
        }
    },
    components: {
        navHead,

    },
    methods: {
        getAbout() { // 获取关于我们
            this.axios.get('/wechatauth/get/store/introduction').then(res => {
                if (res.data.result) {
                    this.infos = res.data.datas[0];
                } else {
                    this.$dialog.toast({ mes: res.data.message, timeout: 400 });
                }
            })
        }
    },
    created() {
        this.getAbout() // 获取关于我们
    },
    beforeCreate() { // 调取分享方法
        this.SDKRegister(this, () => {
            console.log('首页调用分享')
        })
    },
}