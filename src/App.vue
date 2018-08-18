<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
    export default {
        name: 'app'
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        width: 100%;
        box-sizing: border-box;
        background-color: #fff !important;
        padding-bottom:80px;
    }
    
    #app::-webkit-scrollbar {
        display: none;
    }
    
    html,
    body {
        width: 100%;
        height: 100%;
        font-family: 'PingFang';
        font-size: 16px;
        min-height: 100%;
        background: #fff;
        font-family: PingFangSC-Regular, sans-serif;
    }
    
    body {
        background: #fff;
    }
    
    * {
        margin: 0;
        padding: 0;
    }
    /* .yd-list-donetip {
        display: none!important;
    } */
    
    .vux-slider>.vux-indicator>a>.vux-icon-dot,
    .vux-slider .vux-indicator-right>a>.vux-icon-dot {
        background: #b6b6b6;
        width: 8px!important;
        height: 8px!important;
    }
    
    .vux-slider>.vux-indicator>a>.vux-icon-dot.active,
    .vux-slider .vux-indicator-right>a>.vux-icon-dot.active {
        background-color: #ec642b!important;
    }
    /* 懒加载 */
    
    img[lazy=loading] {
        background: url('../src/public/img/notFound.jpg') no-repeat center;
        background-size: 100% 100%;
    }
    
    img[lazy=error] {
        /*your style here*/
    }
    
    img[lazy=loaded] {
        /*your style here*/
    }
    
    .category {
        background: #fff!important;
    }
</style>
<style src="@/public/css/reset.css"></style>
<!--公用的样式，很多可以复用好的样式都在里面请注意合理使用 -->