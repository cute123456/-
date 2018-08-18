/**
 * 商品分类 
 * @file calssList.js 
 * @author yangxia 
 * @date 2018-06-19 17:10:30 
 */
import Vue from 'vue'
import fixBottom from '@/components/fixBottom'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

export default {
    data() {
        return {
            activeId: '',
            oneClass: [], // 一级分类
            secondClass: [], // 二级分类
            selectedValue: '',
            message: '', //搜索的内容
        }
    },
    components: {
        fixBottom,
    },
    created() {
        this.getLists();
        this.getClassify(this.$route.query.id);
        if (sessionStorage.getItem('classId')) {
            this.activeId = sessionStorage.getItem('classId')
        } else {
            this.activeId = this.$route.query.id
        }
    },
    methods: {
        /**
         * 切换一级分类
         * @param {*} id 
         */
        getClassify(id) {
            //获取对应的二级分类
            this.activeId = id
            sessionStorage.setItem('classId', id)

            this.axios.get('/wechatauth/goods/type/two', {
                params: {
                    id: id
                }
            }).then(res => {
                this.secondClass = res.data.datas;
            })
            console.log(this.activeId)

        },
        /**
         * 获得左侧分类列表信息
         */
        getLists() {
            this.axios.get('/wechatauth/goods/type/one').then(res => {
                this.oneClass = res.data.datas;
                this.getClassify(this.activeId);
                localStorage.setItem('classId', this.oneClass[0].id)
            })
        },
        /**
         * 跳转到详情
         */
        golist(id) {
            this.$router.push('/classifyDetail/list?id=' + id);
        },
    },
    beforeCreate() {
        this.SDKRegister(this, () => {
            console.log('分类页调用分享')
        })
    },

};