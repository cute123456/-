import NavHead from '@/components/navHead'
import Vue from 'vue';
// import { Radio, MessageBox } from 'mint-ui';
import { Toast } from 'vue-ydui/dist/lib.px/dialog';
import { Radio, RadioGroup } from 'vue-ydui/dist/lib.px/radio';
import WechatPlugin from "vux/src/plugins/wechat/index.js"


Vue.prototype.$dialog = {
    toast: Toast,
};
Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);

export default {
    data() {
        return {
            money: '',
            payType: '银行卡', //提现方式
            phone: '', //用户电话
            name: '', //用户名称
            bankName: '', //提现银行
            payAccount: '', //提现银行卡号
            freeze_money: '', //提现审核中的余额
            balance: "0.00",
            is_business: '', //是否是商家
            user: '',
            infos: {}, // 提现规则信息
            startHour: 0, //工作开始时间
            endHour: 0, //工作结束时间
            details: '',
            commenRate: 0.05, //大众比例
            specialRate: 0, // 特殊比列
        }
    },
    components: {
        NavHead,
    },
    computed: {
        disable() {
            let bol = parseInt(this.money % 100) >= 0 && this.balance >= 100;
            bol = bol && this.payAccount && this.name && this.bankName && Number(this.freeze_money) == 0;
            return !bol;
        },
        realMoney() {
            if (this.specialRate != 0) {
                return (this.money * (1 - this.specialRate)).toFixed(2)
            } else {
                return (this.money * (1 - this.commenRate)).toFixed(2)
            }
        }
    },
    methods: {
        menu() { // 页面定到顶部
            window.scrollTo(0, 0);
        },
        // 微信提现
        bankCommit() {
            if (!/^\d+$/.test(this.money)) {
                this.$dialog.toast({ mes: '请输入整百的金额', timeout: 1000 });
                return false;
            }
            // if ((new Date()).getHours() >= this.startHour && (new Date()).getHours() < this.endHour) { // 判断是否在工作时间内
            if (this.balance >= 100) { // 用户余额大于100才能开始提现操作
                if (parseInt(this.money) && this.name && this.bankName && this.payAccount) { // 钱，姓名，银行卡，银行账号填写完整
                    // if (parseInt(this.money) >= parseInt(this.infos.w_cash_min) && parseInt(this.money) % 100 == 0 && parseInt(this.money) <= parseInt(this.infos.w_once_cashmax)) { // 提现金额要大于100小于1000，且要被100整除
                    this.axios.post("/wechatauth/withdraw", {
                            name: this.name,
                            account: this.payAccount,
                            typeBank: this.bankName,
                            money: this.money,
                            mobile: this.phone
                        }).then(res => {
                            if (res.data.result) {
                                this.$dialog.toast({ mes: '提现请求提交成功，请耐心等待审核！', timeout: 2000 })
                                window.setTimeout(res => {
                                    this.$router.push('/my/center')
                                }, 2000);
                            } else {
                                this.$dialog.toast({ mes: res.data.message, timeout: 2000 })
                            }
                        })
                        // } else {
                        //     this.$dialog.toast({ mes: '提现金额最低' + this.infos.w_cash_min + '最高' + this.infos.w_once_cashmax + '元，且只能整百提现！' })
                        // }

                } else {
                    this.$dialog.toast({ mes: '请将基本信息填写完整', timeout: 2000 })
                }
            } else {
                this.$dialog.toast({ mes: '余额不足~' })
            }
            // } else {
            //     this.$dialog.toast({ mes: '已经不在工作时间内了哦~', timeout: 2000 })
            // }

        },
        // isBindCard() { // 查看是否绑定银行卡号
        //     this.axios.post('/apply/bankSequel', {
        //         openid: localStorage.getItem('openid')
        //     }).then(res=>{
        //         if (res.data.result) {
        //             if (res.data.datas.b_status != 3 && res.data.datas.b_banknum && res.data.datas.b_bankuser && res.data.datas.b_banktype) {
        //                 if (res.data.datas.b_status != 3) {
        //                     this.name = res.data.datas.b_bankuser
        //                     this.bankName = res.data.datas.b_banktype
        //                     this.payAccount = res.data.datas.b_banknum
        //                 }
        //             } else {
        //                 this.$dialog.toast({ mes: '请先绑定银行卡', timeout: 3000 });
        //                 this.$router.push('/my/bindCard')
        //             }
        //         } else {
        //             if (res.data.message == '该用户暂时还未申请商家') {
        //                 this.$dialog.toast({ mes: '请先绑定银行卡', timeout: 3000 });
        //                 this.$router.push('/my/bindCard')
        //             } else {
        //                 this.$dialog.toast({ mes: res.data.message, timeout: 1500 });
        //             }
        //         }
        //     })
        // }
    },
    created() {
        // this.isBindCard()
        this.menu() // 页面定到顶部

    },
    mounted() {
        this.axios.get('/wechatauth/user/info').then(res => {
            this.balance = res.data.datas.balance;
            this.specialRate = parseFloat(res.data.datas.withdraw_rebate).toFixed(2) // 特殊比例
        })
    },

}