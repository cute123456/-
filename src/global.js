import axios from 'axios'
import { Toast } from 'mint-ui';
import router from './router'
import WechatPlugin from 'vux/src/plugins/wechat/index.js' // 微信分享插件


axios.interceptors.request.use(config => { // 请求拦截
	// 接口请求可在此处统一处理
	config.headers = {
		"ng-params-one": localStorage.uid,
		"ng-params-three": localStorage.token
	
	  }
	return config
}, error => { // 接口请求出错可在此处统一处理
    Toast({
        message: '请求超时',
        position: 'middle',
        duration: 3000
    })
    return Promise.reject(error)
})

axios.interceptors.response.use(res => { // 返回状态判断(添加响应拦截器)，axios时基于promise的异步请求
    //对响应数据做些事
    if (!res.data.success) { //   if (res.data && !res.data.success) {

		return new Promise((resolve, reject) => {
			resolve(res);
		}) //Promise.reject(res.data.message);

    } else {
        console.log('axios响应拦截')
            // router.push("/login")
    }
    return res
}, error => { // 接口相应出错可在这里同意处理，例如登录token过期等
	console.log('axios响应错误')
})


export default {
	install(Vue, options) {
		// 滚动加载数据
		Vue.prototype.datas = {
			lists: [], // 接口获取的数据数组
			page: 1, // 页数
			pageSize: 0, // 总共头多少
			limit: 10,
		}


		/**
		 * 封装post请求
		 * @param url
		 * @param data
		 * @returns {Promise}
		*/

		// Vue.prototype.post = function (url, data = {}) {
		// 	return new Promise((resolve, reject) => {
		// 		axios.post(url, data)
		// 			.then(response => {
		// 				resolve(response);

		// 			}, err => {
		// 				reject(err)

		// 			})
		// 	})
		// }

		/**
		 * 封装get方法
		 * @param url
		 * @param data
		 * @returns {Promise}
		*/

		// Vue.prototype.get = function (url, params = {}) {
		// 	return new Promise((resolve, reject) => {
		// 		axios.get(url, {
		// 			params: params
		// 		}).then(response => {
		// 			resolve(response.data.datas);
		// 		}).catch(err => {
		// 			reject(err)
		// 		})
		// 	})
		// }

		/**
		 * 封装put方法
		 * @param url
		 * @param data
		 * @returns {Promise}
		*/

		// Vue.prototype.put = function (url, data = {}) {
		// 	return new Promise((resolve, reject) => {
		// 		axios.put(url, data)
		// 			.then(response => {
		// 				resolve(response);

		// 			}, err => {
		// 				reject(err)

		// 			})
		// 	})
		// }


		//     Vue.http.interceptors.push(function ( request, next ) {      //附赠一个可以控制页面所有路由开始之前结束之后的方法  
		//     // 请求发送前的处理逻辑  
		// //                  console.log(request)  
		// //                  console.log(next)  
		//             next(function (response) {     
		//                 // 请求发送后的处理逻辑  
		//                 // 更具请求的状态， response参数会返回给 successCallback或errorCallback  
		// //                  console.log(response.data.result)  
		//                     if(response.data.result == undefined){  
		//                         this.$router.push('/')  
		//                     }  
		// //              return response  
		//             });  

		// 	});

	}
}  
