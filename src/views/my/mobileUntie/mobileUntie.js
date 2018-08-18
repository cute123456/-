import NavHead from '@/components/navHead'
import Vue from 'vue';
import {
  Toast
} from 'vue-ydui/dist/lib.px/dialog';
import {
  CheckBox
} from 'vue-ydui/dist/lib.px/checkbox';
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
      code: '',
      oldmobile: '',
      newmobile: '',
    }
  },
  components: {
    NavHead,
    fixBottom
  },
  methods: {
    getInfo() {
      //获取个人信息
      this.axios.get('/wechatauth/user/info', {
        params: {
          openid: localStorage.getItem('openid')
        }
      }).then(res => {
        if (res.data.result) {
          this.oldmobile = res.data.datas.mobile;
        }
      })
    },
    goCode() {
      if (!/^1[3|4|5|7|8]\d{9}$/gi.test(this.newmobile)) {
        this.$dialog.toast({
          mes: '请输入正确的手机号',
          timeout: 1000
        });
        return
      } else {
        this.axios.post("/wechatauth/user/mobile/send", {
          mobile: this.newmobile,

        }).then(res => {
          console.log(res)
          this.$dialog.toast({
            mes: '成功发送验证码',
            timeout: 1000
          });
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
            this.$dialog.toast({
              mes: '请输入手机号',
              timeout: 1000
            });
          }
        })
      }
    },
    goSubmit() {
      if (this.checkbox1) {
        if (this.newmobile) {
          if (this.code) {
            this.axios.post("/wechatauth/user/mobile/update", {
              oldmobile: this.oldmobile,
              newmobile: this.newmobile,
              code: this.code
            }).then(res => {
              console.log('登录', res)
              if (res.data.result) {
                // localStorage.setItem('')
                localStorage.setItem('token', res.data.datas)
                console.log(localStorage.getItem('token', res.data.datas))
                this.$router.push('/');
                this.$dialog.toast({
                  mes: '登录成功',
                  timeout: 1000
                });
              } else {
                this.$dialog.toast({
                  mes: res.data.message,
                  timeout: 1000
                });
              }
            })
          } else {
            this.$dialog.toast({
              mes: '请输入正确的验证码',
              timeout: 1000
            });
          }
        } else {
          this.$dialog.toast({
            mes: '请输入手机号',
            timeout: 1000
          });
        }
      } else {
        this.$dialog.toast({
          mes: '请同意协议',
          timeout: 1000
        });
      }


    }
  },
  created() {
    this.getInfo() //获取个人信息
  },
}
