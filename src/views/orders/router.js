import Router from 'vue-router';
import index from './';
import agree from './agree';
import serviceAgree from './serviceAgree';
import comment from './comment';
import complaints from './complaints';
import refund from './refund';

export default [{
    name: '新加订单',
    component: index,
    path: '/orders',
    children: [{
            name: '入驻平台接受协议',
            path: 'agree',
            component: agree,
            meta: {
                auth: true
            }
        },
        {
            name: '百业衍升服务协议',
            path: 'serviceAgree',
            component: serviceAgree,
            meta: {
                auth: true
            }
        },
        {
            name: '评论',
            path: 'comment',
            component: comment,
            meta: {
                auth: true
            }
        },
        {
            name: '售后',
            path: 'complaints',
            component: complaints,
            meta: {
                auth: true
            }
        },
        {
            name: '退款',
            path: 'refund',
            component: refund,
            meta: {
                auth: true
            }
        },
    ]

}]