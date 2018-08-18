<template>
    <div class="amap-page-container">
        <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center" :events="events">
        </el-amap>
        <div class="position-box" style="position:relative;">

            <div class="locationCheck"  @click="checkLocation=1">
                <b>自动定位</b>
                <br/>
                <span v-if="loaded">{{address | formateAddress}}</span>
                <span v-else>{{positionResult}}</span>
            </div><!--
                <--><img src="../../../static/imgs/images/dddw.png" icon-class="map" class="location-color" v-if="checkLocation==1" >
                <!--<icon-svg icon-class="map" class="location-color" v-if="checkLocation==1"></icon-svg>-->
        </div>
        <div  class="position-box" style="position:relative;">
            <div class="locationCheck" @click="ifCheckLocation2">
                <b>手动选择</b>
                <br/>
                <span>{{address1 | formateAddress}}</span>
                
            </div>
                <img src="../../../static/imgs/images/dddw.png"  @click="checkLocation=2"  v-if="checkLocation==2" class="location-color" >
                <!--<icon-svg icon-class="map" class="location-color" v-if="checkLocation==2" @click="checkLocation=2"></icon-svg>-->
        </div>
        
        <yd-cityselect v-model="show1" :done="result1" :items="district"></yd-cityselect>
        

        <div id="locationReturn">
            <a @click="locationReturn()">确定</a>
        </div>
    </div>
</template>





<script>
import Vue from 'vue'

import myLocation from './Location'
import District from 'ydui-district/dist/jd_province_city_area_id'
import {CitySelect} from 'vue-ydui/dist/lib.px/cityselect'
import { Toast } from 'mint-ui'

Vue.component(CitySelect.name, CitySelect)

