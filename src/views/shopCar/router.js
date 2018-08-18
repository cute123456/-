import Router from 'vue-router';
import index from './';
import cart from './cart';
import settlement from './settlement';
import paymentDesk from './paymentDesk';
import paySuccess from './paySuccess';
import pay from './pay';


export default [{
    name: '购物车',
    // redirect: '/shopCar',
    component: index,
    path: '/shopCar',
    redirect: '/shopCar/cart',
    children: [{
            name: '购物车页面',
            path: 'cart',
            component: cart,
            meta: {
                auth: true
            }
        },
        {
            name: '订单页面',
            path: 'settlement',
            component: settlement,
            meta: {
                auth: true
            }
        },
        {
            name: '支付页面',
            path: 'paymentDesk',
            component: paymentDesk,
            meta: {
                auth: true
            }
        },
        {
            name: '支付结果',
            path: 'paySuccess',
            component: paySuccess,
            meta: {
                auth: true
            }
        },
        {
            name: '线下支付',
            path: 'pay',
            component: pay,
            meta: {
                auth: true
            }
        }
        
    ]
}]