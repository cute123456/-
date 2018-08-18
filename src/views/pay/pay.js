
export default {
    name: 'pay',
    data() {
        return {

        }
    },
    methods: {
        clickPay(e) {
            var target = e.target.id;
            this.axios.get("/wechatauth/order/heepay", {
                params: {
                    payType: target == 'wechat' ? 30 : (target == "ali-pay" ? 22 : 19)
                }
            }).then(res => {
                window.location = res.data.datas;
            })
        }
    }
}