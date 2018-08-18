import Router from 'vue-router';
import index from './';
import list from './list';
import rechargeMoney from './rechargeMoney';
import redPacket from './redPacket';
import notice from './notice';
import noticeDetail from './noticeDetail';
export default [{
    name: '活动',
    component: index,
    path: '/activity',
    redirect: '/activity/list',
    children: [{
            name: '活动列表页',
            path: 'list',
            component: list,
            meta: {
                auth: true
            }
        },

        {
            name: '充值余额',
            path: 'rechargeMoney',
            component: rechargeMoney,
            meta: {
                auth: true
            }
        },
        {
            name: '红包',
            path: 'redPacket',
            component: redPacket,
            meta: {
                auth: true
            }
        },
        {
          name: '公告列表',
          path: 'notice',
          component: notice,
          meta: {
            auth: true
          }
        },
        {
          name: '公告详情',
          path: 'noticeDetail',
          component: noticeDetail,
          meta: {
            auth: true
          }
        },
    ]
}]