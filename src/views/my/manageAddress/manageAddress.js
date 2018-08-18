import Vue from 'vue'

import navHead from '@/components/navHead'
import { Toast, Confirm } from 'vue-ydui/dist/lib.px/dialog'
import { CitySelect } from 'vue-ydui/dist/lib.rem/cityselect';
import { InfiniteScroll } from 'vue-ydui/dist/lib.px/infinitescroll'
import { ListTheme, ListItem } from 'vue-ydui/dist/lib.px/list'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

import 'vue-ydui/dist/ydui.base.css'

Vue.component(InfiniteScroll.name, InfiniteScroll)
Vue.component(ListTheme.name, ListTheme)
Vue.component(ListItem.name, ListItem)

Vue.prototype.$dialog = {
    toast: Toast,
    confirm: Confirm,
};

export default {
    data() {
        return {
            address: [], // 地址列表
            no_message: false,
            page: 1, // 滚动加载
            pageSize: 10,
            limit: 10,
        }
    },
    components: {
        navHead,
        Toast,
    },
    created() {
        this.loadList();
    },
    filters: {
        formatAddDefault: function(value) {
            if (value == '1') {
                return '默认地址';
            } else {
                return '设为默认';
            }
        }
    },
    methods: {
        loadList() { // 滚动加载
            console.log('触发回调')
            this.axios.get("/wechatauth/user/address/list", {
                params: {
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit,
                    uid: localStorage.getItem('uid'),
                }
            }).then(res => {
                const _list = res.data.datas.rows;
                this.pageSize = res.data.datas.total
                this.address = [...this.address, ..._list];
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
        delAddress(item, i) { //删除地址弹窗
            let that = this;
            this.$dialog.confirm({
                title: `<p style="text-align:center">是否删除</p>`,
                opts: () => {
                    if (item.isDefault) {
                        that.del(item, i)
                    } else {
                        that.del(item, i)
                    }
                }
            });
        },
        del(item, i) { // 删除地址接口
            let that = this;
            this.axios.post('/wechatauth/user/address/del', {
                id: item.id
            }).then(res => {
                that.address.splice(i, 1)
                that.$dialog.toast({ mes: '删除成功', timeout: 1000 });
                if (item.isDefault == 1) {
                    that.put(that.address[0]) //设置默认地址
                }
            })
        },
        setDefault(item) { //设置默认地址
            this.address.map((val, index, arr) => {
                if (val.isDefault) {
                    val.isDefault = 0
                    return;
                }
            })
            this.put(item)
        },
        put(item) { //设置默认地址接口
            if (this.address.length > 0) {
                this.axios.post("/wechatauth/user/address/default", {
                    id: item.id,
                    uid: localStorage.getItem('uid'),
                    isDefault: 1
                }).then(res => {
                    this.$dialog.toast({ mes: '设置默认地址成功', timeout: 1000 });
                    item.isDefault = 1
                })
            }

        },
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
        // this.SDKRegister(this, () => {
        //     console.log('首页调用分享')
        // })
    },
}