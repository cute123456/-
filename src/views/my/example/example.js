import Vue from 'vue'
// import navHead from '@/components/navHead';
import fixBottom from '@/components/fixBottom'
import search from '@/components/search'


export default {
	data() {
		return {
			message: ''
		}
	},
	components: {
		// navHead,
		fixBottom,
		search
	},
	methods: {
		searchBtn() {
			console.log('蛀牙', this.message)
			this.$dialog.loading.open('拼命搜索中,请稍候~')
			setTimeout(() => {
				this.$dialog.loading.close()
				this.testPost() // 可以调动下拉加载数据
			}, 300)
		},
		testGet(){ // 测试封装的get方法
			this.get('/wechatauth/user/info', {openid:localStorage.getItem('openid')})
			.then((response) => {
				console.log('发送get请求',response)
			})
		},
		testPost(){ // 测试封装的post方法
			this.post('/qrcode/share/generate', {openid:localStorage.getItem('openid')})
			.then((response) => {
				console.log('发送post请求',response)
			})

			
			// this.post('/test/notify', {
			// 	merVAR:1,
			// 	notifyData:2,
			// 	signMsg:3
			// }).then((response) => {
			// 	console.log('发送post请求',response)
			// })
		},
	},
	mounted() {
		console.log('调用公用变量', this.datas)
		console.log('调用公用变量', this.datas.page)
		this.testGet() // 测试封装的get方法
		this.testPost() // 测试封装的post方法
	}
};