export default{
    data() {
        let self = this;
        return {
            serve_address: '',
            show1: false,
            district: District,
            center: [121.59996, 31.197646],
            lng: 0,
            lat: 0,
            address: {
                province: '',
                city: '',
                district: '',
                street: '',
                streetNumber: '',
                township: ''
            },
            address1: {
                province: '',
                city: '',
                district: '',
                street: '',
                streetNumber: '',
                township: ''
            },
            loaded: false,
            checkMap: false,
            checkLocation:1,
            positionResult: '定位中',
            events: {
                click(e) {
                    let { lng, lat } = e.lnglat;
                    self.lng = lng;
                    self.lat = lat;

                    // 这里通过高德 SDK 完成。
                    var geocoder = new AMap.Geocoder({
                        radius: 1000,
                        extensions: "all"
                    });
                    geocoder.getAddress([lng, lat], function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            if (result && result.regeocode) {
                                // self.address1 = result.regeocode.formattedAddress;
                                console.log(result);
                                self.address1.province = result.regeocode.addressComponent.province;
                                self.address1.city = result.regeocode.addressComponent.city;
                                self.address1.district = result.regeocode.addressComponent.district;
                                self.address1.street = result.regeocode.addressComponent.street;
                                self.address1.streetNumber = result.regeocode.addressComponent.streetNumber;
                                self.address1.township = result.regeocode.addressComponent.township;
                                self.checkMap = true;
                                self.$nextTick();
                            }
                        }
                    });
                }
            },
            plugin: [{
                pName: 'Geolocation',
                events: {
                    init(o) {
                        // o 是高德地图定位插件实例
                        o.getCurrentPosition((status, result) => {
                            if (result && result.position) {
                                self.lng = result.position.lng;
                                self.lat = result.position.lat;
                                self.center = [self.lng, self.lat];
                                self.loaded = true;
                                self.positionResult = '定位成功';
                                Toast({
                                    message: "自动定位成功",
                                    position: 'middle',
                                    duration: 1000
                                });
                                self.$nextTick();
                                // 这里通过高德 SDK 完成。
                                var geocoder = new AMap.Geocoder({
                                    radius: 1000,
                                    extensions: "all"
                                });
                                geocoder.getAddress([self.lng, self.lat], function (status, result) {
                                    if (status === 'complete' && result.info === 'OK') {
                                        if (result && result.regeocode) {

                                            // self.address = result.regeocode.formattedAddress;
                                            self.address.province = result.regeocode.addressComponent.province;
                                            self.address.city = result.regeocode.addressComponent.city;
                                            self.address.district = result.regeocode.addressComponent.district;
                                            self.address.street = result.regeocode.addressComponent.street;
                                            self.address.streetNumber = result.regeocode.addressComponent.streetNumber;
                                            self.address.township = result.regeocode.addressComponent.township;
                                            self.$nextTick();
                                        }
                                    }
                                });
                            } else {
                                self.positionResult = '定位失败';
                                self.checkLocation = 2;
                                Toast({
                                    message: "定位失败，您可以手动选择位置",
                                    position: 'middle',
                                    duration: 3000
                                });
                            }
                        });
                    },
                }
            }]
        };
    },
    filters: {
        formateAddress: function (value) {
            // if (value.street == '') {
            //     return '' + value.province + value.city + value.district + value.township;
            // } else {
                return '' + value.province + value.city + value.district + value.township + value.street + value.streetNumber;
            // }
        }
    },
    methods:{
        result1(ret) {
            this.address1.province = ret.itemName1;
            this.address1.city = ret.itemName2 ;
            this.address1.district = ret.itemName3;
            this.address1.street = '';
            this.address1.streetNumber = '';
            this.address1.township = '';            
            
        },
        ifCheckLocation2:function(){
            
                this.checkLocation = 2;
                this.show1 = true;
        },
        locationReturn:function(){
            var temp = '';
            console.log('checkLocation')
            console.log(this.checkLocation)
            if(this.checkLocation == 1){
                temp = this.address;
                if (temp.province == '') {                
                    Toast({
                        message: "自动定位失败，您可以手动选择",
                        position: 'middle',
                        duration: 3000
                    });
                    return;
                }
            }else{
                temp = this.address1;
                if (temp.province == '') {
                    Toast({
                        message: "手动选择位置不能为空",
                        position: 'middle',
                        duration: 3000
                    });
                    return;
                }
            }
            console.log('temp')
            console.log(temp)
            var addressMessage = temp.province + ' ' + temp.city + ' ' + temp.district ;
            var addressMessageDetails = temp.township + temp.street + temp.streetNumber ;
            var _coverChecked = false;
            console.log('addressMessage','addressMessageDetails','_coverChecked')
            console.log([addressMessage,addressMessageDetails,_coverChecked]);
            this.$emit('child-say', [addressMessage,addressMessageDetails,_coverChecked]);
        }
    },
    created() {
        this.$emit('close');
    }
};
</script>

<style scoped>

.amap-page-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 14px;
    line-height: 1.4286;
    background-color: #f7f7f7;
    color: black;
}

.amap-demo {
    height: 300px;
}            

.locationCheck {
    display: inline-block;
    width: 100%;
    line-height: 25px;
    background-color: #fff;
    border-bottom: 1px solid rgb(209, 219, 229);
}

.locationCheck b {
    font-size: 16px;
}

.locationCheck span {
    color: #999;
}

.location-color {
    color: #f44;
    position: absolute;
    top: 6px;
    font-size: 20px;
    width: 20px;
    height: 20px;
    right: 10px;
}

#locationReturn{
    margin:8px 5px;   
}

#locationReturn a{
    display:block;
    width:100%;
    line-height: 40px;
    font-size: 16px;
    border: 0;
    color: #fff;
    background-color: coral;
    border-radius: 2px;
    text-align:center;
}
.position-box {
    height:55px;
    margin-top:3px;
}
.locationCheck {
    height:auto;
    min-height:55px;
}
.amap-geolocation-con {
    z-index:100
}
</style>

