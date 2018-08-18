import Vue from 'vue'
import navHead from '@/components/navHead'
import { InfiniteScroll } from 'vue-ydui/dist/lib.px/infinitescroll'
import { ListTheme, ListItem } from 'vue-ydui/dist/lib.px/list'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

import 'vue-ydui/dist/ydui.base.css'

Vue.component(InfiniteScroll.name, InfiniteScroll)
Vue.component(ListTheme.name, ListTheme)
Vue.component(ListItem.name, ListItem)




export default {
    data: function() {
        return {
            addresses: [], //地址列表
            no_message: false,
            page: 1, // 滚动加载
            pageSize: 10,
            limit: 10,
        }
    },
    components: {

        navHead
    },
    created() {
        this.loadList()
    },
    methods: {
        checkAddress(item) {
            this.$router.push('/shopCar/settlement?orderId=' + this.$route.query.orderId + '&addressId=' + item.id)
        },
        loadList() { // 滚动加载
            console.log('触发回调')
            this.axios.get("/wechatauth/user/address/list", {
                params: {
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit,
                }
            }).then(res => {
                console.log(res.data.datas)
                const _list = res.data.datas.rows;
                this.pageSize = res.data.datas.total
                this.addresses = [...this.addresses, ..._list];
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
        goManage() {
            this.$router.push('/my/manageAddress')
        },
        //微信收货地址  
        maddress() {
            Vue.use(WechatPlugin)
            this.$wechat.openAddress({
                success: function(res) {
                    //姓名:res.userName 电话:res.telNumber 邮编:res.postalCode   
                    //省:res.provinceName 市:res.cityName 区:res.countryName 详细地址:res.detailInfo  
                    $(".payone").empty();
                    $(".payone").append('<div style="width: 100%;height: 30px;line-height: 30px;">' +
                        '<span id="userName">' + res.userName + '</span>' +
                        '  <span id="telNumber">电话:' + res.telNumber + '</span>' +
                        '  <span id="postalCode">邮编:' + res.postalCode + '</span>' +
                        '</div>' +
                        '<div style="width: 100%;height: auto;line-height: 30px;">' +
                        '<span id="provinceName">' + res.provinceName + '</span>' +
                        '<span id="cityName">' + res.cityName + '</span>' +
                        '<span id="countryName">' + res.countryName + '</span>' +
                        '<span id="detailInfo">' + res.detailInfo + '</span>' +
                        '</div>');
                    // 用户成功拉出地址   
                },
                cancel: function(res) {
                    // 用户取消拉出地址  
                }
            });
        }

    },
    // beforeRouteEnter(to, from, next) {
    //     next(vm => {
    //         vm.axios.post("/qrcode/share/generate", { openid: localStorage.getItem("openid") }).then((res) => {
    //             if (res.data.result) {
    //                 vm.shareImgData = res.data.datas.share_img
    //                 vm.shareUrl = res.data.datas.share_url
    //             }
    //         });
    //     });
    // },
    // beforeCreate() {
    //     this.SDKRegister(this, () => {
    //         console.log('首页调用分享')
    //     })
    // },
}