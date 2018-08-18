import Vue from "vue";

import 'mint-ui/lib/style.css'
import { Toast, Indicator } from 'mint-ui';
import { IndexList, IndexSection } from 'mint-ui';
import { Cell } from 'mint-ui';
import navHead from '@/components/navHead'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.component(Cell.name, Cell);
Vue.component(IndexList.name, IndexList);
Vue.component(IndexSection.name, IndexSection);
export default {
    name: 'city',
    mounted() {
        this.$nextTick(function() {
            Indicator.close();
        })
        setTimeout(() => {
            this.getCurrentPosition()
        }, 300)
    },
    components: {
        navHead
    },
    data() {
        return {
            city: '',
            nikename: '',
            http: 'http://yhhapi.anasit.com/',
            category: [
                '北京',
                '广州',
                '上海',
                '南京',
                '杭州',
                '武汉',
                '成都',
                '天津',
                '深圳',
                '哈尔滨',
                '重庆',
                '长沙'
            ],
            A: [
                '阿坝', '阿克苏', '阿拉尔', '阿拉善盟', '阿里', '安康', '安庆', '安顺', '安阳',
                '鞍山', '澳门'
            ],
            B: [
                '巴彦淖尔盟', '巴音郭楞', '巴中', '白城', '白沙', '白山', '白银', '白色',
                '蚌埠', '包头', '宝鸡', '保定', '保山', '保亭', '北海', '北京', '本溪', '毕节',
                '滨州', '博尔塔拉'
            ],
            C: [
                '沧州', '昌都', '昌吉', '昌江', '长春', '长沙', '长治', '常德', '常州', '巢湖',
                '朝阳', '潮州', '郴州', '成都', '承德', '澄迈县', '池州', '赤峰', '崇左', '滁州', '楚雄'
            ],
            D: [
                '达州', '大理', '大连', '大庆', '大同', '大兴安岭', '丹东', '德宏', '德阳', '德州',
                '迪庆', '定安县', '定西', '东方', '东莞', '东营'
            ],
            E: [
                '鄂尔多斯', '鄂州', '恩施'
            ],
            F: [
                '防城港', '佛山', '福州', '抚顺', '抚州', '阜新', '阜阳'
            ],
            G: [
                '甘南', '甘孜', '赣州', '固原', '广安', '广元', '广州', '贵港', '贵阳', '桂林', '果洛'
            ],
            H: [
                '哈尔滨', '哈密', '海北', '海东', '海口', '海南', '海西', '邯郸', '汉中', '杭州',
                '合肥', '和田', '河池', '河源', '菏泽', '贺州', '鹤壁', '鹤岗', '黑河', '衡水',
                '衡阳', '红河', '呼和浩特', '呼伦贝尔', '湖州', '葫芦岛', '怀化', '淮安', '淮北',
                '淮南', '黄冈', '黄南', '黄山', '黄石', '惠州'
            ],
            J: [
                '鸡西', '吉安', '吉林', '济南', '济宁', '济源', '佳木斯', '嘉兴', '嘉峪关', '江门',
                '焦作', '揭阳', '金昌', '金华', '锦州', '晋城', '晋中', '荆门', '荆州', '景德镇', '九江', '酒泉'
            ],
            K: [
                '喀什', '开封', '克拉玛依', '克孜勒苏', '昆明'
            ],
            L: [
                '拉萨', '来宾', '莱芜', '兰州', '廊坊', '乐东', '乐山', '丽江', '丽水', '连云港',
                '凉山', '辽阳', '辽源', '聊城', '林芝', '临沧', '临汾', '临高县', '临夏',
                '临沂', '陵水', '柳州', '六安', '六盘水', '龙岩', '陇南', '娄底', '吕梁', '洛阳'
            ],
            M: [
                '马鞍山', '茂名', '眉山', '梅州', '绵阳', '牡丹江'
            ],
            N: [
                '内江', '那曲', '南昌', '南充', '南京', '南宁', '南平', '南通', '南阳', '宁波', '宁德', '怒江'
            ],
            P: [
                '攀枝花', '盘锦', '平顶山', '平凉', '萍乡', '莆田', '普洱'
            ],
            Q: [
                '七台河', '齐齐哈尔', '潜江', '黔东南', '黔南', '黔西南', '钦州', '秦皇岛',
                '青岛', '清远', '庆阳', '琼海', '琼中', '曲靖', '泉州'
            ],
            R: [
                '日喀则', '日照'
            ],
            S: [
                '三门峡', '三明', '三亚', '山南', '汕头', '汕尾', '商洛', '商丘', '上海',
                '上饶', '韶关', '邵阳', '绍兴', '深圳', '神农架林区', '沈阳', '十堰',
                '石河子', '石家庄', '石嘴山', '双鸭山', '朔州', '四平', '松原', '苏州',
                '宿迁', '宿州', '绥化', '随州', '遂宁'
            ],
            T: [
                '台湾', '台州', '太原', '泰安', '泰州', '唐山', '天津', '天门', '天水',
                '铁岭', '通化', '通辽', '铜川', '铜陵', '铜仁', '图木舒克', '吐鲁番', '屯昌县'
            ],
            W: [
                '万宁', '威海', '潍坊', '渭南', '温州', '文昌', '文山', '乌海', '乌兰察布市',
                '乌鲁木齐', '无锡', '吴忠', '芜湖', '梧州', '五家渠', '五指山', '武汉', '武威'
            ],
            X: [
                '西安', '西宁', '西双版纳', '锡林郭勒盟', '厦门', '仙桃', '咸宁', '咸阳',
                '香港', '湘潭', '湘西', '襄樊', '孝感', '忻州', '新乡', '新余', '信阳',
                '兴安盟', '邢台', '徐州', '许昌', '宣城'
            ],
            Y: [
                '雅安', '烟台', '延安', '延边', '盐城', '扬州', '阳江', '阳泉', '伊春',
                '伊犁', '宜宾', '宜昌', '宜春', '益阳', '银川', '鹰潭', '营口', '永州', '榆林',
                '玉林', '玉树', '玉溪', '岳阳', '云浮', '运城'
            ],
            Z: [
                '枣庄', '湛江', '张家界', '张家口', '张掖', '漳州', '昭通', '肇庆', '镇江',
                '郑州', '中山', '中卫', '重庆', '舟山', '周口', '株洲', '珠海', '驻马店',
                '资阳', '淄博', '自贡', '遵义'
            ]
        }
    },
    methods: {

        getCurrentPosition: function() { //定位
            var geolocation = new AMap.Geolocation();
            geolocation.getCurrentPosition((status, result) => {
                if (result && result.position) {
                    this.city = result.addressComponent.city;
                    localStorage.setItem('city', this.city);
                    console.log('定位this.city')
                    console.log(this.city)
                } else {
                    Toast({
                        message: "定位失败，请检查定位服务是否打开",
                        position: 'middle',
                        duration: 3000
                    });
                    console.log('localStorage.city')
                    console.log(localStorage.city)
                    if (localStorage.getItem('city') === 'undefined') {
                        this.city = '南昌市'
                    } else {
                        this.city = localStorage.getItem('city')
                    }
                }
            })
        },
        retryCurrentPosition: function() { //重新定位
            this.city = ''
            this.getCurrentPosition();
        },
        reLocation(city) { // 重新定位的城市
            localStorage.city = city;
            this.$router.push('/');
        },
        goShop: function(city) {
            localStorage.city = city + '市';
            this.$router.push('/');
        },
    },
    // beforeRouteEnter(to, from, next) {
    //     next(vm => {
    //         vm.axios.post("/qrcode/share/generate", { openid: localStorage.getItem("openid")}).then((res) => {
    //             if (res.data.result) {
    //                 vm.shareImgData = res.data.datas.share_img
    //                 vm.shareUrl = res.data.datas.share_url
    //             }
    //         });
    //     });
    // },
    beforeCreate() {
        // this.SDKRegister(this, ()=>{
        //     console.log('首页调用分享')
        // })
    },
}