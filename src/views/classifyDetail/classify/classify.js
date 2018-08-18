import Vue from 'vue'
import fixBottom from '@/components/fixBottom'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

export default {
    data() {
        return {
            activeId: 1,
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
        this.getLists()
        if (sessionStorage.getItem('classId')) {
            this.activeId = sessionStorage.getItem('classId')
        } else {
            this.activeId = this.$route.query.id
        }
    },
    methods: {
        /**
         * 跳转到详情
         */
        golist() {
            // this.$router.push('/classifyDetail/list?id=' + id);
            console.log(111)
        },
        /**
         * 切换一级分类
         * @param {*} id 
         */
        getClassify(id) { // 
            //获取对应的二级分类
            this.activeId = id
            sessionStorage.setItem('classId', id)

            this.axios.get('/class/list', {
                params: {
                    parentid: id
                }
            }).then(res => {
                this.secondClass = res.data.datas
            })

        },
        /**
         * 获得左侧分类列表信息
         */
        getLists() {
            this.axios.get('/class/list', {
                params: {
                    parentid: 0
                }
            }).then(res => {
                this.oneClass = res.data.datas
                this.getClassify(this.activeId)
            })
        },

    },

}