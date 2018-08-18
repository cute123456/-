
export default {
  name: 'icon-svg',
  props: {
    iconClass: {
      type: String,
      required: true//必填字段
    }
  },
  computed: {//计算机属性返回图标名称
    iconName() {
      return `#icon-${this.iconClass}`
    }
  }
}
