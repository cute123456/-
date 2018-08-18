import Vue from 'vue'
import navHead from '@/components/navHead';
import {
    Toast
} from 'vue-ydui/dist/lib.px/dialog';
import upload from '@/components/upload';
import {
  Rate
} from 'vue-ydui/dist/lib.rem/rate';
import WechatPlugin from "vux/src/plugins/wechat/index.js";
import 'vue-ydui/dist/ydui.base.css';


Vue.component(Rate.name, Rate);
Vue.prototype.$dialog = {
    toast: Toast,
};

export default {
    created() {

    },
    data() {
        return {
            comment: '', //绑定的评论内容
            imgStr: '', // 图片数组转字符串
            remnant: 0, //输入字符的长度
            // businessId: '', //商家Id
            // goodId:'', //商品id
            upImg: [],
            isActive: false,
            star: 3,
            rate7: 2,
            rate8: 1,
            tipText: [
                '<h1 style=" font-size: 24px;color: #313131;">$ <span style="font-size: 14px !important;">分<span></h1>',
                '<h1 style=" font-size: 24px;color: #313131;">$ <span style="font-size: 14px !important;">分<span></h1>',
                '<h1 style=" font-size: 24px;color: #313131;">$ <span style="font-size: 14px !important;">分<span></h1>',
                '<h1 style=" font-size: 24px;color: #313131;">$ <span style="font-size: 14px !important;">分<span></h1>',
                '<h1 style=" font-size: 24px;color: #313131;">$ <span style="font-size: 14px !important;">分<span></h1>',
            ]
        }
    },
    components: {
        navHead,
        upload
    },
    methods: {
        change(id) {
            this.isActive = !this.isActive;
        },
        editImage: function(image) {
            let n = this.upImg.indexOf(image)
            this.upImg.splice(n, 1)
        },
        fileChange: function(e) {
            this.$dialog.loading.open()
            var fileSize = 0
            let _file = e.target.files[0]
            let _name = e.target.name
            fileSize = _file.size
            if (fileSize > 8 * 1024 * 1024) {
                this.$dialog.toast({
                    mes: '文件不能大于8M'
                })
                e.target.value = ''
                return
            }

            // 获取图片路径
            let formData = new FormData()
            formData.append('src', _file)
            this.axios.post('/wechatauth/upload/image', formData).then(res => { // 图片上传到服务器
                console.log(res)
                this.upImg.push(res.data.datas)
                this.$dialog.loading.close()
            })

            e.target.value = '' // 虽然file的value不能设为有字符的值，但是可以设置为空值
        },
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
                this.$dialog.toast({
                    mes: '字数已达上线',
                    timeout: 2000
                });
                this.remnant = 200
                this.comment = this.comment.substring(0, 200)
            }
        },
        GoComment() { //去评论
            if (!this.comment) {
                this.$dialog.toast({
                    mes: '请输入投诉内容',
                    timeout: 2000
                });
                return
            }
            this.axios.post('/wechatauth/goods/comment/add', {
                rReview: this.comment,
                starStar: this.rate8,
                orderId: this.$route.query.orderId,
                rReviewImgs: (this.upImg).join(',')
            }).then(res => {
                if (res.data.result) {
                    this.$dialog.toast({
                        mes: '提交成功',
                        timeout: 2000
                    });
                    this.$router.back();
                } else {
                    this.$dialog.toast({
                        mes: res.data.message,
                        timeout: 2000
                    });
                }
            })
        }
    },
    // beforeRouteEnter(to, from, next) {
    //     next(vm => {
    //         vm.axios.post("/qrcode/share/generate", {
    //             openid: localStorage.getItem("openid")
    //         }).then((res) => {
    //             if (res.data.result) {
    //                 vm.shareImgData = res.data.datas.share_img
    //                 vm.shareUrl = res.data.datas.share_url
    //             }
    //         });
    //     });
    // },
    beforeCreate() {
        // this.SDKRegister(this, ()=>{
        //     console.log('首页调用分享')
        // })
    },
}
