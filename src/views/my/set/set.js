import Vue from 'vue'
import navHead from '@/components/navHead'
import upload from '@/components/upload';
import fixBottom from '@/components/fixBottom'
import {
  Toast,
  Loading
} from 'vue-ydui/dist/lib.px/dialog'

import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.prototype.$dialog = {
  toast: Toast,
   loading: Loading
};

export default {
  data() {
    return {
      imgFile: {},
      // img: "http://img0.imgtn.bdimg.com/it/u=3880133255,4090820197&fm=214&gp=0.jpg",
      person: {}, // 个人信息
      formFiles: {},
      personFront: '', // 身份证正面
      personBack: '', // 身份证反面
      address: '', // 地址
      total: '', // 地址条数
      numFlag: false, // 是否有身份证号
      idImgFlag: false, // 是否有身份证照片
      thumb: '',
      nick: '',
      sex: '',
      realname: '',
      mobile:''
    }
  },
  components: {
    navHead,
    upload
  },
  created() {
    this.getInfo() //获取个人信息
    // this.getAddress() // 获取地址
  },
  methods: {
    getInfo() { //获取个人信息
      this.axios.get('/wechatauth/user/info', {
        params: {
          openid: localStorage.getItem('openid')
        }
      }).then(res => {
        if (res.data.result) {
          this.person = res.data.datas
          this.thumb = this.person.headimgurl;
          this.realname = this.person.realname;
          this.nick = this.person.nickname;
          this.sex = this.person.sex;
          this.mobile = this.person.mobile;
        }   
      })
    },
    fileChange: function (e) {
      this.$dialog.loading.open('图片上传中');
      var fileSize = 0;
      let _file = e.target.files[0];
      let _name = e.target.name;

      fileSize = _file.size
      if (fileSize > 8 * 1024 * 1024) {
        this.$dialog.toast({
          mes: '文件不能大于8M'
        });
        e.target.value = '';
        return
      }
      this.formFiles[_name] = _file;

      // 获取图片路径
      let formData = new FormData();
      formData.append('avatar', this.formFiles[_name]);

      this.axios.post('/wechatauth/user/avatar/upload', formData).then(res => {
        this.$dialog.loading.close();
        this.thumb = res.data.datas

      })

      e.target.value = ''; //虽然file的value不能设为有字符的值，但是可以设置为空值
    },
    save() {
      if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.mobile)) {
        this.$dialog.toast({
          mes: '请输入正确的手机号',
          timeout: 400
        });
        return false;
      }
      if (this.person.nick == '') {
        this.$dialog.toast({
          mes: '请填写您的昵称',
          timeout: 400
        });
        return false;
      }
      if (this.person.sex == '') {
        this.$dialog.toast({
          mes: '请填写您的性别',
          timeout: 400
        });
        return false;
      }
    
      // 修改用户信息
      this.axios.post("/wechatauth/user/edit", {
        uid: localStorage.getItem('uid'),
        // avatar: this.person.thumb,
        nickname: this.nick,
        realname: this.realname,
        sex: this.sex       
      }).then(res => {
        if (res.data.result) {
          this.$dialog.toast({
            mes: '修改成功',
            timeout: 400
          });
          this.$router.go(-1)
        } else {
          this.$dialog.toast({
            mes: '您未做任何修改哦',
            timeout: 400
          });
        }
      })
    },
    HSrc: function (value) { // 头像
      let http = value.indexOf('http');
      if (http > -1) {
        return value
      } else {
        return this.HTTP + value
      }
    },
    // getAddress: function() {
    //     this.axios.get('/address/list', { // 获取默认地址
    //         params: {
    //             offset: 0,
    //             limit: 10,
    //             uid: localStorage.getItem('uid')
    //         }
    //     }).then(res => {
    //         if (res.data.result) {
    //             this.total = res.data.datas.total
    //             if (this.total > 0) {
    //                 res.data.datas.rows.forEach(value => {
    //                     if (value.is_default == 1) {
    //                         this.address = value.reap_province + ' ' + value.reap_city + ' ' + value.reap_county
    //                     }
    //                 });
    //             }
    //         } else {
    //             this.$dialog.toast({ mes: res.data.message, timeout: 1000 })
    //         }

    //     })
    // }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.axios.post("/qrcode/share/generate", {
        openid: localStorage.getItem("openid")
      }).then((res) => {
        if (res.data.result) {
          vm.shareImgData = res.data.datas.share_img
          vm.shareUrl = res.data.datas.share_url
        }
      });
    });
  },
  beforeCreate() {
    // this.SDKRegister(this, () => {
    //     console.log('首页调用分享')
    // })
  },
}
