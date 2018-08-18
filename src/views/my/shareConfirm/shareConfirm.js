
import Vue from 'vue'
import navHead from '@/components/navHead/navHead'
import { Toast } from 'vue-ydui/dist/lib.px/dialog'

export default {
    data: function () {
        return {
            myHead: '',
            itHead: ''
        }
    },
    components: {
        navHead
    },
    methods:{
      confirmShare: function () {
        // 确认上下级关系
        this.axios.post("/wechatauth/update/user/relation", {"parentId": this.$route.query.uid,}).then( res=> {
            
            this.$router.push('/');
            // Toast({
            //     mes: res.data.message,
            //     timeout: 3000
            // });
        });
      },
      HSrc: function(value) { // 头像
            let http = value.indexOf('http');
            if(http>-1){
                return value
            }else{
                return this.HTTP + value
            }
        },
    },
    mounted () {
       
        this.$nextTick(function () {
            this.confirmShare()
         
        });
    }
}  