import Vue from 'vue';

import navHead from '@/components/navHead';
import upload from '@/components/upload';
import {
  CitySelect
} from 'vue-ydui/dist/lib.px/cityselect';
import District from 'ydui-district/dist/jd_province_city_area_id.js';
import {
  CheckBox
} from 'vue-ydui/dist/lib.px/checkbox';
import {
  LightBox,
  LightBoxImg
} from 'vue-ydui/dist/lib.px/lightbox';
import {
  Radio,
  RadioGroup
} from 'vue-ydui/dist/lib.px/radio';
import WechatPlugin from "vux/src/plugins/wechat/index.js"
import 'vue-ydui/dist/ydui.base.css';


Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);
Vue.component(LightBox.name, LightBox);
Vue.component(LightBoxImg.name, LightBoxImg);
Vue.component(CheckBox.name, CheckBox);
Vue.component(CitySelect.name, CitySelect);

export default {
  data() {
    return {
      weituoPic: 'upload/25af1a75d13318b710b512de72241b19.jpg',
      is_attention: 1, //是否关注
      show1: false, // 公众号二维码弹出框
      district: District, //省市区数据来源
      showDistrict: false, // 省市区选择框
      Flag: false,
      step: 1,
      baseMessage: { //基本信息，包括商家名称,负责人姓名,电话,选择地址,详细地址,商家所属类型
        b_type: '请选择商家类型', //商家所属类型
        b_use_beans: 1
      },
      photo: '', //店铺门头照
      public_account: '', //对公账号
      private_account: '', //私人账号
      bussinessId: '', // 店铺id
      checkbox1: true, //同意用户协议
      city: [], //地址数组
      formFiles: {},
      // empower: '',// 授权书照片
      license: '', //营业执照号
      // shopPhoto: '', // 店铺门头照
      licenseThumb: '', // 营业执照图片
      store_photo: '',
      personFront: '', // 身份证正面照片
      personBack: '', // 身份证反面照片
      bank_thumb: '', // 银行卡
      is_business: '', // 是否是商家
      bank_name: '', //开户行
      account_name: '', //开户名
      upImg: [],
      addMessage: {}
    }
  },
  components: {
    navHead,
    upload,
  },
  created() {
    this.readMessage() //读取该用户申请的信息
    // 判断用户是否绑定手机
    this.bindMobile(this.$route.fullPath)
  },
  methods: {
    editImage: function (image) {
      let n = this.upImg.indexOf(image)
      this.upImg.splice(n, 1)
    },
    fileChange: function (e) {
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
      this.formFiles[_name] = _file

      // 获取图片路径
      let formData = new FormData()
      formData.append('src', this.formFiles[_name])
      this.axios.post('/wechatauth/upload/image', formData).then(res => { // 图片上传到服务器
        this.upImg.push(res.data.datas)
        this.$dialog.loading.close()
      })

      e.target.value = '' // 虽然file的value不能设为有字符的值，但是可以设置为空值
    },
    change(key, value) { // 存储输入的内容
      if (value) {
        sessionStorage.setItem(key, value)
      }
    },
    readMessage() { //读取该用户信息申请的信息
      this.axios.get('/wechatauth/user/apply/store').then(res => {
       if (res.data.result) {
         console.log(res)
         this.baseMessage = res.data.datas;
         this.photo = this.baseMessage.companyPhoto;
         this.store_photo = this.baseMessage.companyStorePhoto.split(',');
         this.personFront = this.baseMessage.legalPersonPhotoFront;
         this.personBack = this.baseMessage.legalPersonPhotoRear;
         this.licenseThumb = this.baseMessage.businessPhoto;
         this.bank_thumb = this.baseMessage.legalPersonBank;
         this.baseMessage.b_name = this.baseMessage.shopName;
         this.baseMessage.b_uname = this.baseMessage.shopUname;
         this.baseMessage.b_mobile = this.baseMessage.shopMobile;
         this.baseMessage.b_detail_address = this.baseMessage.address;
         this.baseMessage.address = this.baseMessage.province + ' ' + this.baseMessage.city + ' ' + this.baseMessage.county + ' ';
         this.baseMessage.b_type = this.baseMessage.type;
         this.is_business = this.baseMessage.status;
        //  sessionStorage.setItem('status',this.is_business);
               console.log(this.is_business)
              //  1成功，2通过，3失败
              //  if (this.is_business == 1 || this.is_business == 2 || this.is_business == 3) {
              //      this.step = 4
              //  } else if (this.is_business == 0) {
              //      this.step = 1
              //  }

       }
      })
    },
    getDistrict(ret) { //选择地址后的回调
      this.baseMessage.address = ret.itemName1 + ' ' + ret.itemName2 + ' ' + ret.itemName3 + ' ';
      this.city = [ret.itemName1, ret.itemName2, ret.itemName3];
    //   sessionStorage.setItem('address', this.baseMessage.address)

    },
    // bindCard() { // 绑定银行卡
    //     this.axios.post('/apply/bankSequel', {
    //         openid: localStorage.getItem('openid'),
    //         b_banknum: this.public_account,
    //         b_banktype: this.bank_name,
    //         b_bankuser: this.account_name,
    //     }).then(res => {
    //         if (res.data.result) {
    //             this.step = 4
    //             this.readMessage()
    //         } else {
    //             this.$dialog.toast({ mes: res.data.message });

    //         }
    //     })
    // },
	retry(status) { //重新申请,改状态
		this.$router.push('/my/merchant?status=' + 1);
      // this.axios.put('/apply/test', {
      //     b_bid: this.bussinessId,
      //     b_status: 3
      // }).then(res => {
      //     if (res.data.result) {
      //         this.step = 1
      //     } else {
      //         this.$dialog.toast({ mes: res.data.message });
      //     }
      // })
    }
  }

}
