import NavHead from '@/components/navHead'
import Vue from 'vue';
import { Toast } from 'vue-ydui/dist/lib.px/dialog';
import { CheckBox } from 'vue-ydui/dist/lib.px/checkbox';
import fixBottom from '@/components/fixBottom'


Vue.component(CheckBox.name, CheckBox);
Vue.prototype.$dialog = {
    toast: Toast,
};

export default {
    data() {
        return {
            mes: '发送验证码',
            phone: '',
            checkbox1: true,
            code: ''
        }
    },
    components: {
        NavHead,
        fixBottom
    },
    methods: {
        goCode() {
            if (!/^1[3|4|5|7|8]\d{9}$/gi.test(this.phone)) {
                this.$dialog.toast({ mes: '请输入正确的手机号', timeout: 1000 });
                return
            } else {
                this.axios.post("/wechatauth/user/mobile/send", {
                    mobile: this.phone
                }).then(res => {
                    console.log(res)
                    this.$dialog.toast({ mes: '成功发送验证码', timeout: 1000 });
                    if (res.data.result) {
                        let num = 60
                        this.mes = num + 's后重新获取'
                        const timer = setInterval(() => {
                            num--;
                            if (num <= 0) {
                                this.mes = '重新发送'
                                clearInterval(timer)
                            } else {
                                this.mes = num + 's后重新发送'
                            }
                        }, 1000)
                    } else {
                        this.$dialog.toast({ mes: '请输入手机号', timeout: 1000 });
                    }
                })

            }
        },
        goSubmit() {
            if (this.checkbox1) {
                if (this.phone) {
                    if (this.code) {
                        this.axios.post("/wechatauth/user/mobile/confirm", {
                            mobile: this.phone,
                            code: this.code,
                        }).then(res => {
                            if (res.data.result) {
                                // 路径跳转

                                this.$router.push(this.$route.query.redirect);
                                // this.$dialog.toast({ mes: '绑定成功', timeout: 1000 });
                            } else {
                                this.$dialog.toast({ mes: res.data.message, timeout: 1000 });
                            }
                        })
                    } else {
                        this.$dialog.toast({ mes: '请输入正确的验证码', timeout: 1000 });
                    }
                } else {
                    this.$dialog.toast({ mes: '请输入手机号', timeout: 1000 });
                }
            } else {
                this.$dialog.toast({ mes: '请同意协议', timeout: 1000 });
            }


        }
    },
    created() {

    },
}