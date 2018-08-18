import Vue from 'vue'

export default {
    // name: 'fixBottom',
    props: {
        check: 0,
    },
    methods: {
        goClassify() {
            if (sessionStorage.getItem('classId')) {
                sessionStorage.removeItem('classId')
            }
            this.$router.push('/classify/list?id=' + localStorage.getItem('classId'))
        },
        getUser() { // 获取用户信息
            this.axios.get('/wechatauth/user/info', {
                params: {
                    openid: localStorage.getItem('openid')
                }
            }).then(res => {
                if (res.data.result) {
                    this.user = res.data.datas;
                }
            })
        },
        change() { //点击我要易货
            if (this.user.is_business == 1) {
                this.$router.push('/barter/list')
            } else {
                this.$router.push('/my/merchant')
            }
        }
    },
    created() {
        this.getUser();
    }
}