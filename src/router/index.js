import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home' // home文件夹下只放home页面
import activity from '@/views/activity/router.js'
import classify from '@/views/classify/router.js'
import my from '@/views/my/router.js' // my文件夹下可以放很多文件夹 
import shopCar from '@/views/shopCar/router.js'
import notFound from '@/views/notFound'
import find from '@/views/find/router.js'
import orders from '@/views/orders/router.js'
import classifyDetail from '@/views/classifyDetail/router.js'
import pay from '@/views/pay'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'home',
        component: home,
        meta: {
            auth: true
        }
        // children:[
        //     {
        //         name: '分类页',
        //         path: 'classify',
        //         component: classify,
        //         meta:{
        //             auth:true
        //         }
        // ]
    },
    {
        path: '*',
        component: notFound,
    },
    {
        path: "/pay",
        component: pay
    },
    ...my,
    ...activity,
    ...classify,
    ...shopCar,
    ...classifyDetail,
    ...find,
    ...orders,
    ],
    mode: 'history'
})