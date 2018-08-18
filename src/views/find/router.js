import Router from 'vue-router';
import index from './';
import center from './center';
import storeInformation from './storeInformation';
export default [{
  name: '发现',
  component: index,
  path: '/find',
  redirect: '/find/center',
  children: [{
      name: '发现',
      path: 'center',
      component: center,
      meta: {
        auth: true
      }
    },
    {
      name: '店铺资料',
      path: 'storeInformation',
      component: storeInformation,
      meta: {
        auth: true
      }
    }

  ]
}]
