import Vue from 'vue'
import { Toast, Loading } from 'vue-ydui/dist/lib.px/dialog'

Vue.prototype.$dialog = {
	toast: Toast,
	loading: Loading
}

export default {
	data(){
		return {
			message: ''
		}
	},
	props: ['value'],
	methods: {
		searchBtn(){ // 点击搜索
			this.$emit('searchBtn')
		},
		updateValue: function (value) { // 更新数值message
			this.$emit('input', value)
			this.message = value
		},
	},
};