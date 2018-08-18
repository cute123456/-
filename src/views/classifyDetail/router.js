import Router from 'vue-router';
import index from './';
import classify from './classify';
import list from './list';
import detail from './detail';
import city from './city';
import appraise from './appraise';
import shopData from './shopData';

export default [{
    name: '分类以及商品详情',
    // redirect: '/classifyDetail',
    component: index,
    path: '/classifyDetail',
    redirect: '/classifyDetail/classify',
    children: [
        {
            name: '分类页',
            path: 'classify',
            component: classify,
            meta:{
                auth:true
            }
        },
        {
            name: '商品列表页',
            path: 'list',
            component: list,
            meta:{
                auth:true
            }
        },
        {
            name: '商品详情页',
            path: 'detail',
            component: detail,
            meta:{
                auth:true
            }
        },
        {
            name: '城市',
            path: 'city',
            component: city,
        },
        {
            name: '评论页',
            path: 'appraise',
            component: appraise,
            meta:{
                auth:true
            }
        },
        {
            name: '商家资料',
            path: 'shopData',
            component: shopData,
            meta: {
                auth: true
            }
        },
   
    ]
}]
