/*
    作用:头部
    传递参数:title(中间title) right (右边) show(是否显示右边)
    返回事件: save()右边点击事件
    
    引入:import navHead from '@/components/head/head'
    注册: components: {
        navHead
    },
    使用:<navHead title="管理收货地址" right="保存" @save="save"></navHead>
    注意:由于hede是保留标签所以导入时记得 改成NavHead
*/
export default {
  props: {
      title: {
          type: String,
          default: '',
      },
      right: {
          type: String,
          default: '',
      },
      show: {
          type: Boolean,
          default: true,
      }
  },
  data() {
      return {
          Flag: this.flag,
      }
  },
  methods: {
      save() {
          this.$emit('save')
      },
      back() {
          this.$router.go(-1)
      }
  }
}