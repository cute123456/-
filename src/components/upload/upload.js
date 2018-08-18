import Vue from 'vue'
import { Toast, Loading } from 'vue-ydui/dist/lib.px/dialog'

Vue.prototype.$dialog = {
    toast: Toast,
    loading: Loading,
};

export default {
    name: 'uplad',
    props: {
        upName: {},
        camera: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            formFiles: {},
            inputName: '',
        }
    },
    methods: {
        editImage: function() {
            this.$emit('update:upName', false) //子组件更新父组件的值
        },
        fileChange: function(e) {
            this.$dialog.loading.open();
            var fileSize = 0;
            let _file = e.target.files[0];
            let _name = e.target.name;

            fileSize = _file.size
            if (fileSize > 8 * 1024 * 1024) {
                this.$dialog.toast({ mes: '文件不能大于8M' });
                e.target.value = '';
                return
            }
            this.formFiles[_name] = _file;

            // 获取图片路径
            let formData = new FormData();
            formData.append('src', this.formFiles[_name]);
            this.axios.post('/wechatauth/upload/image', formData).then(res => {
                this.$emit('update:upName', res.data.datas) //子组件更新父组件的值
                this.$dialog.loading.close();
                // setTimeout(()=>{
                //     console.log('组件this.upName',this.upName)
                // },500)
            })

            e.target.value = ''; //虽然file的value不能设为有字符的值，但是可以设置为空值
        },
    }
}