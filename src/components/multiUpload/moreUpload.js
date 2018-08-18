import Vue from 'vue'
import { Toast, Loading } from 'vue-ydui/dist/lib.px/dialog'

Vue.prototype.$dialog = {
  toast: Toast,
  loading: Loading
}

export default {
  name: 'uplad',
  props: {
    upImg: {
      type: Array,
      default: []
    },
    camera: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formFiles: {},
      inputFlie: ''
    }
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
        this.$dialog.toast({ mes: '文件不能大于8M' })
        e.target.value = ''
        return
      }
      this.formFiles[_name] = _file

      // 获取图片路径
      let formData = new FormData()
      formData.append('image', this.formFiles[_name])
      this.axios.post('/upload/image', formData).then(res => { // 图片上传到服务器
        this.upImg.push(res.data.datas)
        console.log(this.upImg.length)
        this.$dialog.loading.close()
      })

      e.target.value = '' // 虽然file的value不能设为有字符的值，但是可以设置为空值
    }
  }
}
