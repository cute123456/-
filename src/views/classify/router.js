import Router from 'vue-router';
import index from './';
import classify from './classifyList';

export default [{
    name: '分类以及商品详情',
    // redirect: '/classifyDetail',
    component: index,
    path: '/classify',
    redirect: '/classify/list',
    children: [
        {
            name: '分类页',
            path: 'list',
            component: classify,
            meta:{
                auth:true
            }
        }
    ]
}]
