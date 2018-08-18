import Router from 'vue-router';
import index from './';
import center from './center';
import aboutUs from './aboutUs';
import collect from './collect';
import order from './order';
import orderDetail from './orderDetail';
import set from './set';
import myMoney from './myMoney';
import myRed from './myRed';
import myMoneyDetail from './myMoneyDetail';
import backMoney from './backMoney';
import manageAddress from './manageAddress';
import editAddress from './editAddress';
import addAddress from './addAddress';
import selectAddress from './selectAddress';
import merchant from './merchant';
import merchantStatus from './merchantStatus';
import invite from './invite';
import mobileBind from './mobileBind';
import mobileUntie from './mobileUntie';
import shareConfirm from './shareConfirm';
import integral from './integral';
import coupons from './coupons';
import friendslist from './friendslist';
import offlinepay from './offlinepay';


export default [{
    name: '我的',
    component: index,
    path: '/my',
    redirect: '/my/center',
    children: [{
            name: '个人中心',
            path: 'center',
            component: center,
            meta: {
                auth: true
            }
        },
        {
            name: '关于我们',
            path: 'aboutUs',
            component: aboutUs,
            meta: {
                auth: true
            }
        },
        {
            name: '我的收藏',
            path: 'collect',
            component: collect,
            meta: {
                auth: true
            }
        },
        {
            name: '我的代金券',
            path: 'coupons',
            component: coupons,
            meta: {
                auth: true
            }
        },

        {
            name: '设置',
            path: 'set',
            component: set,
            meta: {
                auth: true
            }
        },
        {
            name: '余额明细九宫格',
            path: 'myMoney',
            component: myMoney,
            meta: {
                auth: true
            }
        },

        {
            name: '我的红包',
            path: 'myRed',
            component: myRed,
            meta: {
                auth: true
            }
        },
        {
            name: '余额明细',
            path: 'myMoneyDetail',
            component: myMoneyDetail,
            meta: {
                auth: true
            }
        },
        {
            name: '积分明细',
            path: 'integral',
            component: integral,
            meta: {
                auth: true
            }
        },
        {
            name: '申请提现',
            path: 'backMoney',
            component: backMoney,
            meta: {
                auth: true
            }
        },
        {
            name: '订单',
            path: 'order',
            component: order,
            meta: {
                auth: true
            }
        },
        {
            name: '订单详情',
            path: 'orderDetail',
            component: orderDetail,
            meta: {
                auth: true
            }
        },
        {
            name: '收货地址',
            path: 'manageAddress',
            component: manageAddress,
            meta: {
                auth: true
            }
        },
        {
            name: '编辑地址',
            path: 'editAddress',
            component: editAddress,
            meta: {
                auth: true
            }
        },
        {
            name: '添加收货地址',
            path: 'addAddress',
            component: addAddress,
            meta: {
                auth: true
            }
        },
        {
            name: '选择地址',
            path: 'selectAddress',
            component: selectAddress,
            meta: {
                auth: true
            }
        },
        {
            name: '商家入驻',
            path: 'merchant',
            component: merchant,
            meta: {
                auth: true
            }
        },
        {
            name: '商家入驻审核状态',
            path: 'merchantStatus',
            component: merchantStatus,
            meta: {
                auth: true
            }
        },
        {
            name: '邀请有奖',
            path: 'invite',
            component: invite,
            meta: {
                auth: true
            }
        },
        {
            name: '绑定手机号',
            path: 'mobile/bind',
            component: mobileBind,
            meta: {
                auth: true,
                login: false
            }
        },
        {
            name: '解绑手机号',
            path: 'mobile/untie',
            component: mobileUntie,
            meta: {
                auth: true,
                login: false
            }
        },
        {
            name: '关系绑定',
            path: 'shareConfirm',
            component: shareConfirm,
            meta: {
                auth: true
            }
        },
        {
            name: '好友列表',
            path: 'friendslist',
            component: friendslist,
            meta: {
                auth: true
            }
        },
        {
            name: '线下支付',
            path: 'offlinepay',
            component: offlinepay,
            meta: {
                auth: true
            }
        }
    ]
}]