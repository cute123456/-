import Vue from 'vue'

import navHead from '@/components/navHead'
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
      limit: 10,
      offset: 0,
      district: District,
      serve_address: '', // 省市区地址
      detail_address: '', // 详细地址
      name: "",
      mobile: "",
      city: "", //省市区数组
      // address: [], // 地址列表

    }
  },
  components: {
    navHead,
    // myLocation,
    Toast
  },
  methods: {
    coverChecked() {
      this.check = true
    },
  
    save() {
      if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.mobile)) {
        this.$dialog.toast({
          mes: '请输入正确的手机号',
          timeout: 400
        });
        return false;
      }
      if (this.name == "" || this.detail_address == "") {
        this.$dialog.toast({
          mes: '请将信息填写完整',
          timeout: 400
        });
        return false;
      }
      this.axios.post("/wechatauth/user/address/edit", {
        id: this.$route.query.id,
        uid: localStorage.getItem('uid'),
        consignee: this.name,
        reapMobile: this.mobile,
        reapProvince: this.city[0],
        reapCity: this.city[1],
        reapCounty: this.city[2],
        detailAddress: this.detail_address
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
    /** 获取地址详情
*/
      getAddress() {
        this.axios.get('/wechatauth/user/address/detail', {
          params: {           
            id: this.$route.query.id
          }
        }).then(res => {
          console.log(res)
          if (res.data.result) {
            let address = res.data.datas;
            this.name = address.consignee;
            this.mobile = address.reapMobile;
            this.serve_address = address.reapProvince + ' ' + address.reapCity + ' ' + address.reapCounty
            this.city = this.serve_address.split(" ");
            this.detail_address = address.detailAddress;
          }
        })
      },
    result1(ret) {
      this.serve_address = ret.itemName1 + ' ' + ret.itemName2 + ' ' + ret.itemName3;
      this.city = [ret.itemName1, ret.itemName2, ret.itemName3]
    },

    delAddress() {
      this.axios.delete('/address/del', {
        params: {
          id: this.$route.query.id
        }
      }).then(res => {
        if (res.data.result) {
          this.$router.go(-1)
          this.$dialog.toast({
            mes: '删除成功',
            timeout: 400
          });
        }
      })

    },

  },
  mounted() {},
  created() {
    this.getAddress();
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
