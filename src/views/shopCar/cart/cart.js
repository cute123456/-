import Vue from 'vue'
import fixBottom from '@/components/fixBottom'
import Checker from 'vux/src/components/checker/checker.vue'
import CheckerItem from 'vux/src/components/checker/checker-item.vue'
// import XButton from 'vux/src/components/x-button/index.vue'
// import Confirm from 'vux/src/components/confirm/index.vue'
import { Toast } from 'vue-ydui/dist/lib.px/dialog'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.prototype.$dialog = {
    toast: Toast,
};



export default {
    name: 'cart',
    data() {
        return {
            checkAll: false,
            shopPart: false, // 店铺全选
            totalMoney: 0, // 需支付金额
            totalYmoney: 0, // 需支付豆数
            delFlag: false,
            curDel: '',
            editFlag: false, // 编辑购物车
            toDelect: false,
            bussinessId: '', // 店铺id
            shopCar: {}, //
            shopData: [],
            orderId:{}, // 生成的订单id
        }
    },
    components: {
        fixBottom,
        // XButton,
        // Confirm,
        Checker,
        CheckerItem,

    },
    computed: {
        shopNoneFlag: function () { // 购物车中有无商品
            let num = 0
            for(let i in this.shopCar){
                num++
            }
            return num
        },
        checkNum: function () { // 选中的商品数量
            let num = 0;
            for(let i in this.shopCar){
                for (let j in this.shopCar[i].goods) {
                    if (this.shopCar[i].goods[j].checked) {
                        num++
                    }
                }
            }
            return num;
        },
        orderStorage: function () { // 选中的商品信息
            var order_storage  = {}
            for(let i in this.shopCar){
                for (let j in this.shopCar[i].goods) {
                    if (this.shopCar[i].goods[j].checked) {
                        if (!order_storage[i]){
                            order_storage[i] = {}
                        }
                        order_storage[i][j] = this.shopCar[i].goods[j]
                    }
                }
            }
            return order_storage
        },
    },
    created(){
        this.getGoods()
    },
    methods: {
        // 获取商品
        getGoods() {

            this.shopCar = JSON.parse(localStorage.getItem('shopCar'))
            // console.log('读取this.shopCar', this.shopCar)
            if(!this.shopCar){
                this.shopData = []
                return ;
            }
            console.log(this.shopCar)
            for (let i in this.shopCar) { // 循环店铺
                for (let j in this.shopCar[i].goods) { // 循环店铺里的商品
                    this.axios.get('wechatauth/goods/detail', { // 获取详细信息
                        params: {
                            id:j,
                        }}).then(res => {
                            // console.log(res)
                            var shopProduct = res.data.datas;
                            console.log(shopProduct)
                            shopProduct.model = this.shopCar[i].goods[j].model
                            shopProduct.quantity = this.shopCar[i].goods[j].quantity; //商品数量
                            shopProduct.businessId = this.shopCar[i].goods[j].businessId
                            shopProduct.singlePrice = 0
                            // console.log('this.shopCar[i].goods[j].model',this.shopCar[i].goods[j].model)
                            // if (this.shopCar[i].goods[j].model) { // 如果有规格，单价为基础价+规格价之和
                                
                            //     for (let m in this.shopCar[i].goods[j].model){
                            //         shopProduct.singlePrice += parseFloat(this.shopCar[i].goods[j].model[m].ty_price)
                                    
                            //     }
                            //     if (shopProduct.singlePrice === 0) {
                            //         shopProduct.singlePrice = parseFloat(res.data.datas.goods.g_price).toFixed(2)  
                            //     } else {
                            //         shopProduct.singlePrice = parseFloat(shopProduct.singlePrice).toFixed(2)                                    
                            //     }
                                
                            // } else { // 没有规格，单价
                            // }
                            shopProduct.uid = localStorage.getItem('uid') // 用户id
                            shopProduct.checked = false//商品是否被选中
                            this.shopData.push(shopProduct);
                            this.shopCar[i].goods[j] = shopProduct
                            this.shopCar[i].checked = false//店铺是否被选中
                        })
                }
            }
        },
        selectProduct: function (goods,goodses) { // 单个商品选择
            goods.checked = !goods.checked;
            let flag = true
            for(let i in goodses){
                flag = flag && goodses[i].checked 
            }
            this.shopCar[goods.businessId].checked = flag
            // this.checkAll = flag;
            this.updateCheckAll()
            this.calctotalMoney();
        },
        selectShop :function (goodses, bid) { // 选择店铺
            this.shopCar[bid].checked = !this.shopCar[bid].checked
            for(let i in goodses){
                goodses[i].checked = this.shopCar[bid].checked
            }
            this.updateCheckAll()
            this.calctotalMoney();
        },
        checkAllProduct: function () { // 全选
            for(let i in this.shopCar){
                this.shopCar[i].checked = !this.checkAll
                for(let j in this.shopCar[i].goods){
                    this.shopCar[i].goods[j].checked = !this.checkAll
                }
            }
            this.updateCheckAll()
            this.calctotalMoney();
        },
        updateCheckAll(){ //更新checkall
            let flag = true
            let num = 0
            for(let i in this.shopCar){
                num++
                if(!this.shopCar[i].checked){
                    flag = false
                }
            }
            this.checkAll = flag && num
        },
        changequantity: function (goods,num) { // 加减按钮加减数量
            if (num > 0 && goods.quantity < goods.goodsStocks) {
                goods.quantity++;
            } else if (num > 0 && goods.quantity >= goods.goodsStocks) {
                this.$dialog.toast({ mes: '库存不足' });
            } else {
                if (goods.quantity > 1) {
                    goods.quantity--;
                } else {
                    this.$dialog.toast({ mes: '亲，已经最少了哦~' });
                }
            }
            this.calctotalMoney()
            
        },
        delProduct() { // 删除商品
            if (this.checkNum <= 0) {
                this.$dialog.toast({mes: '您还没有选择商品'});
                return
            }
            if (this.checkAll) { // 全选删除
                this.shopCar = {}
            }
            for(let i in this.shopCar){
                if (this.shopCar[i].checked) { // 店铺被选中
                    delete this.shopCar[i]
                }else{
                    for (let j in this.shopCar[i].goods) {
                        if(this.shopCar[i].goods[j].checked){
                            delete this.shopCar[i].goods[j] // 删除店铺下的商品
                        }
                    }
                }
            }
            let temp = {} 
            for (let i in this.shopCar) { // 循环店铺
                temp[i]={name: this.shopCar[i].name,goods: {}}
                for (let j in this.shopCar[i].goods) { // 循环店铺里的商品
                    temp[i].goods[j] = {model: this.shopCar[i].goods[j].model, quantity: this.shopCar[i].goods[j].quantity, businessId: this.shopCar[i].goods[j].businessId}
                }
            }
            localStorage.setItem('shopCar', JSON.stringify(temp))
            
            this.calctotalMoney()
            this.updateCheckAll()
        },
         //计算总金额
        calctotalMoney: function () {
            this.totalMoney = 0;
            for(let i in this.shopCar){
                for(let j in this.shopCar[i].goods){
                    if (this.shopCar[i].goods[j].checked) {
                        this.totalMoney += parseFloat(this.shopCar[i].goods[j].quantity) * parseFloat(this.shopCar[i].goods[j].goodsPrice)
                    }
                }                    
            }
            this.totalMoney = parseFloat(this.totalMoney).toFixed(2)
        },
        goToSettlement: function () { // 下单
            
            if (this.checkNum != 0) {
                this.axios.post('/wechatauth/order/generate',{
                    orders: this.orderStorage }).then(res=>{
                    if (res.data.result) {
                        // this.delProduct() // 去结算删除购物车


                        this.$dialog.toast({ mes: '成功生成订单', timeout: 1500 });
                        this.delProduct() // 去结算删除购物车 
                        
                        this.$router.push('/shopCar/settlement?orderId=' + res.data.datas)
                        
                    } else {
                        this.$dialog.toast({ mes: res.data.message, timeout: 1000 });
                    }
                })
            }else {
                    this.$dialog.toast({mes: '您还没有选择商品！', timeout: 1000});
            }            
        },
    }
}
