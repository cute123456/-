import Vue from 'vue'
import NavHead from '@/components/navHead';
import { InfiniteScroll } from 'vue-ydui/dist/lib.px/infinitescroll'
import { ListTheme, ListItem } from 'vue-ydui/dist/lib.px/list'
import WechatPlugin from "vux/src/plugins/wechat/index.js"
import 'vue-ydui/dist/ydui.base.css'

Vue.component(InfiniteScroll.name, InfiniteScroll)
Vue.component(ListTheme.name, ListTheme)
Vue.component(ListItem.name, ListItem)

export default {
    data() {
        return {
            user:{
                balance: 0
            },
            moneys: [], // 明细
            countAll: {},
            title: '', // 标题
            titleMes: '',
            limit: 10,
            page: 1,
            pageSize: 10,
            type: 0,
        }
    },
    components: {
        NavHead
    },
    methods: {
        goPage(num){
            if (num == 1) {
                window.location.href="/activity/recharge"
            } else if (num == 2) {
                this.$router.push('/my/backMoney')
            }
        },
        //获取余额详情
        loadList() {
            console.log('加载')
            this.axios.get('/user/log', {
                params: {
                    offset: (this.page - 1) * this.limit,
                    limit: this.limit,
                    openid: localStorage.getItem('openid'),
                    beanormoney: 2,
                    type: this.type
                }
            }).then(res => {
                this.$dialog.loading.close();
                const _list = res.data.datas.rows;
                this.pageSize = res.data.datas.total
                this.moneys = [...this.moneys, ..._list];

                if (_list.length >= this.pageSize || this.page >= Math.ceil(this.pageSize / this.limit)) {
                    /* 所有数据加载完毕 */
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                    return;
                }
                /* 单次请求数据完毕 */
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                this.page++;
            });
        },
        getUser() { // 获取用户信息
            this.axios.get('/wechatauth/user/info', {
                params: {
                    openid: localStorage.getItem('openid')
                }
            }).then(res => {
                if (res.data.result) {
                    this.user = res.data.datas;
                    // console.log(res)
                }
            })
        },
        getCount() { // 获取用户的统计数据
            this.axios.get('/user/statistics', {
                params:{
                    openid: localStorage.getItem('openid')
                }
            }).then(res=>{
                if (res.data.result) {
                    this.countAll = res.data.datas.balance
                } else {
                    this.$dialog.toast({mes: res.data.message, timeout: 1000});
                }
            })
        }
        
    },
    created() {
        window.scrollTo(0,0);
        this.title = this.$route.query.title
        this.titleMes = this.$route.query.title + '明细'
        this.getUser() // 获取用户信息
        this.getCount() // 获取统计数据
    },
    mounted () {
        if (this.title == '消费') { //1 营业额 2消费额 3分润 4充值 5获赠 6赠送 7提现
            this.type = 2
        } else if (this.title == '提现') {
            this.type = 7
        } else if (this.title == '营业额') {
            this.type = 1
        } else if (this.title == '充值') {
            this.type = 4
        }
        this.loadList() // 获取对应明细
    },
    beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.axios.post("/qrcode/share/generate", { openid: localStorage.getItem("openid") }).then((res) => {
				if (res.data.result) {
					vm.shareImgData = res.data.datas.share_img
					vm.shareUrl = res.data.datas.share_url
				}
			});
		});
	},
	beforeCreate() {
		this.SDKRegister(this, () => {
			console.log('首页调用分享')
		})
	},
}