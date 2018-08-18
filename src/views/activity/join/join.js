import Vue from 'vue'
import { Toast } from 'vue-ydui/dist/lib.px/dialog'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.prototype.$dialog = {
    Toast
};


export default {
    data() {
        return {
            isReport:true, // 检测用户是否已报名该活动
            member:{},//报名信息
        }
    },
    methods: {
        sign(){ //立即报名
        
            if (this.member.name && this.member.phone && this.member.compony && this.member.goodName && this.member.goodPrice && this.member.personNum) {
                if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.member.phone)) {
                    this.$dialog.toast({ mes: '请输入正确的手机号', timeout: 400 });
                    return false;
                }
                this.axios.post("/sign/activity",{
                    uid:localStorage.getItem('uid'),
                    name:this.member.name,
                    mobile:this.member.phone,
                    company:this.member.compony,
                    y_goods:this.member.goodName,
                    y_price:this.member.goodPrice,
                    members:this.member.personNum,
                }).then(res => {
                    console.log(res)
                    if(res.data.result){
                        this.$dialog.toast({mes: '报名成功', timeout: 1000});
                    }else if(res.data.message == "您已报名!"){
                        this.$dialog.toast({mes: '您已报名成功，不需要再报名了哦', timeout: 1000});
                    }
                })
                // console.log('member', this.member)
            } else {
                this.$dialog.toast({mes: '请补全报名信息', timeout: 1000});
            }
            
        }
    },
    created () {
        // this.axios.get('/sign/activity',{  //判断是否参加了该活动
        //     params:{
        //         openid : localStorage.getItem('openid')
        //     }
        // }).then(res=>{
        //     this.isReport = res.data.result
        //     if (!res.data.result) {
        //         this.$dialog.toast({mes: res.data.message, timeout: 1000});
        //     }
        // })
    },
    beforeCreate(){
        this.SDKRegister(this, ()=>{
            console.log('首页调用分享')
        })
    },
    created() {
        this.address = localStorage.city ? localStorage.city : '南昌市'
        
        setTimeout(()=>{
            this.attention()
            this.getArea() // 获取专区列表
            this.getDay() // 获取每日优惠
            this.goSwiperPage() // 获取首页轮播
            this.goList() // 获取一级分类
            // this.getRecommend() // 获取推荐
            this.loadList()
        },300)
        
    },
}