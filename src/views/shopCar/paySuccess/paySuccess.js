import XButton from 'vux/src/components/x-button/index.vue'
import navHead from '@/components/navHead'


export default {
    name: 'paySuccess',
    data() {
        return {
           orderId: ''
        }
    },
    created() {
          this.orderId = this.$route.query.orderId
    },
    components:{
      XButton,
      navHead
    },
   
}