import Vue from 'vue'

import NavHead from '@/components/navHead'
import District from 'ydui-district/dist/jd_province_city_area_id'
import {
  CitySelect
} from 'vue-ydui/dist/lib.px/cityselect'
import {
  Toast
} from 'vue-ydui/dist/lib.px/dialog'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.prototype.$dialog = {
  toast: Toast,
};
Vue.component(CitySelect.name, CitySelect)

export default {
  data() {
    return {
      check: false,
      district: District,
      city: [], // 省市区地址数组
      serve_address: '', // 省市区地址
      detail_address: '', // 详细地址
      noAdder: true,
      name: '',
      mobile: '',
      addresses: '', // 地址列表     
      reapMobile: '',
      reapProvince: '',
      reapCity: '',
      reapCounty: '',
      detailAddress: '',
      consignee: '',
      // isDefault: ''

    }
  },
  components: {
    NavHead,
    Toast
  },
  methods: {
    result1(ret) {
      this.serve_address = ret.itemName1 + ' ' + ret.itemName2 + ' ' + ret.itemName3;
      this.city = [ret.itemName1, ret.itemName2, ret.itemName3]
    },
    coverChecked() {
      this.check = true
    },
    save() {
      if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.mobile)) {
        Toast({
          mes: '请输入正确的手机号',
          timeout: 400
        });
        return false;
      }
      if (this.name == "" || this.detail_address == "") {
        Toast({
          mes: '请将信息填写完整',
          timeout: 400
        });
        return false;
      }
      this.axios.post("/wechatauth/user/address/add", {
        uid: localStorage.getItem('uid'),
        reapMobile: this.mobile,
        reapProvince: this.city[0],
        reapCity: this.city[1],
        reapCounty: this.city[2],
        detailAddress: this.detail_address,
        consignee: this.name,
        //   isDefault: 0
      }).then(res => {
        if (res) {
          this.$dialog.toast({
            mes: '添加成功！',
            timeout: 600
          });
          this.$router.go(-1)
        } else {
          this.$dialog.toast({
            mes: '添加失败！',
            timeout: 600
          });
        }
      })
    },
  },
  created() {

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
    // this.SDKRegister(this, ()=>{
    //     console.log('首页调用分享')
    // })
  },
}
