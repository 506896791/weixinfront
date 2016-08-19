"use strict";
angular.module("wealth-app-dep", ["ui.router", "ngAnimate", "angular-gestures", "wealth-app.directives", "wealth-app.interceptor", "wealth-app.filter", "wealth-app.common-services", "wealth-app.common-controllers", "wealth-app.bill.controllers", "wealth-app.bill.services", "wealth-app.voice.controllers", "wealth-app.voice.services", "wealth-app.bill-operate.controllers", "wealth-app.bill-operate.services", "wealth-app.category.controllers", "wealth-app.category.services", "wealth-app.more.controllers", "wealth-app.currency.controllers", "wealth-app.currency.services", "wealth-app.shopping.controllers", "wealth-app.shopping.services"]);
var wealthApp = angular.module("wealth-app", ["wealth-app-dep"]);
wealthApp.run(["$rootScope", "$state", "$stateParams", "CONFIGURATION", "wxApi", function(a, b, c, d, e) {
    a.$state = b,
    a.$stateParams = c;
    a.global = {
        year: (new Date).getFullYear(),
        host: d.HOST,
        isLogin: !1,
        user: {},
        info: {
            isBlur: !1
        },
        style: 0
    };
    a.$on("$locationChangeSuccess", function(a, b, c, d) {
        e.initConfig(),
        e.ready(function() {
            e.hideOptionMenu()
        }
        ),
        Ta && Ta.pgv && Ta.pgv()
    }
    ),
    FastClick && FastClick.attach(document.body)
}
]),
wealthApp.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", "$animateProvider", "hammerDefaultOptsProvider", function(a, b, c, d, e) {
    b.otherwise("/index"),
    a.state("index", {
        url: "/index",
        controller: "IndexController",
        templateUrl: "views/bill/index.html"
    }).state("shopping-fast", {
        url: "/shopping-fast",
        controller: "ShoppingFastController",
        templateUrl: "views/shopping/index.html"
    }).state("currency-fast", {
        url: "/currency-fast",
        controller: "CurrencyFastController",
        templateUrl: "views/currency/calculator.html"
    }).state("record-fast", {
        url: "/record-fast",
        controller: "RecordFastController",
        templateUrl: "views/voice/record-fast.html"
    }).state("category-edit", {
        url: "/category-edit",
        controller: "CategoryEditController",
        templateUrl: "views/category/category-edit.html"
    }).state("wxsdk", {
        url: "/wxsdk",
        templateUrl: "views/bill/demo.html"
    }).state("analysis", {
        url: "/analysis",
        templateUrl: "views/bill/analysis.html",
        controller: "AnalysisController"
    }).state("proxy", {
        url: "/proxy/:page",
        templateUrl: "views/common/proxy.html",
        controller: "ProxyController"
    }).state("404", {
        url: "/404",
        templateUrl: "views/common/404.html"
    }).state("_dialog", {
        url: "/_dialog/:id",
        templateUrl: "views/common/404.html"
    }),
    d.classNameFilter(/ani-/),
    c.interceptors.push("userInterceptor"),
    c.defaults.useXDomain = !0,
    delete c.defaults.headers.common["X-Requested-With"];
    var f = function(a) {
        var b, c, d, e, g, h, i, j = "";
        for (b in a)
            if (c = a[b],
            c instanceof Array)
                for (i = 0; i < c.length; ++i)
                    g = c[i],
                    d = b + "[" + i + "]",
                    h = {},
                    h[d] = g,
                    j += f(h) + "&";
            else if (c instanceof Object)
                for (e in c)
                    g = c[e],
                    d = b + "[" + e + "]",
                    h = {},
                    h[d] = g,
                    j += f(h) + "&";
            else
                void 0 !== c && null  !== c && (j += encodeURIComponent(b) + "=" + encodeURIComponent(c) + "&");
        return j.length ? j.substr(0, j.length - 1) : j
    }
    ;
    c.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8",
    c.defaults.transformRequest = [function(a) {
        return angular.isObject(a) && "[object File]" !== String(a) ? f(a) : a
    }
    ],
    c.defaults.withCredentials = !0,
    e.set({
        recognizers: [[Hammer.Pan, {
            direction: Hammer.DIRECTION_ALL,
            threshold: 50,
            pointer: 0
        }], [Hammer.Press], [Hammer.Tap, {
            threshold: 50,
            time: 25e3,
            taps: 1
        }, ["press", "pan"]], [Hammer.Tap, {
            event: "doubletap",
            taps: 2
        }, ["tap"]], [Hammer.Swipe, {
            direction: Hammer.DIRECTION_ALL,
            velocity: 1e-6,
            threshold: 1
        }, ["pan"]]]
    })
}
]),
angular.module("wealth-app").constant("CONFIGURATION", {
    HOST: "http://duo.qq.com/api/",
    JSAPI_URL: "http://w.duo.qq.com/jsApi.php",
    DEV: !1
}),
angular.module("wealth-app").run(["$templateCache", function(a) {
    a.put("views/bill-operate/edit.html", '    <!-- 页面整体(此结构用来对页面整体做模糊效果) start -->\r\n    <div class="page-wrapper show ani-dialogPage">\r\n        <!-- 头部 start -->\r\n        <header class="header">\r\n            <div class="left">\r\n                <a href="" ng-click="cancelBillEdit();">返回</a>\r\n            </div>\r\n            <h3 class="title">账目明细</h3>\r\n            <div class="right">\r\n                <a href="" class="em" ng-click="saveBillEdit();"\r\n                ng-show="hasChanged">\r\n                    保存\r\n                </a>\r\n            </div>\r\n        </header>\r\n        <!-- 头部 end -->\r\n\r\n        <!-- 主体 start -->\r\n        <div class="body pg-manual-record"><!-- 每个页面对应一个 pg-xxx，用于处理该页面的样式 -->\r\n            <!-- 公用列表 start -->\r\n            <ul class="gui-list">\r\n                <li ng-click="showNums($event);" ng-class="{selected : ifShowNums}">\r\n                    <h3 class="list-title">金额</h3>\r\n                    <div class="list-ctn large" ><!-- 需要加大字号显示时加上 large -->\r\n                        {{inputVal}}\r\n                    </div>\r\n                </li>\r\n                <li>\r\n                    <h3 class="list-title">日期</h3>\r\n                    <div class="list-ctn">\r\n                        <time id="date_container_trigger" class="time"><i class="gui-i calendar"></i>{{billInfo.newTime}}</time>\r\n                    </div>\r\n                </li>\r\n\r\n                <li ng-click="hideNums($event);">\r\n                    <h3 class="list-title">类别</h3>\r\n                    <div class="list-ctn" ng-click="showCateogrySelect();">\r\n                        <i class="gui-category-icon" style="color:{{billInfo.category.color}}" ng-bind-html="billInfo.category.icon|toTrusted">\r\n                        </i>{{billInfo.category.name | showName:billInfo.category.parentName}}\r\n                    </div>\r\n                </li>\r\n                <li ng-click="hideNums($event);">\r\n                    <h3 class="list-title">备注</h3>\r\n                    <div class="list-ctn edit">\r\n                        <textarea elastic name="" placeholder="点击输入备注信息" rows="1" ng-model="billInfo.remark"></textarea>\r\n                    </div>\r\n                </li>\r\n            </ul>\r\n            <!-- 公用列表 end -->\r\n        </div>\r\n        <!-- 主体 end -->\r\n\r\n        <!-- 手工记账按钮组 start -->\r\n        <div class="pg-manual-record-btns" ng-show="ifUpdateBill">\r\n            <button class="gui-btn outline s" ng-click="deleteBill(billInfo);">删除账目</button>\r\n        </div>\r\n        <!-- 手工记账按钮组 end -->\r\n    </div>\r\n    <!-- 页面整体 end -->\r\n\r\n    <!-- 公用数字键盘 start -->\r\n    <div class="gui-num-keyboard" ng-show="ifShowNums">\r\n        <ul class="list">\r\n            <li ng-repeat="num in nums" ng-click="inputNum(num)"\r\n' + "            ng-class=\"{dot : num==='.', 'delete' : num==='', 'zero' : num ===0, 'clear' : num === '清空', 'sure': num==='确定'}\">\r\n            <i>{{num}}</i></li>\r\n        </ul>\r\n    </div>\r\n    <!-- 公用数字键盘 end -->\r\n    <div class=\"\" id=\"date_container\">\r\n\r\n    </div>\r\n"),
    a.put("views/bill/analysis.html", '<!-- 页面整体(此结构用来对页面整体做模糊效果) start -->\n   <!--  <atomu-date-picker config="{{opts}}"></atomu-date-picker> -->\n        <div id="datepicker_container"></div>\n        <div class="page-wrapper">\n            <!-- 头部 start -->\n            <header class="header">\n                <div class="left">\n                    <a href="javascript:void(0);"  ng-click="$state.go(\'index\',\'\')">返回</a>\n                </div>\n                <h3 class="title">支出统计</h3>\n                <div class="right">\n                    <a href="javascript:void(0);" id="datepicker_trigger"><i class="gui-i calendar"></i></a>\n                </div>\n            </header>\n            <!-- 头部 end -->\n\n            <!-- 主体 start -->\n            <div class="body pg-report">\n                <!-- 累计支出 start -->\n                <div class="expend-summary cf">\n                    <div class="sum-data">\n                        <time>{{month}}</time>\n                        <span class="price">{{summary}}元</span>\n                    </div>\n                </div>\n                <!-- 累计支出 end -->\n\n                <!-- 公用无数据 start -->\n                <div class="gui-nodata" ng-if="summary == 0">\n                    <div class="nodata-inner">\n                        <i class="gui-i nodata icon"></i>\n                        <p>本月暂无收支记录，赶快记一笔吧！</p>\n\n                        <div class="nodata-btns">\n                            <button class="gui-btn" ng-click="showVoiceInput()"><i class="gui-i voice"></i>语音记账</button>\n                            <button class="gui-btn link" ng-click="showBillAdd()">手动记账</button>\n                        </div>\n                    </div>\n                </div>\n                <!-- 公用无数据 end -->\n\n                <!-- 支出走势 start -->\n                <div class="gui-chart-box expend-trend" id="line_container" ng-hide="summary == 0">\n                    <!--\n                    颜色信息：\n                    侧/纵轴文字颜色：#999999\n                    图表上虚线的颜色：#dddee0\n                    趋势图色块的颜色：#f94b15 透明度为0.2  rgba(249,75,21,0.2)\n                    色块上折线的颜色：#f94b15\n                    折线上圆点的颜色：#f94b15  边框大小为2px，颜色为 #ffffff\n                    数值背景色：#f94b15，文字颜色：#ffffff\n                    -->\n                    <highchart id="line"\n                               series="lineChart.series"\n                               title="lineChart.title"\n                               options="lineChart.options">\n                    </highchart>\n                </div>\n                <!-- 支出走势 end -->\n\n                <!-- 支出分类占比 start -->\n                <div class="gui-chart-box expend-percent" ng-hide="summary == 0">\n                    <!-- 支出分类占比 start -->\n                    <div class="chart" id="pie_container" >\n                        <!--\n                        颜色信息：\n                        餐饮：#ff9f12\n                        投资：#04a9f4\n                        购物：#fa6383\n                        居家：#3dc240\n                        收入：#f94b15\n                        -->\n                        <highchart id="pie"\n                                   series="pieChart.series"\n                                   title="pieChart.title"\n                                   options="pieChart.options">\n                        </highchart>\n                    </div>\n                    <!-- 支出分类占比 end -->\n\n                    <ul class="gui-chart-info">\n                        <li ng-repeat="bill in column | orderBy:\'-percent\'">\n                            <div class="category-icon"><i class="gui-category-icon" data-name="{{bill.name}}" style="color:{{bill.icon[global.style].color}};" ng-bind-html="bill.icon[global.style].code|toTrusted"></i></div>\n                            <div class="info-data">\n                                <h3>{{bill.name}}</h3>\n                                <span class="data">{{bill.y|number:1}}</span>\n                                <span class="percent">{{bill.percent}}</span>\n                            </div>\n                            <div class="gui-process lunch"><em style="width:{{bill.percent}}"></em></div>\n                        </li>\n\n                    </ul>\n\n                </div>\n                <!-- 支出分类占比 end -->\n            </div>\n            <!-- 主体 end -->\n        </div>\n'),
    a.put("views/bill/demo.html", '<div ng-include src="\'views/common.html\'"></div>\n<div style="height: 50px;background-color: #df2" ng-controller="DemoComponentCtrl">\n<div test-touchend="{touchendCallback:touchendCallback}"></div>\n<div test-touchcancel></div>\n</div>\n<!-- 主体 s?tart -->  \n<div class="" ng-controller="DemoComponentCtrl">\n    <div class="lbox_close wxapi_form">\n      <h3 id="menu-basic">ng-click测试</h3>\n      <p class="desc">判断ng-click是否生效</p>\n      <button class="btn btn_primary" ng-click="testNgClick()">testNgClick</button>\n      <h3 id="menu-basic">基础接口</h3>\n      <p class="desc">判断当前客户端是否支持指定JS接口</p>\n      <button class="btn btn_primary" ng-click="checkJsApi()">checkJsApi</button>\n      <h3 id="menu-share">分享接口</h3>\n      <p class="desc">获取“分享到朋友圈”按钮点击状态及自定义分享内容接口</p>\n      <button class="btn btn_primary" ng-click="onMenuShareTimeline()">onMenuShareTimeline</button>\n      <p class="desc">获取“分享给朋友”按钮点击状态及自定义分享内容接口</p>\n      <button class="btn btn_primary" ng-click="onMenuShareAppMessage()">onMenuShareAppMessage</button>\n      <p class="desc">获取“分享到QQ”按钮点击状态及自定义分享内容接口</p>\n      <button class="btn btn_primary" ng-click="onMenuShareQQ()">onMenuShareQQ</button>\n      <p class="desc">获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口</p>\n      <button class="btn btn_primary" ng-click="onMenuShareWeibo()">onMenuShareWeibo</button>\n\n      <h3 id="menu-image">图像接口</h3>\n      <p class="desc">拍照或从手机相册中选图接口</p>\n      <button class="btn btn_primary" ng-click="chooseImage()">chooseImage</button>\n      <p class="desc">预览图片接口</p>\n      <button class="btn btn_primary" ng-click="previewImage()">previewImage</button>\n      <p class="desc">上传图片接口</p>\n      <button class="btn btn_primary" ng-click="uploadImage()">uploadImage</button>\n      <p class="desc">下载图片接口</p>\n      <button class="btn btn_primary" ng-click="downloadImage()">downloadImage</button>\n\n      <h3 id="menu-voice">音频接口</h3>\n      <p class="desc">开始录音接口</p>\n      <button class="btn btn_primary" ng-click="startRecord()">startRecord</button>\n      <p class="desc">停止录音接口</p>\n      <button class="btn btn_primary" ng-click="stopRecord()">stopRecord</button>\n      <p class="desc">播放语音接口</p>\n      <button class="btn btn_primary" ng-click="playVoice()">playVoice</button>\n      <p class="desc">暂停播放接口</p>\n      <button class="btn btn_primary" ng-click="pauseVoice()">pauseVoice</button>\n      <p class="desc">停止播放接口</p>\n      <button class="btn btn_primary" ng-click="stopVoice()">stopVoice</button>\n      <p class="desc">上传语音接口</p>\n      <button class="btn btn_primary" ng-click="uploadVoice()">uploadVoice</button>\n      <p class="desc">下载语音接口</p>\n      <button class="btn btn_primary" ng-click="downloadVoice()">downloadVoice</button>\n\n      <h3 id="menu-smart">智能接口</h3>\n      <p class="desc">识别音频并返回识别结果接口</p>\n      <button class="btn btn_primary" ng-click="translateVoice()">translateVoice</button>\n\n      <h3 id="menu-device">设备信息接口</h3>\n      <p class="desc">获取网络状态接口</p>\n      <button class="btn btn_primary" ng-click="getNetworkType()">getNetworkType</button>\n\n      <h3 id="menu-location">地理位置接口</h3>\n      <p class="desc">使用微信内置地图查看位置接口</p>\n      <button class="btn btn_primary" ng-click="openLocation()">openLocation</button>\n      <p class="desc">获取地理位置接口</p>\n      <button class="btn btn_primary" ng-click="getLocation()">getLocation</button>\n\n      <h3 id="menu-webview">界面操作接口</h3>\n      <p class="desc">隐藏右上角菜单接口</p>\n      <button class="btn btn_primary" ng-click="hideOptionMenu()">hideOptionMenu</button>\n      <p class="desc">显示右上角菜单接口</p>\n      <button class="btn btn_primary" ng-click="showOptionMenu()">showOptionMenu</button>\n      <p class="desc">关闭当前网页窗口接口</p>\n      <button class="btn btn_primary" ng-click="closeWindow()">closeWindow</button>\n      <p class="desc">批量隐藏功能按钮接口</p>\n      <button class="btn btn_primary" ng-click="hideMenuItems()">hideMenuItems</button>\n      <p class="desc">批量显示功能按钮接口</p>\n      <button class="btn btn_primary" ng-click="showMenuItems()">showMenuItems</button>\n      <p class="desc">隐藏所有非基础按钮接口</p>\n      <button class="btn btn_primary" ng-click="hideAllNonBaseMenuItem()">hideAllNonBaseMenuItem</button>\n      <p class="desc">显示所有功能按钮接口</p>\n      <button class="btn btn_primary" ng-click="showAllNonBaseMenuItem()">showAllNonBaseMenuItem</button>\n    </div>\n</div>\n<!-- 主体 end -->  '),
    a.put("views/bill/index.html", '    <div id="datepicker_container"></div>\n    <div class="page-wrapper" ng-class="{blur:global.info.isBlur}" id="index-wrapper">\n        <!-- 头部 start -->\n        <header class="header transparent"><!-- 头部背景透明且标题隐藏时加上 transparent -->\n            <div class="left">\n                <a href="javascript:void(0);" class="link-calendar" id="datepicker_trigger"><i class="gui-i calendar"></i>{{selectedYearMonth}}</a>\n            </div>\n            <h3 class="title">我的账单</h3>\n            <div class="right">\n                <a ui-sref="analysis"><i class="gui-i chart"></i></a>\n                <a href="" ng-click="showMore();"><i class="gui-i more"></i></a>\n\n            </div>\n        </header>\n        <!-- 头部 end -->\n\n        <!-- 主体 start -->\n        <div class="body pg-index">\n            <!-- 概览 start -->\n            <section class="overview-box">\n                <div class="box-inner">\n                    <div class="summary">\n                        <i class="avatar"><img ng-src="{{userInfo.avatar}}" alt=""></i>\n                        <ul class="money">\n                            <li>\n                                <h3>支出</h3>\n                                <p><em ng-bind="summaryBillInfo.payout">0</em>元</p>\n                            </li>\n                            <li>\n                                <h3>收入</h3>\n                                <p><em ng-bind="summaryBillInfo.income">0</em>元</p>\n                            </li>\n                        </ul>\n                        <!-- <div class="money">\n                            <h3>当月余额</h3>\n                            <p><em ng-bind="summaryBillInfo.sum">0</em>元</p>\n                        </div> -->\n                    </div>\n                    <!-- <div class="balance-info">\n                        <span class="item">\n                            <em ng-bind="summaryBillInfo.income">0</em>\n                            <h4>收入</h4>\n                        </span>\n                        <span class="line"></span>\n                        <span class="item">\n                            <em ng-bind="summaryBillInfo.payout">0</em>\n                            <h4>支出</h4>\n                        </span>\n                    </div> -->\n                    <div class="record-btns">\n                        <button class="voice-btn" ng-click="showVoiceInput();"><i class="gui-i voice"></i>语音记账</button>\n                        <button class="manual-btn" ng-click="showBillAdd();">手动记账</button>\n                    </div>\n                </div>\n            </section>\n            <!-- 概览 end -->\n\n            <!-- 公用无数据 start -->\n            <div class="gui-nodata" ng-if="isHideSummaryList()">\n                <div class="nodata-inner">\n                    <i class="gui-i nodata icon"></i>\n                    <p>本月暂无收支记录，赶快记一笔吧！</p>\n                </div>\n            </div>\n            <!-- 公用无数据 end -->\n\n            <!-- 公用tab切换 start -->\n            <div class="tab-wrap" ng-hide="isHideSummaryList()">\n                <div class="gui-tab">\n                    <div class="hd">\n                        <ul class="tab-ctrl cf">\n                            <li ng-class="{current:index.showRecord}" ng-click="showRecord()"><a href="javascript:void(0);">本月流水</a></li>\n                            <li ng-class="{current:index.showCategory}" ng-click="showCategory();"><a href="javascript:void(0);">分类汇总</a></li>\n                        </ul>\n                    </div>\n                    <div class="bd">\n                        <div  ng-if="index.showRecord">\n                            <!-- 本月流水 start -->\n                            <ul class="consume-flow" >\n                                <li ng-repeat="item in listBillItems track by $index" ng-click="showBillEdit(item)" >\n                                    <time class="time" ng-if="item.isShowDate" ><span>{{item.date|date:\'M月d日\'}}</span></time>\n\n                                    <a href="javascript:void(0);">\n\n                                        <span class="flow-icon"><i class="gui-category-icon" data-name="{{::item.name}}" style="color:{{::item.icon[global.style].color}};" ng-bind-html="item.icon[global.style].code|toTrusted"></i></span>\n                                        <div class="flow-ctn">\n                                            <div class="inner">\n                                                <h3>{{::item.name|showName:item.parentName}}</h3>\n                                                <p>{{::item.remark}}</p>\n                                            </div>\n                                        </div>\n                                        <div class="price">{{::item.money}}</div>\n                                    </a>\n                                </li>\n                            </ul>\n                            <!-- 本月流水 end -->\n\n                            <!-- 列表底部提示 start -->\n                            <div class="gui-loading-box" ng-if="listBillInfo.isLoading">\n                                <div class="inner">\n                                    <i class="gui-i loading"></i>加载数据中……\n                                </div>\n                            </div>\n                            <div class="gui-list-end" ng-if="listBillInfo.isLastPage">\n                                没有更多啦~\n                            </div>\n                            <!-- 列表底部提示 end -->\n                        </div>\n\n                        <div  ng-if="index.showCategory">\n                            <!-- 分类汇总 start -->\n                            <ul class="consume-flow category">\n                                <li ng-repeat="item in statCategoryItems track by $index" ng-click="isOpen = !isOpen" ng-class="{open:isOpen}">\n                                    <a href="javascript:void(0);">\n                                        <h3 class="title"><span class="icon"><i class="gui-category-icon" data-name="{{item.name}}" style="color:{{item.icon[global.style].color}};" ng-bind-html="item.icon[global.style].code|toTrusted"></i></span>{{::item.name}}</h3>\n                                        <div class="price">{{::item.money}}<i class="gui-i trigger"></i></div>\n                                    </a>\n                                    <ul class="flow-detail" ng-click="$event.stopPropagation()">\n                                        <li ng-repeat="detailItem in item.detail track by $index" ng-click="showSubList(detailItem);">\n                                            <h4 class="detail-title">{{::detailItem.name}}</h4>\n                                            <p class="detail-price">{{::detailItem.money}}</p>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </ul>\n                            <!-- 分类汇总 end -->\n\n                            <!-- 列表底部提示 start -->\n                            <div class="gui-list-end" ng-if="statCategoryItems.length > 2">\n                                没有更多啦~\n                            </div>\n                            <!-- 列表底部提示 end -->\n                        </div>\n                    </div>\n\n                </div>\n            </div>\n            <!-- 公用tab切换 end -->\n        </div>\n        <!-- 主体 end -->\n    </div>\n    <!-- 页面整体 end -->\n    <!-- <div ng-include=" \'views/common/voice.html\' "></div> -->\n'),
    a.put("views/bill/sub-list.html", '    <div class="page-wrapper show">\n        <!-- 头部 start -->\n        <header class="header">\n            <div class="left">\n                <a href="" ng-click="closeSelf();">返回</a>\n            </div>\n            <h3 class="title">分类流水</h3>\n        </header>\n        <!-- 头部 end -->\n\n        <!-- 主体 start -->\n        <div class="body pg-category-flow"><!-- 每个页面对应一个 pg-xxx，用于处理该页面的样式 -->\n            <ul class="category-flow">\n                <li ng-repeat="item in subList track by $index" ng-click="showBillEdit(item)">\n                    <a href="javascript:void(0);">\n                    <span class="icon">\n                        <i class="gui-category-icon" data-name="{{item.name}}" style="color:{{item.color}};" ng-bind-html="item.icon|toTrusted"></i>\n                    </span>\n                    <div class="title">\n                        <h3>{{item.name}}</h3>\n                        <p>\n                            <time>{{item.date|date:\'MM月dd日\'}}</time><span>{{item.remark}}</span>\n                        </p>\n                    </div>\n                    <div class="price">{{item.money}}</div>\n                    </a>\n                </li>\n            </ul>\n        </div>\n        <!-- 主体 end -->\n    </div>\n    <!-- 页面整体 end -->\n'),
    a.put("views/category/category-edit.html", '    <div class="page-wrapper show"><!-- 页面整体(此结构用来对页面整体做模糊效果) start -->\n        <!-- 头部 start -->\n        <header class="header">\n            <div class="left">\n                <!-- <a href="javascript:;" ng-click="$state.go(\'index\')"><i class="gui-i home"></i></a> -->\n                <a href="javascript:;" ng-click="leavePage()" ng-if="popType !== \'back\'"><i class="gui-i home"></i></a>\n                <a href="javascript:;" ng-click="leavePage()" ng-if="popType === \'back\'">返回</a>\n            </div>\n            <h3 class="title">分类管理</h3>\n            <div class="right">\n                <a href="" class="em" ng-click="saveResult();">保存</a>\n            </div>\n        </header>\n        <!-- 头部 end -->\n\n        <!-- 主体 start -->\n        <div class="body pg-new-category"><!-- 每个页面对应一个 pg-xxx，用于处理该页面的样式 -->\n            <!-- 侧边栏主类别 start -->\n            <div class="category-sidebar">\n                <div class="inner">\n                    <ul class="category-list">\n                        <li class="collection" ng-click="showMarkList()" ng-class="{current : showOpt.isMarkList}"><!-- 收藏链接单独加上 collection -->\n                            <div class="item">\n                                <span class="icon"><i class="gui-category-icon" data-name="收藏" >&#x37;</i></span>收藏\n                            </div>\n                        </li>\n                    </ul>\n                    <ul class="category-list" ng-sortable="cateSortConf" >\n                        <li ng-repeat="category in categories track by $index" ng-class="{current : showOpt.isCategoryList && curCategoryId === category.id}"  ng-click="selectCategory(category.id)" data-id="{{category.id}}" style="position:relative;">\n                            <div class="item">\n                                <span class="icon"><i class="gui-category-icon" data-name="{{category.name}}"  ng-bind-html="category.icon|toTrusted"></i></span>{{category.name}}\n                            </div>\n                            <!-- <img src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==" alt="" style="width: 100%; height: 100%; position: absolute; top: 0px; left: 0px; z-index: 99;-webkit-user-select: none;-webkit-touch-callout: none;pointer-events: none;" width="100%" height="100%"> -->\n                            <div style="width: 100%; height: 100%; position: absolute; top: 0px; left: 0px; z-index: 99;font-size: 60px;line-height: 60px;color:#000;white-space: nowrap;overflow:hidden;visibility: hidden;"> funk you android</div>\n                        </li>\n                    </ul>\n                    <ul class="category-list">\n                        <li class="add" ng-click="showAddNewCate()" ng-class="{current : showOpt.isNewCate}">\n                            <div class="item">\n                                <span class="icon"><i class="gui-icon add"></i></span>添加\n                            </div>\n                        </li>\n                    </ul>\n                </div>\n            </div>\n            <!-- 侧边栏主类别 end -->\n\n            <!-- 收藏子类别 start -->\n            <div class="category-main" ng-if="showOpt.isMarkList">\n                <h3 class="main-title">\n                    <span class="icon"><i class="gui-category-icon" data-name="收藏" style="background-color:#f94b15;">&#x37;</i></span>收藏\n                </h3>\n                <ul class="sub-category-list" ng-sortable="markSortConf">\n\n                    <li ng-repeat="markItem in markList track by $index" data-id="{{markItem.id}}" class="uneditable">\n\n                        <div class="item" >{{markItem.name}}<span class="extra js-sort-handle" prevent-default><i class="gui-icon line"></i></span></div>\n                    </li>\n                    <li ng-if="markList.length == 0">\n                        <div class="item">暂无收藏</div>\n                    </li>\n                </ul>\n            </div>\n            <!-- 收藏子类别 end -->\n            <!-- 普通子类别 start -->\n            <div class="category-main" ng-if="showOpt.isCategoryList">\n                <h3 class="main-title" ng-if="!curCategory.type">\n                    <span class="icon"><i class="gui-category-icon" data-name="{{curCategory.name}}" style="background-color: {{curCategory.color}};" ng-bind-html="curCategory.icon|toTrusted"></i></span>\n                    {{curCategory.name}}\n                </h3>\n                <h3 class="main-title" ng-if="curCategory.type==1">\n                    <span class="icon" ng-click="showCateogryIconSelect(curCategory.iconName)"><i class="gui-category-icon" data-name="{{curCategory.name}}" style="background-color:{{curCategory.color}};" ng-bind-html="curCategory.icon|toTrusted"></i></span>\n                    <input type="text" ng-change="updatCategory(curCategory);" ng-model="curCategory.name" placeholder="分类名称" ng-model-options="{updateOn: \'blur\'}" ng-focus="showOpt.isFocus=true" ng-blur="showOpt.isFocus=false">\n                    <button class="btn-delete" ng-click="deleteCategory(curCategory);"><i class="gui-i trash-red"></i></button>\n                </h3>\n\n                <ul class="sub-category-list" ng-sortable="subCateSortConf">\n\n                    <li ng-repeat="subCategory in subCategories track by $index" swipe-left="slideLeft(subCategory, $event)" swipe-right="slideRight(subCategory, $event)" hm-swipe-opts="{preventDefault: false}" ng-class="{delete: subCategory.deleted, uneditable: subCategory.type!==1}" data-id="{{subCategory.id}}">\n\n                        <!-- <div class="item" ng-if="!subCategory.type"><input type="text"ng-model="subCategory.name" readonly><span class="extra js-sort-handle" prevent-default><i class="gui-icon line"></i></span></div> -->\n                        <div class="item" ng-if="!subCategory.type">{{subCategory.name}}<span class="extra js-sort-handle" prevent-default><i class="gui-icon line"></i></span></div>\n\n                        <div class="item" ng-if="subCategory.type === 1"><input type="text" placeholder="分类名称" ng-model="subCategory.name"\n                        ng-change="updateSubCategory($index, subCategory);" ng-model-options="{updateOn: \'blur\'}" auto-float-on-keyboard><span class="extra js-sort-handle" prevent-default><i class="gui-icon line"></i></span></div>\n\n                        <button class="btn-delete" ng-click="deleteSubCategory($index, subCategory);"><i class="gui-i trash"></i></button>\n                    </li>\n                </ul>\n\n                <ul class="sub-category-list">\n                    <!-- <li ng-if="showOpt.isNewSubCate"> -->\n                    <li new-category="showOpt.isNewSubCate">\n\n                        <div class="item"><input type="text" placeholder="分类名称" ng-model="subCategoryTpl.name" ng-blur="addNewSubCate(subCategoryTpl);" ng-minlength="1"  auto-float-on-keyboard></div>\n                        <button class="btn-delete"><i class="gui-i trash"></i></button>\n                    </li>\n                </ul>\n\n                <a href="" class="add-sub-category" ng-click="showAddNewSubCate()"><i class="gui-i add-round"></i>添加子分类</a>\n            </div>\n            <!-- 普通子类别 end -->\n             <!-- 添加一级分类 start -->\n            <div class="category-main" new-category="showOpt.isNewCate">\n                <h3 class="main-title">\n                    <span class="icon" ng-click="showCateogryIconSelect(categoryTpl.iconName)"><i class="gui-category-icon" data-name="{{categoryTpl.name}}" style="color:{{categoryTpl.color}};" ng-bind-html="categoryTpl.icon|toTrusted"></i></span>\n                    <input type="text" ng-model="categoryTpl.name" placeholder="分类名称"  ng-change="addNewCate(categoryTpl);" ng-model-options="{updateOn: \'blur\'}" ng-focus="showOpt.isFocus=true" ng-blur="showOpt.isFocus=false">\n                </h3>\n            </div>\n            <!-- 添加一级分类 end -->\n        </div>\n        <!-- 主体 end -->\n    </div>\n    <!-- 页面整体 end -->\n'),
    a.put("views/category/category-icon-select-pop.html", '    <div class="atomu-mask" ng-click="closePop()"></div>\n    <!-- 分类图标 start -->\n    <div class="pg-new-category-icons" >\n        <ul class="list">\n            <li ng-class="{current:curIndex == $index}" ng-repeat="tr in categoryIcons track by $index" hm-swipe-left="slideLeft(curIndex, $event)" hm-swipe-right="slideRight(curIndex, $event)">\n                <span class="item" ng-class="{selected:curIconName === icon.iconName}" ng-click="selectCategoryIcon(icon)" ng-repeat="icon in tr track by $index"><i class="gui-category-icon" style="background-color:{{curIconName === icon.iconName ? icon.color : \'\'}}" ng-bind-html="icon.code|toTrusted" data-name="{{icon.name}}"></i></span>\n                <!-- 已选择的图标加上 selected -->\n                <!-- <span class="item selected">\n                    <i class="gui-category-icon" data-name="餐饮" style="background-color:#ff9f12;">&#xe601;</i>\n                </span> -->\n            </li>\n        </ul>\n\n        <ul class="ctrl">\n            <li ng-class="{current:curIndex == $index}" ng-repeat="tr in categoryIcons track by $index">{{$index}}</li>\n        </ul>\n    </div>\n    <!-- 分类图标 end -->'),
    a.put("views/category/category-select.html", '    <div class="page-wrapper show">\n        <!-- 头部 start -->\n        <header class="header">\n            <div class="left">\n                <a href="" ng-click="closeCategory();">取消</a>\n            </div>\n            <h3 class="title">类别</h3>\n            <div class="right">\n                <a href="" class="em" ng-click="showCategoryEdit()">设置</a>\n            </div>\n        </header>\n        <!-- 头部 end -->\n\n        <!-- 主体 start -->\n        <div class="body pg-new-category"><!-- 每个页面对应一个 pg-xxx，用于处理该页面的样式 -->\n            <!-- 侧边栏主类别 start -->\n            <div class="category-sidebar">\n                <div class="inner">\n                    <ul class="category-list">\n                        <li class="collection" ng-click="showMarkList()" ng-class="{current : showOpt.isMarkList}"><!-- 收藏链接单独加上 collection -->\n                            <div class="item">\n                                <span class="icon"><i class="gui-category-icon" data-name="收藏">&#x37;</i></span>收藏\n                            </div>\n                        </li>\n                    </ul>\n                    <ul class="category-list">\n                        <!-- 收藏链接单独加上 collection -->\n                        <!-- <li class="collection">\n                            <div class="item">\n                                <span class="icon"><i class="gui-category-icon" data-name="收藏" style="color:#f94b15;">&#x37;</i></span>收藏\n                            </div>\n                        </li> -->\n                        <li ng-repeat="category in categories track by $index" ng-class="{current : showOpt.isCategoryList && curCategoryId === category.id}" ng-click="selectCategory(category.id)">\n                            <div class="item">\n                                <span class="icon"><i class="gui-category-icon" data-name="{{category.name}}" style="color:{{curCategoryId === category.id ? \'#fff\' : \'#ccc\'}};" ng-bind-html="category.icon|toTrusted"></i></span>{{category.name}}\n                            </div>\n                        </li>\n                    </ul>\n                </div>\n            </div>\n            <!-- 侧边栏主类别 end -->\n            <!-- 收藏子类别 start -->\n            <div class="category-main" ng-if="showOpt.isMarkList">\n                <h3 class="main-title">\n                    <span class="icon"><i class="gui-category-icon" data-name="收藏" style="background-color:#f94b15;">&#x37;</i></span>收藏\n                </h3>\n                <ul class="sub-category-list" ng-sortable="subCateSortConf">\n\n                    <li ng-repeat="markItem in markList track by $index" data-id="{{markItem.id}}" class="collected">\n                        <div class="item"><span ng-click="selectSubCategory(markItem)" class="text">{{markItem.name}}</span>\n                        <span class="extra" ng-click="markCategory(markItem, 1)"  ><i class="gui-icon heart-outline"></i></span></div>\n                    </li>\n                    <li ng-if="markList.length == 0">\n                        <div class="item">暂无收藏</div>\n                    </li>\n                </ul>\n            </div>\n            <!-- 收藏子类别 end -->\n            <!-- 子类别 start -->\n            <div class="category-main" ng-if="showOpt.isCategoryList">\n                <h3 class="main-title">\n                    <span class="icon"><i class="gui-category-icon" data-name="{{curCategory.name}}" style="background-color:{{curCategory.color}};" ng-bind-html="curCategory.icon|toTrusted"></i></span>\n                    {{curCategory.name}}\n                </h3>\n                <ul class="sub-category-list">\n                    <li ng-repeat="subCategory in subCategories track by $index" ng-class="{selected : curSubCategoryId === subCategory.id, collected: isMark(subCategory.id)}">\n                        <div class="item"><span  ng-click="selectSubCategory(subCategory)" class="text">{{subCategory.name}}</span><span class="extra" ng-click="markCategory(subCategory)" ng-if="!isOther(subCategory.name)"><i class="gui-icon heart-outline"></i></span></div>\n                    </li>\n                </ul>\n            </div>\n            <!-- 子类别 end -->\n        </div>\n        <!-- 主体 end -->\n    </div>\n    <!-- 页面整体 end -->'),
    a.put("views/category/index.html", '    <div class="page-wrapper show">\n        <!-- 头部 start -->\n        <header class="header">\n            <div class="left">\n                <a href="" ng-click="closeCategory();">取消</a>\n            </div>\n            <h3 class="title">类别</h3>\n        </header>\n        <!-- 头部 end -->\n\n        <!-- 主体 start -->\n        <div class="body pg-category">\n            <div class="category-list open"><!-- 打开类别详情时加上 open -->\n                <div class="" ng-repeat="tr in categories track by $index">\n                <div class="row">\n                    <a href="" class="item" ng-class="{active : activedCate === category.id}" ng-repeat="category in tr track by $index" ng-click="selectCategory(category, $parent.$index)">\n                        <span class="icon"><i class="gui-category-icon" style="color:{{activedCate === category.id ? category.color : \'#ccc\'}}" ng-bind-html="category.icon|toTrusted"></i></span>\n                        <h3>{{category.name}}</h3>\n                    </a>\n                </div>\n                <!-- 子类别 start -->\n                <div class="category-detail" ng-show="$index==selectRow">\n                    <table>\n                        <tr ng-repeat="tr in subCategories">\n                            <td ng-class="{selected : activedSubCate === subCategory.id}" ng-repeat="subCategory in tr" ng-click="selectItem(subCategory)">\n                                <span class="cnt">{{subCategory.name}}</span>\n                            </td>\n                        </tr>\n                    </table>\n                </div>\n                </div>\n\n                <!-- 子类别 end -->\n\n                <!-- <div class="row">\n                    <a href="" class="item">\n                        <span class="icon"><i class="gui-i health"></i></span>\n                        <h3>健康</h3>\n                    </a>\n                    <a href="" class="item">\n                        <span class="icon"><i class="gui-i teach"></i></span>\n                        <h3>文教</h3>\n                    </a>\n                    <a href="" class="item">\n                        <span class="icon"><i class="gui-i travel"></i></span>\n                        <h3>旅行</h3>\n                    </a>\n                    <a href="" class="item">\n                        <span class="icon"><i class="gui-i traffic"></i></span>\n                        <h3>交通</h3>\n                    </a>\n                    <a href="" class="item">\n                        <span class="icon"><i class="gui-i fun"></i></span>\n                        <h3>娱乐</h3>\n                    </a>\n                </div>\n                <div class="row">\n                    <a href="" class="item">\n                        <span class="icon"><i class="gui-i other"></i></span>\n                        <h3>其他</h3>\n                    </a>\n                </div>\n             -->\n            </div>\n        </div>\n        <!-- 主体 end -->\n    </div>\n'),
    a.put("views/common/404.html", '    <!-- 页面整体(此结构用来对页面整体做模糊效果) start -->\n    <div class="page-wrapper">\n        <!-- 主体 start -->\n        <div class="body pg-404"><!-- 每个页面对应一个 pg-xxx，用于处理该页面的样式 -->\n            <div class="error-404">\n                <i class="icon"></i>\n                <p>页面跑丢了，等会再试试</p>\n            </div>\n        </div>\n        <!-- 主体 end -->\n    </div>\n    <!-- 页面整体 end -->'),
    a.put("views/common/loadingModal.html", '    <!-- 全局加载 start -->\n    <div class="atomu-mask"></div>\n    <div class="gui-loading-box global">\n        <div class="inner">\n            <i class="gui-i loading-l"></i>\n        </div>\n    </div>\n    <!-- 全局加载 end -->\n'),
    a.put("views/common/proxy.html", ""),
    a.put("views/common/tipsModal.html", '    <!-- 操作结果提示 start -->\n    <div class="gui-tip-center">\n        <div class="inner" ng-bind="msg"></div>\n    </div>\n    <!-- 操作结果提示 end -->'),
    a.put("views/common/voice.html", '    <!-- 语音记账 start -->\n    <div class="gui-voice"  ng-if="voiceView.isShow" ng-controller="VoiceController">\n        <a href="" ng-click="voiceView.isShow=false" class="voice-close">&times;</a>\n        <div class="voice-ctn">\n\n        </div>\n        <!-- 操作提示 start -->\n        <div class="voice-tip">\n            <h3>按住说话 松开记账</h3>\n            <p>例如：早饭十元</p>\n        </div>\n        <!-- 操作提示 end -->\n        <div class="voice-btns">\n            <div record-btn="{translateCallback:translateCallback}"></div>\n            <button class="gui-btn hand-btn" ng-click="showBillAdd()">手动记账</button>\n        </div>\n    </div>\n    <!-- 语音记账 end -->\n'),
    a.put("views/currency/calculator.html", '<div class="page-wrapper show">\n    <!-- 头部 start -->\n    <header class="header" ng-if="!hideHome">\n        <div class="left">\n            <a href="javascript:void(0);" ng-click="closeCalculator();" ><i class="gui-i home"></i></a>\n        </div>\n        <h3 class="title">汇率助手</h3>\n        <div class="right">\n            <a href="" class="em" ng-click="showCurrency();">汇率</a>\n        </div>\n    </header>\n    <!-- 头部 end -->\n\n    <!-- 主体 start -->\n    <div class="body pg-exchange-rate-compute" ng-class="{\'show-keyboard\': showNum, \'no-header\':hideHome}"><!-- 当键盘展开时加上 show-keyboard -->\n        <ul class="gui-exchange-list" ng-click="showKeyboard();">\n            <li class="active edit"><!-- 当前选中状态时加上 active，当前是编辑态时加上 edit -->\n                <div class="exchange-item">\n                    <h3>\n                        <i class="gui-flag {{currentRate.aka.toLowerCase()}}"></i>\n                        <span class="title">{{currentRate.name}}</span>\n                        <span class="en">{{currentRate.aka}}</span>\n                    </h3>\n                    <div class="num"><span>{{inputVal | number}}</span><i></i></div>\n                </div>\n                <button class="btn-delete"><i class="gui-i trash"></i></button>\n            </li>\n        </ul>\n        <div class="all-exchange">\n\n        <!-- 汇率列表 start -->\n        <ul class="gui-exchange-list"><!-- 未有选中态时加上 disabled -->\n            <!-- <li ng-repeat="rate in rates" ng-class="{active: rate.aka===currentRate.aka}" ng-click="setCurrentRate(rate)"> -->\n            <li ng-repeat="rate in rates" ng-if="rate.aka!==currentRate.aka" ng-click="setCurrentRate(rate)">\n                <div class="exchange-item">\n                    <h3>\n                        <i class="gui-flag {{rate.aka.toLowerCase()}}"></i>\n                        <span class="title">{{rate.name}}</span>\n                        <span class="en">{{rate.aka}}</span>\n                    </h3>\n                    <div class="num">{{inputVal | exchangeRate:rate.value:currentRate.value | number}}</div>\n                </div>\n            </li>\n\n        </ul>\n        <!-- 汇率列表 end -->\n\n        <!-- 更新时间 start -->\n        <time class="gui-time" ng-if="dataTime">\n            汇率更新时间：{{dataTime|date:\'yyyy-MM-dd HH:00:00\'}}<span class="mark">数据仅供参考</span>\n        </time>\n        <!-- 更新时间 end -->\n        </div>\n    </div>\n    <!-- 主体 end -->\n</div>\n\n<!-- 公用数字键盘 start -->\n<div class="gui-num-keyboard" ng-show="showNum">\n    <ul class="list">\n        <li ng-repeat="num in nums" hm-tap="inputNum(num, $event)"\n' + "        ng-class=\"{dot : num==='.', 'delete' : num==='', 'zero' : num ===0, 'clear' : num === '清空', 'sure': num==='确定'}\">\n        <i>{{num}}</i></li>\n    </ul>\n</div>\n<!-- 公用数字键盘 end -->\n"),
    a.put("views/currency/index.html", '<div class="page-wrapper show">\n    <!-- 头部 start -->\n    <header class="header" ng-if="!hideHome">\n        <div class="left">\n            <a href="" ng-click="closeCurrency();">返回</a>\n        </div>\n        <h3 class="title">汇率</h3>\n    </header>\n    <!-- 头部 end -->\n\n    <!-- 主体 start -->\n    <div class="body pg-exchange-rate" ng-class="{\'no-header\':hideHome}"><!-- 每个页面对应一个 pg-xxx，用于处理该页面的样式 -->\n        <!-- 更新时间 start -->\n        <time class="gui-time">\n            更新时间：{{dataTime|date:\'yyyy-MM-dd HH:00:00\'}}<span class="mark">数据仅供参考</span>\n        </time>\n        <!-- 更新时间 end -->\n\n        <!-- 汇率列表 start -->\n        <ul class="gui-exchange-list">\n            <li ng-repeat="rate in rates">\n                <div class="exchange-item">\n                    <h3>\n                        <i class="gui-flag {{rate.aka.toLowerCase()}}"></i>\n                        <div class="ctn">\n                            <span class="title">{{rate.name}}</span>\n                            <span class="en">{{rate.aka}}</span>\n                            <span class="mark" ng-if="rate.aka.toLowerCase() === \'cny\'">(基准货币)</span>\n                            <p class="mark" ng-if="rate.aka.toLowerCase() !== \'cny\'">1 {{rate.aka}} = {{1/rate.value | number:2}} CNY</p>\n                        </div>\n                    </h3>\n                    <div class="num">{{1/rate.value | number:2}}</div>\n                </div>\n            </li>\n        </ul>\n        <!-- 汇率列表 end -->\n    </div>\n    <!-- 主体 end -->\n\n    <!-- 兑换计算器入口 start -->\n    <!-- <div class="gui-exchange-compute-link" ng-click="showCalculator();">\n        <h3 class="name">货币兑换计算器</h3>\n        <div class="icon">\n            <i class="gui-i compute"></i>\n        </div>\n    </div> -->\n    <!-- 兑换计算器入口 start -->\n</div>\n<!-- 页面整体 end -->\n'),
    a.put("views/more/index.html", '<section class="gui-more-link">\n    <header>\n        <a href="javascript:void(0);" class="close" ng-click="closeMore();"><i></i></a>\n        <h3 class="title">工具</h3>\n    </header>\n    <div class="link-bd">\n        <ul class="list">\n            <li ng-click="showCurrency();">\n                <span class="icon"><i></i></span>\n                <span class="title">汇率助手</span>\n            </li>\n            <li ng-click="showShopping();">\n                <span class="icon notes"><i></i></span>\n                <span class="title">购物便签</span>\n            </li>\n            \n            <li ng-click="showCategoryEdit();">\n                <span class="icon category"><i></i></span>\n                <span class="title">分类管理</span>\n            </li> \n        </ul>\n    </div>\n</section>\n'),
    a.put("views/shopping/index.html", '\n<div class="page-wrapper show">\n\n    <!-- 头部 start -->\n    <header class="header">\n        <div class="left">\n            <a href="javascript:void(0);" ng-click="closeShopping();"><i class="gui-i home"></i></a>\n        </div>\n        <h3 class="title">购物便签</h3>\n        <!-- <input autofocus id="newTodo1" type="text" placeholder="输入待处理事项"> -->\n\n    </header>\n    <!-- 头部 end -->\n\n    <!-- 主体 start -->\n    <div class="body pg-shopping-notes"><!-- 每个页面对应一个 pg-xxx，用于处理该页面的样式 -->\n        <!-- tab start -->\n        <div class="gui-tab ctrl-center">\n            <div class="hd">\n                <ul class="tab-ctrl cf">\n                    <li ng-class={current:currentTab===\'todos\'} ng-click="setCurrentTab(\'todos\')">\n                        <a href="javascript:void(0);">待处理 ({{todoItems.length > 99 ? \'99+\' : todoItems.length}})</a>\n                    </li>\n                    <li ng-class={current:currentTab===\'done\'} ng-click="setCurrentTab(\'done\')">\n                        <a href="javascript:void(0);">已完成 ({{doneItems.length > 99 ? \'99+\' : doneItems.length}})</a>\n                    </li>\n                </ul>\n            </div>\n            <div class="bd" ng-if="currentTab===\'todos\'">\n                <!-- 待购买清单 start -->\n                <ul class="shopping-list">\n                    <li ng-class="{active:editIntex===$index, delete: todoItem.deleted}" ng-repeat="todoItem in todoItems"\n                    hm-swipe-left="slideLeft(todoItem, $event)" hm-swipe-right="slideRight(todoItem, $event)"><!-- 处于编辑态时加上 active -->\n                        <div class="shopping-item">\n                            <label>\n                                <input type="checkbox" ng-click="checkItem(todoItem, $event);">\n                            </label>\n                            <!-- <span class="text">{{todoItem.name}}</span> -->\n                            <input type="text" placeholder="请输入待购买物品，如牙膏" ng-model="todoItem.name"\n                             ng-change="updateTodo(todoItem);" ng-model-options="{updateOn: \'blur\'}">\n\n                        </div>\n                        <button class="btn-delete" ng-click="deleteTodo(todoItem);"><i class="gui-i trash"></i></button>\n                    </li>\n\n                    <!-- <li ng-show="showOpt.ifNewTodo"> -->\n                    <li new-todo="showOpt.ifNewTodo">\n                        <div class="shopping-item">\n                        <label>\n                            <input type="checkbox" disabled>\n                        </label>\n                        <input type="text" placeholder="请输入待购买物品，如牙膏" ng-model="newTodo.name"\n                        ng-blur="addTodo(newTodo);">\n                        <!-- <input custom-focus="showOpt.ifNewTodo" type="text" placeholder="输入待处理事项" autocomplete=false> -->\n                        </div>\n                    </li>\n                </ul>\n\n                <a href="" class="add-shopping-item" ng-click="showAddTodo();">\n                    <i class="gui-icon add-round"></i>新增\n                </a>\n                <!-- 待购买清单 end -->\n\n            </div>\n\n            <div class="bd" ng-if="currentTab===\'done\'">\n                <!-- 已完成 start -->\n                <ul class="finish-list">\n                    <li ng-repeat="doneItem in doneItems">\n                        <h3 class="title">{{doneItem.name}}</h3>\n                        <!-- <div class="info">\n                            <div class="inner">\n                                <time>{{doneItem.time.slice(5)}}</time>\n                                <p>已购买</p>\n                            </div>\n                        </div> -->\n                    </li>\n                </ul>\n                <!-- 已完成 end -->\n            </div>\n        </div>\n        <!-- tab end -->\n    </div>\n    <!-- 主体 end -->\n</div>\n'),
    a.put("views/voice/record-btn.html", '            <button class="voice-btn" ><!-- 按住按钮时加上 active -->\n                <span class="ctn">\n                    <i class="dot"></i>按住说话\n                </span>\n                <span class="shadow"><i></i></span>\n            </button>'),
    a.put("views/voice/record-fast.html", '    <!-- 主体 start -->\n    <div class="body pg-record-fast"  ><!-- 页面需模糊时加上 blur -->\n        <!-- 语音记账 start -->\n        <div class="gui-voice">\n            <div class="voice-ctn">\n\n            </div>\n\n            <!-- 操作提示 start -->\n            <div class="voice-tip">\n                <h3 ng-bind="voiceTips">按住说话 松开记账</h3>\n                <p>例如：连衣裙500元</p>\n            </div>\n\n            <!-- 操作提示 end -->\n            <div class="voice-btns">\n                <div record-btn="{translateCallback:translateCallback}"></div>\n                <button class="gui-btn hand-btn" ng-click="showBillAdd();">手动记账</button>\n            </div>\n        </div>\n        <!-- 语音记账 end -->\n    </div>\n    <!-- 主体 end -->\n'),
    a.put("views/voice/record-pop.html", '    <!-- 语音记账 start -->\n    <div class="gui-voice">\n        <a href="" ng-click="closeVoice();" class="voice-close">&times;</a>\n        <div class="voice-ctn">\n\n        </div>\n\n        <!-- 操作提示 start -->\n        <div fade-in-tips ></div>\n        <!-- <div class="voice-tip" fade-in-tips voiceTips="voiceTips">\n            <h3 ng-bind="voiceTips">按住说话 松开记账</h3>\n            <p>例如：连衣裙500元</p>\n        </div> -->\n\n        <!-- 操作提示 end -->\n        <div class="voice-btns">\n            <div record-btn="{translateCallback:translateCallback}"></div>\n            <button class="gui-btn hand-btn" ng-click="showBillAdd();">手动记账</button>\n        </div>\n        \n    </div>\n    <!-- 语音记账 end -->\n')
}
]),
angular.module("wealth-app.filter", []).filter("toTrusted", ["$sce", function(a) {
    return function(b) {
        return a.trustAsHtml(b)
    }
}
]).filter("showName", function() {
    return function(a, b) {
        return "其它" === a ? b : a
    }
}
).filter("isOther", function() {
    return function(a) {
        return "其它" === a
    }
}
).filter("exchangeRate", function() {
    return function(a, b, c) {
        var d = a * b / c;
        return 0 !== d && (d = Math.round(100 * d) / 100),
        d
    }
}
),
angular.module("wealth-app.common-services", ["angularModalService"]).factory("wxApi", ["$http", "CONFIGURATION", function(a, b) {
    var c = window.wx
      , d = {
        exVersion: "1.0.0",
        signInfoUrl: "http://d.gri.qq.com/wealth/jsapi/",
        initConfig: function(d) {
            d = d || b.JSAPI_URL || this.signInfoUrl,
            a.jsonp(d + "?callback=JSON_CALLBACK", {
                params: {
                    signUrl: location.protocol + "//" + location.host + location.pathname
                }
            }).success(function(a) {
                c.config({
                    debug: !1,
                    appId: a.appId,
                    nonceStr: a.nonceStr,
                    timestamp: a.timestamp,
                    signature: a.signature,
                    jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "translateVoice", "startRecord", "stopRecord", "onRecordEnd", "playVoice", "pauseVoice", "stopVoice", "uploadVoice", "downloadVoice", "chooseImage", "previewImage", "uploadImage", "downloadImage", "getNetworkType", "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "closeWindow"]
                }),
                c.error(function(a) {
                    alert(a.errMsg)
                }
                )
            }
            )
        }
    };
    return angular.extend(c, d),
    c
}
]).service("modalService", ["ModalService", function(a) {
    this.showLoading = function() {
        return a.showModal({
            templateUrl: "views/common/loadingModal.html",
            controller: "LoadingModalController"
        })
    }
    ,
    this.showTips = function(b) {
        return a.showModal({
            templateUrl: "views/common/tipsModal.html",
            controller: "TipsModalController",
            inputs: {
                msg: b
            }
        })
    }
    ,
    this.showVoiceInput = function(b, c) {
        a.showModal({
            templateUrl: "views/voice/record-pop.html",
            controller: "RecordPopController",
            inputs: {
                successRecordCallback: b,
                failRecordCallback: c
            }
        }).then(function(a) {}
        )
    }
    ,
    this.showBillAdd = function(b) {
        var c = this;
        a.showModal({
            templateUrl: "views/bill-operate/edit.html",
            controller: "BillEditController",
            inputs: {
                bill: {}
            },
            backButton: !0
        }).then(function(a) {
            a.close.then(function(a) {
                a && c.showTips("保存成功")
            }
            ),
            ANI.slideInBottom(a.element[2]),
            a.close.then(function(a) {
                "function" == typeof b && b(a)
            }
            )
        }
        )
    }
    ,
    this.showBillEdit = function(b, c) {
        var d = this;
        a.showModal({
            templateUrl: "views/bill-operate/edit.html",
            controller: "BillEditController",
            inputs: {
                bill: b
            },
            backButton: !0
        }).then(function(a) {
            a.close.then(function(a) {
                !a || "update" !== a.operate && "add" !== a.operate || d.showTips("保存成功"),
                a && "delete" === a.operate && d.showTips("删除成功")
            }
            ),
            ANI.slideInBottom(a.element[2]),
            a.close.then(function(a) {
                "function" == typeof c && c(a)
            }
            )
        }
        )
    }
    ,
    this.showCategorySelect = function(b, c) {
        a.showModal({
            templateUrl: "views/category/category-select.html",
            controller: "CategorySelectController",
            inputs: {
                category: b
            },
            backButton: !0
        }).then(function(a) {
            ANI.slideInBottom(a.element[0]),
            a.close.then(function(a) {
                "function" == typeof c && c(a)
            }
            )
        }
        )
    }
    ,
    this.showSubList = function(b, c) {
        a.showModal({
            templateUrl: "views/bill/sub-list.html",
            controller: "SubListController",
            inputs: {
                categoryId: b.categoryId,
                time: b.time
            },
            backButton: !0
        }).then(function(a) {
            ANI.slideInBottom(a.element[0]),
            a.close.then(function(a) {
                "function" == typeof c && c(a)
            }
            )
        }
        )
    }
    ,
    this.showMoreServices = function(b) {
        a.showModal({
            templateUrl: "views/more/index.html",
            controller: "MoreController"
        }).then(function(a) {
            ANI.slideInBottom(a.element[0]),
            a.close.then(function(a) {
                "function" == typeof b && b(a)
            }
            )
        }
        )
    }
    ,
    this.showCategoryIconSelect = function(b, c) {
        a.showModal({
            templateUrl: "views/category/category-icon-select-pop.html",
            controller: "CategoryIconSelectController",
            inputs: {
                inputIcon: b
            }
        }).then(function(a) {
            ANI.slideInBottom(a.element[0]),
            a.close.then(function(a) {
                "function" == typeof c && c(a)
            }
            )
        }
        )
    }
    ,
    this.showCategoryEdit = function(b, c, d) {
        return a.showModal({
            templateUrl: "views/category/category-edit.html",
            controller: "CategoryEditController",
            inputs: {
                cateEditType: b
            },
            backButton: "boolean" == typeof d ? d : !0
        }).then(function(a) {
            d !== !1 && ANI.slideInBottom(a.element[0]),
            a.close.then(function(a) {
                "function" == typeof c && c(a)
            }
            )
        }
        )
    }
    ,
    this.showCurrency = function(b, c, d) {
        a.showModal({
            templateUrl: "views/currency/index.html",
            controller: "CurrencyController",
            inputs: {
                currencType: c
            },
            backButton: "boolean" == typeof d ? d : !0
        }).then(function(a) {
            $("html").addClass("mask-on"),
            d !== !1 && ANI.slideInBottom(a.element[0], function() {
                $("html").removeClass("mask-on")
            }
            ),
            a.close.then(function(a) {
                "function" == typeof b && b(a)
            }
            )
        }
        )
    }
    ,
    this.showCalculator = function(b) {
        a.showModal({
            templateUrl: "views/currency/calculator.html",
            controller: "CalculatorController",
            backButton: !0
        }).then(function(a) {
            ANI.slideInBottom(a.element[0]),
            a.close.then(function(a) {
                "function" == typeof b && b(a)
            }
            )
        }
        )
    }
    ,
    this.showShopping = function(b) {
        a.showModal({
            templateUrl: "views/shopping/index.html",
            controller: "ShoppingController",
            backButton: !0
        }).then(function(a) {
            ANI.slideInBottom(a.element[0]),
            a.close.then(function(a) {
                "function" == typeof b && b(a)
            }
            )
        }
        )
    }
}
]).factory("api", ["$http", "CONFIGURATION", function(a, b) {
    for (var c = {}, d = ["post", "get", "jsonp"], e = d.length - 1; e >= 0; e--)
        c[d[e]] = function(c) {
            return function(d, e) {
                var f, g = b.HOST + d;
                switch (e = e || [],
                c) {
                case "post":
                    f = a.post(g, e);
                    break;
                case "get":
                    f = a.get(g, {
                        params: e
                    });
                    break;
                default:
                    f = a.jsonp(g + "?callback=JSON_CALLBACK", {
                        params: e
                    })
                }
                return f
            }
        }
        (d[e]);
    return c
}
]).factory("IndexScroll", function() {
    return window.IndexScroll
}
).factory("random", function() {
    function a(a) {
        for (var b = "", c = 0; a > c; c++)
            b += Math.floor(10 * Math.random());
        return b
    }
    return a
}
).factory("anchorScroll", function() {
    function a(a, c, d) {
        var e = $(window).height();
        a = $(a),
        d = d > 0 ? d : e / 10,
        $("html, body").animate({
            scrollTop: c ? a.offset().top - d : a.offset().top + a.height() + d - e
        }, {
            duration: 200,
            easing: "linear",
            complete: function() {
                b(a) || console.log("not inView")
            }
        })
    }
    function b(a) {
        function b(a) {
            return a > g && h > a
        }
        a = $(a);
        var c = $(window)
          , d = c.height()
          , e = a.offset().top
          , f = a.height()
          , g = c.scrollTop()
          , h = g + d;
        return b(e + (f > d ? d : f) / 2) ? !0 : f > d ? b(e + f - d / 2) : !1
    }
    return {
        toView: a,
        inView: b
    }
}
),
angular.module("wealth-app.directives", ["wealth-app.common-services"]).directive("atomuDatePicker", function() {
    return {
        restrict: "E",
        replace: !0,
        template: '<div id="datepicker_container"></div>',
        link: function(scope, element, attrs) {
            var config = $.parseJSON(attrs.config)
              , atomuDatePicker = new window.atomuDatePicker({
                mod: config.mod || "fastclick",
                containerId: "datepicker_container",
                triggerId: config.triggerId || "datepicker_rigger",
                clickSubmit: !0,
                autoSubmit: !1,
                require: "wealth-app.demo.services",
                callback: function(dateObj) {
                    eval("(" + config.callback + ")(dateObj)")
                }
            })
        }
    }
}
).directive("recordBtn", ["wxApi", "$timeout", function(a, b) {
    return {
        restrict: "EA",
        replace: !0,
        templateUrl: "views/voice/record-btn.html",
        link: function(b, c, d) {
            var e = b.$eval(d.recordBtn) || {}
              , f = e.touchstartCallback
              , g = e.touchendCallback
              , h = e.translateCallback
              , i = 0
              , j = 0
              , k = !0;
            a.initConfig(),
            a.ready(function() {
                var b = {
                    localId: "",
                    serverId: "",
                    isRecording: !1
                }
                  , d = function() {
                    b = {
                        localId: "",
                        serverId: "",
                        isRecording: !1
                    }
                }
                  , e = function() {
                    return "" == b.localId ? void alert("请先使用 startRecord 接口录制一段声音") : void a.translateVoice({
                        localId: b.localId,
                        complete: function(a) {
                            a.hasOwnProperty("translateResult") ? h && h(a.translateResult) : alert("无法识别"),
                            d()
                        }
                    })
                }
                  , l = function() {
                    return b.isRecording ? !1 : (b.isRecording = !0,
                    void a.startRecord({
                        cancel: function() {
                            alert("用户拒绝授权录音"),
                            d()
                        }
                    }))
                }
                  , m = function(c) {
                    a.stopRecord({
                        success: function(a) {
                            return k ? (d(),
                            !1) : (b.localId = a.localId,
                            void (c && c()))
                        },
                        fail: function(a) {
                            d()
                        }
                    })
                }
                ;
                a.onVoiceRecordEnd({
                    complete: function(a) {
                        b.localId = a.localId,
                        e()
                    }
                }),
                c.off("touchstart").on("touchstart", function(a) {
                    i = (new Date).getTime(),
                    a.preventDefault(),
                    f && f(),
                    l()
                }
                ),
                c.off("touchend").on("touchend", function(a) {
                    j = (new Date).getTime(),
                    j - i > 500 && (k = !1),
                    a.preventDefault(),
                    g && g(),
                    m(e)
                }
                )
            }
            )
        }
    }
}
]).directive("fadeInTips", ["$sce", function(a) {
    return {
        replace: !0,
        scope: !1,
        template: '<div><div class="voice-tip animated" ng-bind-html="oldVal"></div><div class="voice-tip animated" ng-bind-html="newVal"></div></div>',
        link: function(b, c, d) {
            function e() {
                g.css({
                    display: "block"
                }).addClass(i[0]),
                h.addClass(i[1])
            }
            var f = c.children()
              , g = f.eq(0)
              , h = f.eq(1)
              , i = ["fadeOutUp", "fadeInUp"];
            g.on("animationend webkitAnimationEnd", function() {
                g.css({
                    display: "none"
                }).removeClass(i[0])
            }
            ),
            h.on("animationend webkitAnimationEnd", function() {
                h.removeClass(i[1])
            }
            ),
            b.$watchCollection("voiceTips", function(c, d) {
                return c == d ? (b.oldVal = a.trustAsHtml(d),
                !1) : (b.newVal = a.trustAsHtml(c),
                b.oldVal = a.trustAsHtml(d),
                void e())
            }
            )
        }
    }
}
]).directive("customFocus", ["$timeout", "$parse", "$window", function(a, b, c) {
    return {
        restrict: "A",
        link: function(c, d, e) {
            var f = b(e.customFocus);
            c.$watch(f, function(a) {
                a === !0 && g()
            }
            );
            var g = function() {
                a(function() {
                    d[0].focus()
                }
                , 0, !1)
            }
        }
    }
}
]).directive("newTodo", ["$timeout", "$parse", "$window", function(a, b, c) {
    return {
        restrict: "A",
        link: function(a, c, d) {
            var e = b(d.newTodo)
              , f = c.find("input")[1];
            a.$watch(e, function(a) {
                a === !0 ? (c.css("display", "block"),
                f.focus()) : c.css("display", "none")
            }
            ),
            "function" == typeof f.bind && f.bind("blur", function() {
                a.$apply(e.assign(a, !1))
            }
            )
        }
    }
}
]).directive("newCategory", ["$timeout", "$parse", "$window", function(a, b, c) {
    return {
        restrict: "A",
        link: function(a, c, d) {
            var e = b(d.newCategory)
              , f = c.find("input")[0];
            a.$watch(e, function(a) {
                a === !0 ? (c.css("display", "block"),
                f.focus()) : c.css("display", "none")
            }
            ),
            "function" == typeof f.bind && f.bind("blur", function() {
                a.$apply(e.assign(a, !1))
            }
            )
        }
    }
}
]).directive("animateCurrency", ["$timeout", "$parse", "$window", function(a, b, c) {
    return {
        restrict: "AC",
        link: function(b, c, d) {
            a(function() {
                function a() {
                    var a = b(f[0]).top - b(g[0]).top - k.scrollTop()
                      , c = a / 150 * m;
                    .3 > c ? c = .3 : c > m && (c = m),
                    i.css({
                        top: a + "px",
                        "-webkit-transition-duration": c + "s"
                    }).html(f.html()).show(),
                    f.addClass("empty"),
                    setTimeout(function() {
                        l = !0,
                        console.log(i),
                        i.css({
                            "-webkit-transform": "translateY(-" + a + "px)"
                        }).addClass("active")
                    }
                    )
                }
                function b(a) {
                    for (var b = a.offsetTop, c = a.offsetLeft; a = a.offsetParent; )
                        b += a.offsetTop,
                        c += a.offsetLeft;
                    return {
                        left: c,
                        top: b
                    }
                }
                function c() {
                    var a = f.html();
                    f.html(h.html()).removeClass("empty"),
                    h.html(a),
                    l = !1
                }
                function d(a) {
                    var b = e(a)
                      , c = document.documentElement.style;
                    return b in c ? !0 : !1
                }
                function e(a) {
                    return a.replace(/-(\w)/g, function(a, b) {
                        return b.toUpperCase()
                    }
                    )
                }
                var f, g = $(".pg-exchange-rate-compute"), h = $(".gui-exchange-list li.active"), i = $('<ul class="gui-exchange-list"><li></li></ul>').appendTo(g).find("li"), j = $(".all-exchange .gui-exchange-list li"), k = $(".all-exchange"), l = !1, m = .6;
                i.css({
                    position: "absolute",
                    left: 0,
                    "z-index": 10,
                    width: "100%",
                    "-webkit-transition": "all " + m + "s ease-in-out"
                }).hide(),
                j.on("click", function() {
                    f = $(this),
                    d("-webkit-transition") ? a(this) : c()
                }
                ),
                i.on("webkitTransitionEnd transitionEnd", function() {
                    i.hide().css({
                        "-webkit-transform": ""
                    }),
                    l && c()
                }
                )
            }
            , 200)
        }
    }
}
]).directive("preventDefault", function() {
    return {
        restrict: "AC",
        link: function(a, b, c) {
            b.bind("touchstart", function(a) {
                console.log(a),
                a.preventDefault()
            }
            )
        }
    }
}
).directive("autoFloatOnKeyboard", ["$timeout", "$parse", "$window", "anchorScroll", function(a, b, c, d) {
    return {
        restrict: "AC",
        link: function(b, c, d) {
            c.unbind("focus").bind("focus", function() {
                var b = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                b || a(function() {
                    c[0].scrollIntoView()
                }
                , 300)
            }
            )
        }
    }
}
]).directive("elastic", ["$timeout", function(a) {
    return {
        restrict: "A",
        link: function(b, c) {
            b.initialHeight = b.initialHeight || c[0].style.height;
            var d = function() {
                c[0].style.height = b.initialHeight,
                c[0].style.height = "" + c[0].scrollHeight + "px"
            }
            ;
            c.on("input change", d),
            a(d, 0)
        }
    }
}
]),
function() {
    var a = {
        swipeLeft: "swipeLeft",
        swipeRight: "swipeRight"
    };
    angular.forEach(a, function(a, b) {
        angular.module("wealth-app.directives").directive(b, ["$parse", function(a) {
            return function(c, d, e) {
                var f;
                e.$observe(b, function(e) {
                    var g = a(e);
                    f = function(a) {
                        var b = function() {
                            var b = g(c, {
                                $event: a
                            });
                            "function" == typeof b && b.call(c, a)
                        }
                        ;
                        "$apply" === c.$root.$$phase || "$digest" === c.$root.$$phase ? b() : c.$apply(b)
                    }
                    ,
                    util.toucher(d[0]).on(b, f)
                }
                )
            }
        }
        ])
    }
    )
}
(),
angular.module("wealth-app.interceptor", []).factory("userInterceptor", ["$q", "$location", "CONFIGURATION", function(a, b, c) {
    var d = function(a) {
        return null  == document.cookie.match(new RegExp("(^" + a + "| " + a + ")=([^;]*)")) ? "" : decodeURIComponent(RegExp.$2)
    }
      , e = function() {
        return d("_txduo_cli_uid")
    }
    ;
    return {
        request: function(a) {
            var b = c.DEV;
            return b || (a.headers["Auth-Token"] = e()),
            a
        },
        response: function(c) {
            return !c.data || 400 != c.data.code && 401 != c.data.code ? c : (b.path("404"),
            a.reject(c.data))
        }
    }
}
]),
angular.module("wealth-app.common-controllers", []).controller("LoadingModalController", ["$scope", "close", function(a, b) {
    a.close = b
}
]).controller("TipsModalController", ["$scope", "close", "$timeout", "msg", function(a, b, c, d) {
    a.close = b,
    a.msg = d,
    b(!0, 2e3)
}
]).controller("ProxyController", ["$location", "$rootScope", "$scope", "modalService", "$stateParams", function(a, b, c, d, e) {
    var f = function(a) {
        var b = e.page;
        switch (b) {
        case "calculator":
            d.showCurrency("", "app", !1);
            break;
        case "category":
            d.showCategoryEdit("", "", !1);
            break;
        default:
            alert("proxy地址不存在")
        }
    }
    ;
    !function() {
        f()
    }
    ()
}
]),
angular.module("wealth-app-dep").animation(".ani-slidePage", ["$rootScope", function(a) {
    return {
        enter: function(b, c) {
            return ANI.aniTime = 250,
            void 0 === a.direction ? (ANI.aniTime = 2500,
            console.log(b[0]),
            void ANI.slideInRight(b[0], c)) : void ("back" === a.direction ? ANI.slideInLeft(b[0], c) : ANI.slideInRight(b[0], c))
        },
        leave: function(b, c) {
            ANI.aniTime = 250,
            "back" === a.direction ? ANI.slideOutRight(b[0], c) : ANI.slideOutLeft(b[0], c)
        }
    }
}
]).animation(".ani-dialogPage", function() {
    return {
        addClass: function(a, b, c) {
            console.log("here animate show"),
            "ng-hide" === b && (ANI.slideOutBottom(a[0], c),
            c())
        },
        beforeRemoveClass: function(a, b, c) {
            "ng-hide" === b && ANI.slideInBottom(a[0], c)
        }
    }
}
),
angular.module("wealth-app.bill.controllers", ["highcharts-ng"]).controller("IndexController", ["$location", "$rootScope", "$scope", "modalService", "BillService", "IndexScroll", "$q", "$timeout", function(a, b, c, d, e, f, g, h) {
    c.index = {
        showRecord: !0,
        showCategory: !1
    },
    c.listBillItems = [],
    c.listBillInfo = {
        isLoading: !1,
        curPage: 0,
        pagecount: 0,
        isLastPage: !1
    },
    c.statCategoryItems = [],
    c.summaryBillInfo = {
        income: 0,
        payout: 0,
        sum: 0
    },
    c.selectedYearMonth = "",
    c.showVoiceInput = function() {
        var a = function(a) {
            a && $(document).trigger("refreshBill")
        }
        ;
        b.global.info.isBlur = !0,
        d.showVoiceInput(a)
    }
    ,
    c.showBillEdit = function(a) {
        var b = {
            billId: a.billId,
            time: a.time
        };
        d.showBillEdit(b, function(a) {
            a && $(document).trigger("refreshBill")
        }
        )
    }
    ,
    c.showBillAdd = function() {
        d.showBillAdd(function(a) {
            a && $(document).trigger("refreshBill")
        }
        )
    }
    ,
    c.showRecord = function() {
        c.index = {
            showRecord: !0,
            showCategory: !1
        }
    }
    ,
    c.showCategory = function() {
        c.index = {
            showRecord: !1,
            showCategory: !0
        }
    }
    ,
    c.isHideSummaryList = function() {
        return 0 == c.summaryBillInfo.income && 0 == c.summaryBillInfo.payout
    }
    ,
    c.showSubList = function(a) {
        var b = {
            categoryId: a.id,
            time: c.selectedYearMonth
        };
        d.showSubList(b, function(a) {
            a && $(document).trigger("refreshBill")
        }
        )
    }
    ,
    c.showMore = function() {
        d.showMoreServices()
    }
    ;
    var i, j = "", k = function(a) {
        var b = 20
          , a = a || c.selectedYearMonth;
        return c.listBillInfo.isLastPage ? g.reject() : c.listBillInfo.isLoading ? g.reject() : (c.listBillInfo.isLoading = !0,
        e.getListBill(a, c.listBillInfo.curPage++, b,function(a) {
            if (0 === a.code) {
                var b = a.data.data;
                if (b.length > 0)
                    for (var d = 0, e = b.length; e > d; d++)
                        b[d].time = b[d].date.slice(0, 10),
                        b[d].date = new Date(b[d].date.substr(0, 10).replace("/-/g", "/")).getTime(),
                        b[d].isShowDate = j != b[d].date,
                        b[d].isShowDate && (j = b[d].date),
                        c.listBillItems.push(b[d]);
                else
                    c.listBillInfo.isLastPage = !0
            }
            return c.listBillInfo.isLoading = !1,
            a
        }
        ))
    }
    , l = function(a) {
        return e.getStatCategoryInfo(a,function(a) {
            return 0 === a.code && (c.statCategoryItems = a.data.categorys),
            a
        }
        )
    }
    , m = function(a) {
        return e.getSummaryBillInfo(a,function(a) {
            return 0 === a.code && (c.summaryBillInfo = a.data),
            a
        }
        )
    }
    , n = function(a) {
        e.getUserInfo(function(a) {
            0 === a.code && (c.userInfo = a.data)
        }
        )
    }
    , o = function() {
        c.listBillItems = [],
        c.listBillInfo = {
            isLoading: !1,
            curPage: 0,
            pagecount: 0,
            isLastPage: !1
        },
        j = ""
    }
    , p = function() {
        var a = c.selectedYearMonth;
        o();
        var b = d.showLoading();
        g.all([m(a), l(a)])["finally"](function(a) {
            b.then(function(a) {
                a.scope.close()
            }
            )
        }
        ),
        k(a)
    }
    , q = function(b) {
        var c = a.search().page;
        if (c)
            switch (a.url(a.path()),
            c) {
            case "calculator":
                d.showCalculator(b);
                break;
            case "shopping":
                d.showShopping(b);
                break;
            case "category":
                d.showCategoryEdit("", r, !1)
            }
    }
    , r = function() {
        $(document).unbind("refreshBill").bind("refreshBill", p),
        new atomuMonthPicker({
            mod: "default",
            containerId: "datepicker_container",
            triggerId: "datepicker_trigger",
            clickSubmit: !0,
            autoSubmit: !0,
            callback: function(a) {
                c.selectedYearMonth = a,
                $(document).trigger("refreshBill")
            }
        }),
        n()
    }
    ;
    c.$watch(c.isHideSummaryList, function(a) {
        a || i || h(function() {
            i = new f({
                scrollEndCallback: function() {
                    k()
                }
            })
        }
        , 10)
    }
    ),
    function() {
        a.search().page ? q() : r()
    }
    ()
}
]).controller("SubListController", ["$scope", "close", "$element", "categoryId", "time", "BillService", "modalService", function(a, b, c, d, e, f, g) {
    a.subList = [];
    var h = function() {
        f.getSubListBill(e, d).then(function(b) {
            if (0 === b.code) {
                b.data.data;
                a.subList = b.data.data;
                for (var c in a.subList)
                    a.subList[c].name = b.data.name,
                    a.subList[c].color = b.data.icon[0].color,
                    a.subList[c].icon = b.data.icon[0].code
            }
        }
        )
    }
    ;
    h(),
    a.showBillEdit = function(a) {
        var b = {
            billId: a.billId,
            time: a.date
        };
        g.showBillEdit(b, function(a) {
            a && (h(),
            $(document).trigger("refreshBill"))
        }
        )
    }
    ,
    a.closeSelf = function() {
        ANI.slideOutBottom(c[0]),
        b(null , 250)
    }
}
]).controller("AnalysisController", ["$rootScope", "$scope", "modalService", "AnalysisService", "$q", "$sce", "$timeout", function(a, b, c, d, e, f, g) {
    b.month = "",
    b.summary = 0,
    b.lineChart = {},
    b.pieChart = {},
    b.column = {},
    b.showVoiceInput = function() {
        c.showVoiceInput(h)
    }
    ,
    b.showBillAdd = function() {
        close(),
        c.showBillAdd(h)
    }
    ;
    var h = function(a) {
        a && $(document).trigger("refreshStatBill")
    }
      , i = function(a, c) {
        b.lineChart = {
            options: {
                chart: {
                    type: "spline",
                    renderTo: "line_container"
                },
                xAxis: {
                    type: "linear",
                    categories: a,
                    tickInterval: 7,
                    tickLength: 0,
                    lineColor: "#dddee0"
                },
                yAxis: {
                    tickAmount: 5,
                    min: 0,
                    labels: {
                        format: "{value:.1f}"
                    },
                    title: {
                        text: ""
                    },
                    gridLineColor: "#dddee0"
                },
                plotOptions: {
                    series: {
                        lineWidth: 1
                    }
                },
                legend: {
                    enabled: !1
                },
                credits: {
                    enabled: !1
                },
                tooltip: {
                    backgroundColor: "#f94b15",
                    style: {
                        color: "#ffffff"
                    },
                    useHTML: !0
                }
            },
            series: [{
                name: "支出",
                data: c,
                tooltip: {
                    headerFormat: "{point.key}",
                    pointFormat: '<b style="margin-left:10px;">{point.y:.1f}</b><br/>'
                },
                marker: {
                    enabled: !1
                },
                color: "#f94b15"
            }],
            title: {
                text: "支出走势",
                y: 15,
                style: {
                    fontSize: "12px"
                }
            }
        }
    }
      , j = function(a) {
        b.pieChart = {
            options: {
                chart: {
                    plotBackgroundColor: null ,
                    plotBorderWidth: null ,
                    plotShadow: !1,
                    renderTo: "pie_container"
                },
                tooltip: {
                    pointFormat: "支出金额: <b>{point.y:.1f}</b><br/>{series.name}: <b>{point.percentage:.1f}%</b>"
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: !0,
                        cursor: "pointer",
                        dataLabels: {
                            enabled: !1,
                            color: "#000000",
                            connectorColor: "#000000",
                            format: "<b>{point.name}</b>: {point.percentage:.1f} %"
                        }
                    }
                },
                credits: {
                    enabled: !1
                }
            },
            series: [{
                type: "pie",
                name: "支出占比",
                data: a
            }],
            title: {
                text: "支出分类占比",
                y: 20,
                style: {
                    fontSize: "12px"
                }
            }
        }
    }
      , k = function() {
        b.summary = 0,
        b.lineChart = {},
        b.pieChart = {},
        b.column = {}
    }
      , l = function() {
        var f = b.month
          , h = c.showLoading();
        k(),
        e.all([d.getStatPieInfo(f), d.getStatLineInfo(f)]).then(function(c) {
            var d = c[0]
              , e = c[1];
            if (0 === d.code) {
                var f = d.data;
                b.summary = f.sum;
                var h = b.column = f.categorys;
                for (var k in h)
                    h[k].color = h[k].icon[a.global.style].color;
                g(function() {
                    j(h)
                }
                , 100)
            }
            0 === e.code && g(function() {
                i(e.data.lineCategories, e.data.lineSeries)
            }
            , 100)
        }
        )["finally"](function() {
            h.then(function(a) {
                a.scope.close()
            }
            )
        }
        )
    }
    ;
    $(document).unbind("refreshStatBill").bind("refreshStatBill", l),
    new atomuMonthPicker({
        mod: "default",
        containerId: "datepicker_container",
        triggerId: "datepicker_trigger",
        clickSubmit: !0,
        autoSubmit: !0,
        callback: function(a) {
            b.month = a,
            $(document).trigger("refreshStatBill")
        }
    }),
    b.areaChart = {
        options: {
            chart: {
                type: "area"
            },
            xAxis: {
                type: "linear",
                categories: "",
                tickInterval: 7
            },
            yAxis: {
                tickAmount: 5,
                labels: {
                    format: "￥{value}"
                },
                title: {
                    text: ""
                }
            },
            plotOptions: {
                area: {
                    marker: {
                        enabled: !1,
                        symbol: "circle",
                        radius: 2,
                        states: {
                            hover: {
                                enabled: !0
                            }
                        }
                    }
                }
            }
        },
        series: [{
            name: "支出",
            data: "",
            tooltip: {
                pointFormat: ' <span style="color:{point.color}">●</span>{series.name}: <b>￥{point.y}元</b><br/>'
            },
            marker: {
                enabled: !1
            }
        }],
        title: {
            text: "支出走势",
            style: {
                fontSize: "12px"
            }
        }
    }
}
]),
angular.module("wealth-app.bill.services", []).service("BillService", ["api", "CONFIGURATION", function(a, b) {
    this.getListBill = function(b, c, d,cb) {
        var data =  {"code":0,"data":{"pageIndex":0,"count":20,"data":[]}};
		cb && cb(data);
    }
    ,
    this.getSubListBill = function(b, c) {
        return a.get("categoryBillDetail", {
            yearMonth: b,
            categoryId: c
        }).then(function(a) {
            return a.data
        }
        )
    }
    ,
    this.getStatCategoryInfo = function(b,cb) {
        var data =  {"code":0,"data":{"categorys":[]}};
		cb && cb(data);
    }
    ,
    this.getSummaryBillInfo = function(b,cb) {
        var data =  {"code":0,"data":{"income":"0.0","payout":"0.0","sum":"0.0"}};
		cb && cb(data);
    }
    ,
    this.getUserInfo = function(cb) {
        var data =  {"code":0,"msg":"success","data":{"avatar":"http://wx.qlogo.cn/mmopen/YjXHja5RLEicDt2WzsKhD0Iz9k5NicgXl6stL8oxiaO4w60o7WV0MdfDPDsEw7pCe7sgY6K2KXibqGQZoTH14AxtGAURDOAIVAmf/0","nickname":"小虎哥"}};
		cb && cb(data);
    }
}
]).service("AnalysisService", ["api", "CONFIGURATION", function(a, b) {
    this.getStatLineInfo = function(b) {
        return a.get("statLine", {
            yearMonth: b
        }).then(function(a) {
            return a.data
        }
        )
    }
    ,
    this.getStatPieInfo = function(b) {
        return a.get("statPie", {
            yearMonth: b
        }).then(function(a) {
            return a.data
        }
        )
    }
}
]),
angular.module("wealth-app.voice.controllers", []).controller("RecordPopController", ["$rootScope", "$scope", "close", "successRecordCallback", "modalService", "VoiceService", function(a, b, c, d, e, f) {
    var g = function(a) {
        var c = function(a) {
            return a ? "<h3>" + a + "</h3>" : "<h3>按住说话 松开记账</h3><p>例如：早餐10元</p>"
        }
        ;
        b.voiceTips = c(a)
    }
    ;
    g(),
    b.closeVoice = function() {
        c(),
        a.global.info.isBlur = !1
    }
    ,
    b.showBillAdd = function() {
        b.closeVoice(),
        e.showBillAdd(function(a) {
            d(a)
        }
        , g)
    }
    ,
    b.translateCallback = function(a) {
        return a ? void f.voiceRecord(a).then(function(c) {
            if (0 === c.code && c.data.length > 0) {
                b.closeVoice();
                var h = c.data
                  , i = {
                    billId: h[0].detail_id,
                    time: h[0].record_time.slice(0, 7),
                    cost: h[0].cost,
                    remark: h[0].remark,
                    category: {
                        id: h[0].classify_id,
                        icon: "commodity",
                        name: h[0].classify
                    }
                };
                e.showBillEdit(i, function(a) {
                    d(!0)
                }
                )
            } else
                g(f.getFunnyTips(a))
        }
        ) : (g("识别结果为空"),
        !1)
    }
}
]).controller("RecordFastController", ["$scope", "modalService", "VoiceService", function(a, b, c) {
    var d = function(b) {
        a.voiceTips = b || "按住说话 松开记账"
    }
      , e = function(a) {}
    ;
    a.voiceTips = "按住说话 松开记账",
    a.showBillAdd = function() {
        b.showBillAdd(function(a) {
            e(a)
        }
        , d)
    }
    ,
    a.translateCallback = function(a) {
        return a ? void c.voiceRecord(a).then(function(f) {
            if (0 === f.code && f.data.length > 0) {
                var g = f.data
                  , h = {
                    billId: g[0].detail_id,
                    time: g[0].record_time.slice(0, 7),
                    cost: g[0].cost,
                    remark: g[0].remark,
                    category: {
                        id: g[0].classify_id,
                        icon: "commodity",
                        name: g[0].classify
                    }
                };
                b.showBillEdit(h, function(a) {
                    e(a)
                }
                )
            } else
                d(c.getFunnyTips(a))
        }
        ) : (d("识别结果为空"),
        !1)
    }
}
]),
angular.module("wealth-app.voice.services", []).service("VoiceService", ["api", "CONFIGURATION", function(a, b) {
    this.voiceRecord = function(b) {
        return a.get("voiceRecord", {
            sem: b,
            type: "voice"
        }).then(function(a) {
            return a.data
        }
        )
    }
    ,
    this.getFunnyTips = function(a) {
        var b = ["@word@？不明白呢，试试像这样说：早餐10元", "@word@？小多没听明白，离话筒再近一点吧", "@word@？按照格式说如：早餐10元，会更容易识别哦~"];
        return a = a.replace(/(？|。|，|！)$/, ""),
        b[(new Date).getTime() % b.length].replace("@word@", a)
    }
}
]),
angular.module("wealth-app.bill-operate.controllers", []).controller("BillEditController", ["$scope", "$element", "close", "bill", "modalService", "operateService", function(a, b, c, d, e, f) {
    var g = (new Date).getHours();
    a.billInfo = {
        time: "",
        newTime: "",
        cost: "0",
        remark: "",
        category: {
            id: 11 > g ? 201 : 17 > g ? 202 : 203,
            icon: "&#x36;",
            color: "#ff9f12",
            name: 11 > g ? "早餐" : 17 > g ? "午餐" : "晚餐",
            parentId: 2,
            parentName: "餐饮"
        }
    },
    a.ifUpdateBill = !1,
    a.hasChanged = !1,
    a.ifShowNums = !1,
    d.billId && d.billId > 0 ? (a.ifUpdateBill = !0,
    f.getBill(d, function(b) {
        a.billInfo = b,
        a.billInfo.newTime = a.billInfo.time,
        a.inputVal = a.billInfo.cost,
        setTimeout(function() {
            new atomuDatePicker({
                containerId: "date_container",
                triggerId: "date_container_trigger",
                mod: "fastclick",
                isSingleDay: !0,
                stopToday: !1,
                clickSubmit: !0,
                defaultDate: a.billInfo.time,
                callback: function(b) {
                    a.billInfo.newTime = b,
                    a.$apply()
                }
            }),
            h()
        }
        , 100)
    }
    )) : (d.cost && (a.billInfo = d,
    a.ifUpdateBill = !0),
    setTimeout(function() {
        new atomuDatePicker({
            mod: "fastclick",
            containerId: "date_container",
            triggerId: "date_container_trigger",
            isSingleDay: !0,
            stopToday: !1,
            clickSubmit: !0,
            autoSubmit: !0,
            callback: function(b) {
                a.billInfo.newTime = b,
                a.billInfo.time = b,
                a.$apply()
            }
        }),
        h()
    }
    , 100),
    setTimeout(function() {
        a.ifShowNums = !0,
        a.$apply(),
        ANI.slideInBottom(b[8])
    }
    ));
    var h = function() {
        a.$watchCollection(function(a) {
            return a.billInfo
        }
        , function(b, c) {
            return 0 == b.cost ? void (a.hasChanged = !1) : void (a.hasChanged = !0)
        }
        , !0)
    }
    ;
    a.cancelBillEdit = function() {
        ANI.slideOutBottom(b[2]),
        c(null , 250)
    }
    ,
    a.showNums = function(c) {
        i = !0,
        setTimeout(function() {
            a.ifShowNums = !0,
            a.$apply(),
            ANI.slideInBottom(b[8])
        }
        ),
        c.preventDefault(),
        c.stopPropagation()
    }
    ,
    a.hideNums = function(c) {
        ANI.slideOutBottom(b[8]),
        setTimeout(function() {
            a.ifShowNums = !1,
            a.$apply()
        }
        , 250)
    }
    ,
    a.saveBillEdit = function() {
        a.billInfo.cost = a.inputVal,
        a.hasChanged ? a.ifUpdateBill ? f.updateBill(a.billInfo, function(a) {
            ANI.slideOutBottom(b[2]),
            c({
                operate: "update",
                result: !0
            }, 250)
        }
        ) : f.addBill(a.billInfo, function(a) {
            ANI.slideOutBottom(b[2]),
            c({
                operate: "add",
                result: !0
            }, 250)
        }
        ) : a.ifUpdateBill && (ANI.slideOutBottom(b[2]),
        c(null , 250))
    }
    ,
    a.deleteBill = function(a, d) {
        new window.atomuDialog({
            type: 1,
            hideTitle: !1,
            mod: "warning",
            title: "",
            content: "您确定要删除当前的账目记录？",
            buttonText: {
                txt1: "删除",
                txt2: "取消"
            },
            width: "80%",
            position: 2,
            autoMask: !0
        },function() {
            f.deleteBill(a, function(a) {
                ANI.slideOutBottom(b[2]),
                c({
                    operate: "delete",
                    result: !0
                }, 250),
                "function" == typeof d && d(a)
            }
            )
        }
        )
    }
    ,
    a.showCateogrySelect = function() {
        e.showCategorySelect(a.billInfo.category, function(b) {
            b && (a.billInfo.category.name = b.name,
            a.billInfo.category.id = b.id,
            a.billInfo.category.parentId = b.parentCategory.id,
            a.billInfo.category.icon = b.parentCategory.icon,
            a.billInfo.category.color = b.parentCategory.color,
            a.billInfo.category.parentName = b.parentCategory.name,
            a.hasChanged = !0)
        }
        )
    }
    ,
    a.nums = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, ".", "清空", "确定", ""],
    a.inputVal = a.billInfo.cost;
    var i = !0;
    a.inputNum = function(b) {
        if ("确定" === b)
            return void a.hideNums();
        var c = a.inputVal.toString();
        "" === b ? 1 === c.length ? a.inputVal = c = 0 : c = c.slice(0, c.length - 1) : "." === b ? c.indexOf(".") < 0 && (c += ".") : 0 === b ? "0" !== c && (c += "0") : "清空" === b ? c = "0" : "0" === c || i ? (c = b,
        i = !1) : c += "" + b,
        a.inputVal = c,
        a.billInfo.cost = c
    }
}
]).controller("BillDeleteController", ["$scope", function(a) {}
]),
angular.module("wealth-app.bill-operate.services", []).service("operateService", ["$http", "CONFIGURATION", "api", function(a, b, c) {
    this.addBill = function(a, b) {
        var a = {
            categoryId: a.category.id,
            recordTime: a.time,
            money: a.cost,
            remark: a.remark
        };
        c.post("addBill", a).then(function(a) {
            b && b(a)
        }
        )
    }
    ,
    this.getBill = function(a, b) {
        var d = {
            billId: a.billId,
            yearMonth: a.time.slice(0, 7)
        };
        c.get("infoBill", d).then(function(a) {
            var c = a.data.data
              , d = {
                time: c.recordTime.slice(0, 10),
                billId: c.billId,
                category: {
                    id: c.categoryId,
                    name: c.categoryName,
                    parentId: c.categoryParentId,
                    parentName: c.categoryParentName,
                    icon: c.categoryIcon[0].code,
                    color: c.categoryIcon[0].color
                },
                cost: c.money,
                remark: c.remarks
            };
            b && b(d)
        }
        )
    }
    ,
    this.updateBill = function(a, b) {
        var a = {
            billId: a.billId,
            categoryId: a.category.id,
            newDate: a.newTime,
            yearMonth: a.time.slice(0, 7),
            money: a.cost,
            remark: a.remark
        };
        c.post("modBill", a).then(function(a) {
            b && b(a)
        }
        )
    }
    ,
    this.deleteBill = function(a, b) {
        var d = {
            billId: a.billId,
            yearMonth: a.time.slice(0, 7)
        };
        c.post("delBill", d).then(function(a) {
            b && b(d)
        }
        )
    }
}
]),
angular.module("wealth-app.category.controllers", ["ng-sortable"]).controller("CategoryController", ["$scope", "close", "category", "categoryService", "$element", function(a, b, c, d, e) {
    a.categories = [],
    a.subCategories = [],
    a.activedCate = -1,
    a.activedSubCate = "",
    a.selectRow = -1,
    d.getCategory(function(b) {
        a.categories = h(b),
        f(c, a.categories)
    }
    );
    var f = function(b, c) {
        var d = g(b, c);
        a.selectCategory(d.category, d.row),
        a.activedSubCate = b.id
    }
      , g = function(a, b) {
        var c = {
            category: {},
            row: 0
        };
        for (var d in b)
            for (var e in b[d])
                if (b[d][e].id == a.parentId)
                    return c.category = b[d][e],
                    c.row = d,
                    c
    }
    ;
    a.closeCategory = function() {
        ANI.slideOutBottom(e[0]),
        b(null , 250)
    }
    ,
    a.selectCategory = function(b, c) {
        a.activedCate = b.id,
        a.subCategories = i(b),
        a.selectRow = c
    }
    ,
    a.selectItem = function(c) {
        a.activedSubCate = c.id,
        ANI.slideOutBottom(e[0]),
        b(c, 250)
    }
    ;
    var h = function(a) {
        var b = []
          , c = [];
        for (var d in a)
            0 !== d && d % 3 === 0 && (b.push(angular.copy(c)),
            c = []),
            c.push(a[d]);
        return b.push(c),
        b
    }
      , i = function(a) {
        var b = []
          , c = [];
        for (var d in a.categoryId)
            0 !== d && d % 3 === 0 && (b.push(angular.copy(c)),
            c = []),
            a.categoryId[d].parentCategory = a,
            c.push(a.categoryId[d]);
        return b.push(c),
        b
    }
}
]).controller("CategorySelectController", ["$scope", "category", "categoryService", "modalService", "$element", "close", "$filter", "$timeout", function(a, b, c, d, e, f, g, h) {
    function i() {
        var a = function(a, b) {
            b && b.push(a)
        }
          , b = function(a, b) {
            var c = 0;
            for (c in b)
                if (a.id === b[c].id)
                    return b.splice(c, 1),
                    c - 1;
            return c
        }
          , c = function(a, b) {
            for (var c = 0, d = b.length; d > c; c++)
                for (var e = b[c].categoryId, f = 0, g = e.length; g > f; f++)
                    if (e[f].id === a)
                        return b[c];
            return -1
        }
          , d = function(b, c) {
            a(b, c)
        }
          , e = function(a, c) {
            return b(a, c)
        }
        ;
        return {
            findParentCate: c,
            addCategory: d,
            removeCategory: e
        }
    }
    a.categories = [],
    a.subCategories = [],
    a.curCategoryId = -1,
    a.curSubCategoryId = "",
    a.curCategory = {},
    a.showOpt = {
        isMarkList: !1,
        isCategoryList: !1
    },
    a.isOther = g("isOther");
    var j = new i
      , k = function(a, b) {
        var c = {};
        for (var d in a)
            if (a[d].id === b) {
                c = a[d];
                break
            }
        return c
    }
      , l = function(cb) {
        return c.getCustomCateList(function(b, c) {
            a.categories = b,
            a.markList = c
			cb && cb();
        }
        )
    }
      , m = function(b) {
        a.selectCategory(b.parentId),
        a.curSubCategoryId = b.id
    }
    ;
    a.closeCategory = function() {
        ANI.slideOutBottom(e[0]),
        f(null , 250)
    }
    ,
    a.showCategoryEdit = function() {
        d.showCategoryEdit("back", function(b) {
            b && h(function() {
                l(function(b, c) {
                    var d = !k(b, a.curCategoryId).id;
                    d && a.showMarkList()
                }
                )
            }
            , 200)
        }
        )
    }
    ,
    a.showMarkList = function() {
        a.curCategoryId = -1,
        a.showOpt.isMarkList = !0,
        a.showOpt.isCategoryList = !1
    }
    ,
    a.selectCategory = function(b) {
        a.curCategoryId = b,
        a.curCategory = k(a.categories, b),
        a.subCategories = a.curCategory.categoryId,
        a.showOpt.isMarkList = !1,
        a.showOpt.isCategoryList = !0
    }
    ,
    a.selectSubCategory = function(b) {
        b.parentCategory = j.findParentCate(b.id, a.categories),
        a.curCategoryId = b.id,
        ANI.slideOutBottom(e[0]),
        f(b, 250)
    }
    ,
    a.isMark = function(b) {
        var c = !1;
        for (var d in a.markList)
            if (a.markList[d].id === b) {
                c = !0;
                break
            }
        return c
    }
    ,
    a.markCategory = function(b, e) {
        e || a.isMark(b.id) ? c.unmarkCategory(b.id).then(function(c) {
            0 === c.code ? (d.showTips("取消收藏成功"),
            j.removeCategory(b, a.markList)) : d.showTips("取消收藏失败")
        }
        ) : c.markCategory(b.id).then(function(c) {
            0 === c.code ? (d.showTips("收藏成功"),
            j.addCategory(b, a.markList)) : d.showTips("收藏失败")
        }
        )
    }
    ,
    function() {
        l(function() {
            m(b)
        }
        )
    }
    ()
}
]).controller("CategoryEditController", ["$scope", "categoryService", "modalService", "random", "$element", "close", "cateEditType", "$timeout", function(a, b, c, d, e, f, g, h) {
    function i() {
        var a = function(a, b) {
            var c = {};
            for (var d in a)
                if (a[d].id === b) {
                    c = a[d];
                    break
                }
            return c
        }
          , b = function(a, b) {
            b && b.push(a)
        }
          , c = function(a, b) {
            var c = 0;
            for (c in b)
                if (a.id === b[c].id)
                    return b.splice(c, 1),
                    c - 1;
            return c
        }
          , d = function(a, b) {
            var c = 0;
            for (var c in b)
                if (c == a)
                    return b.splice(c, 1),
                    c - 1;
            return c
        }
          , e = function(c, d, e) {
            var f = a(d, e);
            b(c, f.categoryId)
        }
          , f = function(b, c, e) {
            var f = a(c, e);
            d(b, f.categoryId)
        }
          , g = function(a, c) {
            b(a, c)
        }
          , h = function(a, b) {
            return c(a, b)
        }
        ;
        return {
            findCategoryByID: a,
            addSubCategoryByID: e,
            removeSubCategory: f,
            addCategory: g,
            removeCategory: h
        }
    }
    a.categories = [],
    a.subCategories = [],
    a.markList = [],
    a.curCategoryId = -1,
    a.curSubCategoryId = "",
    a.curCategory = {},
    a.showOpt = {
        isFocus: !1,
        isNewSubCate: !1,
        isNewCate: !1,
        isMarkList: !1,
        isCategoryList: !1
    },
    a.popType = "back" == g ? "back" : g;
    var j, k, l = function(cb) {
        return b.getCustomCateList(function(b, c) {
            a.categories = t(b),
            a.markList = t(c),
            j = angular.copy(a.categories),
            k = angular.copy(a.markList),
            n(),
            console.log("categories", a.categories)
			cb && cb();
        }
        )
    }
    , m = function(a, b) {
        var c, d, e = [];
        return angular.forEach(a, function(a) {
            c = !0,
            angular.forEach(b, function(b) {
                a.id == b.id && (c = !1,
                angular.forEach(a.categoryId, function(a) {
                    d = !0,
                    angular.forEach(b.categoryId, function(b) {
                        a.id == b.id && (d = !1)
                    }
                    ),
                    d && e.push(a.id)
                }
                ))
            }
            ),
            c && (e.push(a.id),
            angular.forEach(a.categoryId, function(a) {
                e.push(a.id)
            }
            ))
        }
        ),
        e
    }
    , n = function(a, b) {
        return !angular.equals(a, b)
    }
    , o = function() {
        new window.atomuDialog({
            type: 1,
            hideTitle: !1,
            mod: "warning",
            title: "",
            content: "有编辑内容未保存，是否保存?",
            buttonText: {
                txt1: "不保存",
                txt2: "保存"
            },
            buttonHandle: {
                handle1: function() {
                    a.saveResult(!0)
                },
                handle2: function() {
                    a.closePop()
                }
            },
            width: "80%",
            position: 2,
            autoMask: !0
        })
    }
    , p = function(a) {
        new window.atomuDialog({
            type: 1,
            hideTitle: !1,
            mod: "warning",
            title: "",
            content: "您确定要删除当前的类目？",
            buttonText: {
                txt1: "删除",
                txt2: "取消"
            },
            width: "80%",
            position: 2,
            autoMask: !0
        },a)
    }
    , q = function() {
        a.showOpt.isNewSubCate = !1,
        a.subCategoryTpl = {
            name: "",
            id: "",
            sortId: "",
            type: 1
        }
    }
    , r = function() {
        a.categoryTpl = {
            id: 1,
            name: "",
            iconName: "income",
            icon: "&#x30;",
            color: "#f94b15",
            sortId: 999,
            categoryId: []
        }
    }
    , s = new i, t = function(a) {
        for (var b in a)
            if (a[b].sortId = b,
            a[b].hasOwnProperty("categoryId")) {
                var c = a[b].categoryId;
                for (var d in c)
                    c[d].sortId = d
            }
        return a
    }
    ;
    a.selectCategory = function(b) {
        a.curCategoryId = b,
        a.curCategory = s.findCategoryByID(a.categories, b),
        a.subCategories = a.curCategory.categoryId,
        a.showOpt.isNewCate = !1,
        a.showOpt.isMarkList = !1,
        a.showOpt.isCategoryList = !0,
        r(),
        q()
    }
    ,
    a.selectSubCategory = function(b) {
        a.curSubCategoryId = b.id
    }
    ,
    a.showMarkList = function() {
        a.curCategoryId = -1,
        a.subCategories = [],
        a.showOpt.isNewCate = !1,
        a.showOpt.isMarkList = !0,
        a.showOpt.isCategoryList = !1
    }
    ,
    a.showAddNewCate = function() {
        a.curCategoryId = -1,
        a.subCategories = [],
        a.showOpt.isNewCate = !0,
        a.showOpt.isMarkList = !1,
        a.showOpt.isCategoryList = !1,
        q()
    }
    ,
    a.showAddNewSubCate = function() {
        a.showOpt.isNewSubCate = !0
    }
    ,
    a.slideLeft = function(a, b) {
        1 === a.type && (a.deleted = !0)
    }
    ,
    a.slideRight = function(a, b) {
        a.deleted = !1
    }
    ,
    a.deleteCategory = function(b) {
        p(function() {
            var c = s.removeCategory(b, a.categories);
            a.selectCategory(a.categories[c].id),
            a.$apply()
        }
        )
    }
    ,
    a.deleteSubCategory = function(b, c) {
        s.removeSubCategory(b, a.categories, a.curCategoryId)
    }
    ,
    a.updatCategory = function(a) {}
    ,
    a.updateSubCategory = function(b, c) {
        "" === c.name && s.removeSubCategory(b, a.categories, a.curCategoryId)
    }
    ,
    a.addNewCate = function(b) {
        var c = {
            name: "其它",
            id: +new Date + d(3),
            sortId: "99",
            type: 1
        };
        b.id = +new Date + d(3),
        b.type = 1,
        s.addCategory(b, a.categories),
        s.addSubCategoryByID(c, a.categories, b.id),
        a.selectCategory(b.id),
        r()
    }
    ,
    a.addNewSubCate = function(b) {
        "" !== b.name && (b.id = +new Date + d(3),
        b.type = 1,
        s.addSubCategoryByID(b, a.categories, a.curCategoryId),
        q())
    }
    ,
    a.subCateSortConf = {
        delay: 300,
        animation: 10,
        filter: ".js-ignore-drag",
        ghostClass: "dragging",
        chosenClass: "dragging",
        forceFallback: !0,
        fallbackClass: "dragging",
        dataIdAttr: "data-id",
        handle: ".js-sort-handle",
        scroll: !0,
        scrollSensitivity: 30,
        scrollSpeed: 10,
        onSort: function(a) {}
    },
    a.cateSortConf = {
        delay: 300,
        animation: 10,
        filter: ".js-ignore-drag",
        ghostClass: "dragging",
        chosenClass: "dragging",
        forceFallback: !0,
        fallbackClass: "dragging",
        dataIdAttr: "data-id",
        scroll: !0,
        scrollSensitivity: 30,
        scrollSpeed: 10,
        onSort: function(a) {}
    },
    a.markSortConf = {
        delay: 300,
        animation: 10,
        filter: ".js-ignore-drag",
        ghostClass: "dragging",
        chosenClass: "dragging",
        forceFallback: !0,
        fallbackClass: "dragging",
        dataIdAttr: "data-id",
        handle: ".js-sort-handle",
        scroll: !0,
        scrollSensitivity: 30,
        scrollSpeed: 10,
        onSort: function(a) {}
    },
    a.saveResult = function(d) {
        var g = m(j, a.categories)
          , i = t(a.categories)
          , l = t(a.markList);
        b.saveCategory(i, l, g).then(function(b) {
            0 === b.code ? (c.showTips("保存成功"),
            d || "back" === a.popType ? h(function() {
                ANI.slideOutBottom(e[0]),
                f(b, 250)
            }
            , 200) : (j = angular.copy(i),
            k = angular.copy(l))) : c.showTips("保存失败")
        }
        )
    }
    ,
    a.leavePage = function() {
        var b = t(a.categories)
          , c = t(a.markList);
        n(k, c) || n(j, b) ? o() : a.closePop()
    }
    ,
    a.showCateogryIconSelect = function(b) {
        c.showCategoryIconSelect(b, function(b) {
            b && (a.showOpt.isNewCate ? (a.categoryTpl.iconName = b.iconName,
            a.categoryTpl.icon = b.code,
            a.categoryTpl.color = b.color) : a.showOpt.isCategoryList && (a.curCategory.iconName = b.iconName,
            a.curCategory.icon = b.code,
            a.curCategory.color = b.color,
            h(function() {
                a.$apply()
            }
            , 500),
            console.log(a.curCategory),
            console.log("categories:", t(a.categories))))
        }
        )
    }
    ,
    a.closePop = function() {
        ANI.slideOutBottom(e[0]),
        f(null , 250)
    }
    ,
    function() {
        l(function() {
            a.showMarkList()
        }
        ),
        r()
    }
    ()
}
]).controller("CategoryIconSelectController", ["$scope", "categoryService", "inputIcon", "close", "$element", "modalService", "$rootScope", function(a, b, c, d, e, f, g) {
    a.categoryIcons = [],
    a.curIconName = "",
    a.curIndex = 0;
    var h = function() {
        return b.getCategoryIcons().then(function(b) {
            a.categoryIcons = k(b)
        }
        )
    }
      , i = function(b) {
        a.curIconName = b,
        a.curIndex = j(b, a.categoryIcons),
        console.log(a.curIconName, a.curIndex)
    }
      , j = function(a, b) {
        var c = 0;
        for (var d in b) {
            var e = b[d];
            for (var f in e)
                if (e[f].iconName === a) {
                    c = d;
                    break
                }
        }
        return c
    }
      , k = function(a) {
        var b = []
          , c = [];
        for (var d in a)
            "0" !== d && d % 10 === 0 && (b.push(angular.copy(c)),
            c = []),
            c.push(a[d]);
        return b.push(c),
        b
    }
    ;
    a.closePop = function() {
        ANI.slideOutBottom(e[0]),
        d(null , 250)
    }
    ,
    a.selectCategoryIcon = function(b) {
        a.curIconName = b.iconName,
        ANI.slideOutBottom(e[0]),
        d(b, 250)
    }
    ,
    a.slideLeft = function(b, c) {
        c.preventDefault(),
        a.curIndex = ++a.curIndex < a.categoryIcons.length ? a.curIndex : a.categoryIcons.length - 1
    }
    ,
    a.slideRight = function(b, c) {
        c.preventDefault(),
        a.curIndex = --a.curIndex > 0 ? a.curIndex : 0
    }
    ,
    function() {
        h().then(function() {
            i(c)
        }
        )
    }
    ()
}
]),
angular.module("wealth-app.category.services", []).service("categoryService", ["api", "$q", function(a, b) {
    this.getCategory = function(b) {
		var data = {"code":0,"data":{"categoryParentId":[{"id":1,"name":"购物消费","type":0,"iconName":"shopping","icon":[{"code":"&#x34;","color":"#f04132"}],"sortId":0,"categoryId":[{"id":101,"sortId":0,"type":0,"name":"日常用品"},{"id":102,"sortId":1,"type":0,"name":"服装鞋帽"},{"id":103,"sortId":2,"type":0,"name":"化妆护肤"},{"id":104,"sortId":3,"type":0,"name":"电器数码"},{"id":105,"sortId":4,"type":0,"name":"美容美发"},{"id":106,"sortId":5,"type":0,"name":"虚拟物品"},{"id":107,"sortId":6,"type":0,"name":"送礼人情"},{"id":199,"sortId":7,"type":0,"name":"其它"}]},{"id":2,"name":"餐饮","type":0,"iconName":"dining","icon":[{"code":"&#x36;","color":"#f39800"}],"sortId":1,"categoryId":[{"id":201,"sortId":0,"type":0,"name":"早餐"},{"id":202,"sortId":1,"type":0,"name":"午餐"},{"id":203,"sortId":2,"type":0,"name":"晚餐"},{"id":204,"sortId":3,"type":0,"name":"加餐"},{"id":205,"sortId":4,"type":0,"name":"饮料酒水"},{"id":206,"sortId":5,"type":0,"name":"零食"},{"id":207,"sortId":6,"type":0,"name":"水果"},{"id":208,"sortId":7,"type":0,"name":"买菜"},{"id":209,"sortId":8,"type":0,"name":"请客吃饭"},{"id":299,"sortId":9,"type":0,"name":"其它"}]},{"id":3,"name":"交通费","type":0,"iconName":"traffic","icon":[{"code":"&#x32;","color":"#75c740"}],"sortId":2,"categoryId":[{"id":301,"sortId":0,"type":0,"name":"公共交通"},{"id":302,"sortId":1,"type":0,"name":"打车"},{"id":303,"sortId":2,"type":0,"name":"加油"},{"id":304,"sortId":3,"type":0,"name":"停车费"},{"id":305,"sortId":4,"type":0,"name":"日常养护"},{"id":399,"sortId":5,"type":0,"name":"其它"}]},{"id":4,"name":"休闲娱乐","type":0,"iconName":"fun","icon":[{"code":"&#x31;","color":"#8574dc"}],"sortId":3,"categoryId":[{"id":401,"sortId":0,"type":0,"name":"电影"},{"id":402,"sortId":1,"type":0,"name":"旅游度假"},{"id":403,"sortId":2,"type":0,"name":"运动健身"},{"id":404,"sortId":3,"type":0,"name":"棋牌桌游"},{"id":405,"sortId":4,"type":0,"name":"KTV"},{"id":499,"sortId":5,"type":0,"name":"其它"}]},{"id":5,"name":"居家生活","type":0,"iconName":"home","icon":[{"code":"&#x35;","color":"#75c740"}],"sortId":4,"categoryId":[{"id":501,"sortId":0,"type":0,"name":"房租房贷"},{"id":502,"sortId":1,"type":0,"name":"生活费"},{"id":503,"sortId":2,"type":0,"name":"家政清洁"},{"id":504,"sortId":3,"type":0,"name":"物业水电煤"},{"id":505,"sortId":4,"type":0,"name":"话费宽带"},{"id":506,"sortId":5,"type":0,"name":"宠物"},{"id":599,"sortId":6,"type":0,"name":"其它"}]},{"id":6,"name":"健康医疗","type":0,"iconName":"health","icon":[{"code":"&#x3d;","color":"#02b540"}],"sortId":5,"categoryId":[{"id":601,"sortId":0,"type":0,"name":"诊疗费"},{"id":602,"sortId":1,"type":0,"name":"药品费"},{"id":603,"sortId":2,"type":0,"name":"住院费"},{"id":604,"sortId":3,"type":0,"name":"按摩理疗"},{"id":699,"sortId":4,"type":0,"name":"其它"}]},{"id":7,"name":"文化教育","type":0,"iconName":"teaching","icon":[{"code":"&#x33;","color":"#30c5cb"}],"sortId":6,"categoryId":[{"id":701,"sortId":0,"type":0,"name":"学杂费"},{"id":702,"sortId":1,"type":0,"name":"培训考试"},{"id":703,"sortId":2,"type":0,"name":"书报杂志"},{"id":799,"sortId":3,"type":0,"name":"其它"}]},{"id":98,"name":"收入","type":0,"iconName":"income","icon":[{"code":"&#x30;","color":"#4aa5ea"}],"sortId":7,"categoryId":[{"id":9801,"sortId":0,"type":0,"name":"工资"},{"id":9802,"sortId":1,"type":0,"name":"奖金"},{"id":9803,"sortId":2,"type":0,"name":"补贴"},{"id":9804,"sortId":3,"type":0,"name":"中奖"},{"id":9805,"sortId":4,"type":0,"name":"礼金人情"},{"id":9806,"sortId":5,"type":0,"name":"理财盈利"},{"id":9899,"sortId":6,"type":0,"name":"其它"}]},{"id":99,"name":"其它","type":0,"iconName":"common","icon":[{"code":"&#x3b;","color":"#f39800"}],"sortId":8,"categoryId":[{"id":9901,"sortId":0,"type":0,"name":"慈善捐助"},{"id":9902,"sortId":1,"type":0,"name":"理财支出"},{"id":9903,"sortId":2,"type":0,"name":"罚款赔偿"},{"id":9904,"sortId":3,"type":0,"name":"丢失"},{"id":9999,"sortId":4,"type":0,"name":"其它"}]}],"markList":[{"id":401,"sortId":0,"name":"电影"}]}};
        var a = data.data.categoryParentId, c = [];
		if (a && a.length > 0)
			for (var d in a)
				a[d].color = a[d].icon[0].color,
				a[d].icon = a[d].icon[0].code,
				c.push(a[d]);
		return c.sort(function(a, b) {
			var c = 0;
			return c = a.sortId < b.sortId ? -1 : 1
		})
    }
    ,
    this.getCustomCateList = function(b) {
		var data = {"code":0,"data":{"categoryParentId":[{"id":1,"name":"购物消费","type":0,"iconName":"shopping","icon":[{"code":"&#x34;","color":"#f04132"}],"sortId":0,"categoryId":[{"id":101,"sortId":0,"type":0,"name":"日常用品"},{"id":102,"sortId":1,"type":0,"name":"服装鞋帽"},{"id":103,"sortId":2,"type":0,"name":"化妆护肤"},{"id":104,"sortId":3,"type":0,"name":"电器数码"},{"id":105,"sortId":4,"type":0,"name":"美容美发"},{"id":106,"sortId":5,"type":0,"name":"虚拟物品"},{"id":107,"sortId":6,"type":0,"name":"送礼人情"},{"id":199,"sortId":7,"type":0,"name":"其它"}]},{"id":2,"name":"餐饮","type":0,"iconName":"dining","icon":[{"code":"&#x36;","color":"#f39800"}],"sortId":1,"categoryId":[{"id":201,"sortId":0,"type":0,"name":"早餐"},{"id":202,"sortId":1,"type":0,"name":"午餐"},{"id":203,"sortId":2,"type":0,"name":"晚餐"},{"id":204,"sortId":3,"type":0,"name":"加餐"},{"id":205,"sortId":4,"type":0,"name":"饮料酒水"},{"id":206,"sortId":5,"type":0,"name":"零食"},{"id":207,"sortId":6,"type":0,"name":"水果"},{"id":208,"sortId":7,"type":0,"name":"买菜"},{"id":209,"sortId":8,"type":0,"name":"请客吃饭"},{"id":299,"sortId":9,"type":0,"name":"其它"}]},{"id":3,"name":"交通费","type":0,"iconName":"traffic","icon":[{"code":"&#x32;","color":"#75c740"}],"sortId":2,"categoryId":[{"id":301,"sortId":0,"type":0,"name":"公共交通"},{"id":302,"sortId":1,"type":0,"name":"打车"},{"id":303,"sortId":2,"type":0,"name":"加油"},{"id":304,"sortId":3,"type":0,"name":"停车费"},{"id":305,"sortId":4,"type":0,"name":"日常养护"},{"id":399,"sortId":5,"type":0,"name":"其它"}]},{"id":4,"name":"休闲娱乐","type":0,"iconName":"fun","icon":[{"code":"&#x31;","color":"#8574dc"}],"sortId":3,"categoryId":[{"id":401,"sortId":0,"type":0,"name":"电影"},{"id":402,"sortId":1,"type":0,"name":"旅游度假"},{"id":403,"sortId":2,"type":0,"name":"运动健身"},{"id":404,"sortId":3,"type":0,"name":"棋牌桌游"},{"id":405,"sortId":4,"type":0,"name":"KTV"},{"id":499,"sortId":5,"type":0,"name":"其它"}]},{"id":5,"name":"居家生活","type":0,"iconName":"home","icon":[{"code":"&#x35;","color":"#75c740"}],"sortId":4,"categoryId":[{"id":501,"sortId":0,"type":0,"name":"房租房贷"},{"id":502,"sortId":1,"type":0,"name":"生活费"},{"id":503,"sortId":2,"type":0,"name":"家政清洁"},{"id":504,"sortId":3,"type":0,"name":"物业水电煤"},{"id":505,"sortId":4,"type":0,"name":"话费宽带"},{"id":506,"sortId":5,"type":0,"name":"宠物"},{"id":599,"sortId":6,"type":0,"name":"其它"}]},{"id":6,"name":"健康医疗","type":0,"iconName":"health","icon":[{"code":"&#x3d;","color":"#02b540"}],"sortId":5,"categoryId":[{"id":601,"sortId":0,"type":0,"name":"诊疗费"},{"id":602,"sortId":1,"type":0,"name":"药品费"},{"id":603,"sortId":2,"type":0,"name":"住院费"},{"id":604,"sortId":3,"type":0,"name":"按摩理疗"},{"id":699,"sortId":4,"type":0,"name":"其它"}]},{"id":7,"name":"文化教育","type":0,"iconName":"teaching","icon":[{"code":"&#x33;","color":"#30c5cb"}],"sortId":6,"categoryId":[{"id":701,"sortId":0,"type":0,"name":"学杂费"},{"id":702,"sortId":1,"type":0,"name":"培训考试"},{"id":703,"sortId":2,"type":0,"name":"书报杂志"},{"id":799,"sortId":3,"type":0,"name":"其它"}]},{"id":98,"name":"收入","type":0,"iconName":"income","icon":[{"code":"&#x30;","color":"#4aa5ea"}],"sortId":7,"categoryId":[{"id":9801,"sortId":0,"type":0,"name":"工资"},{"id":9802,"sortId":1,"type":0,"name":"奖金"},{"id":9803,"sortId":2,"type":0,"name":"补贴"},{"id":9804,"sortId":3,"type":0,"name":"中奖"},{"id":9805,"sortId":4,"type":0,"name":"礼金人情"},{"id":9806,"sortId":5,"type":0,"name":"理财盈利"},{"id":9899,"sortId":6,"type":0,"name":"其它"}]},{"id":99,"name":"其它","type":0,"iconName":"common","icon":[{"code":"&#x3b;","color":"#f39800"}],"sortId":8,"categoryId":[{"id":9901,"sortId":0,"type":0,"name":"慈善捐助"},{"id":9902,"sortId":1,"type":0,"name":"理财支出"},{"id":9903,"sortId":2,"type":0,"name":"罚款赔偿"},{"id":9904,"sortId":3,"type":0,"name":"丢失"},{"id":9999,"sortId":4,"type":0,"name":"其它"}]}],"markList":[{"id":401,"sortId":0,"name":"电影"}]}};
        var c = data.data.categoryParentId
              , d = data.data.markList
              , e = [];
            if (c && c.length > 0)
                for (var f in c) {
                    if (c[f].color = c[f].icon[0].color,
                    c[f].icon = c[f].icon[0].code,
                    c[f].hasOwnProperty("categoryId")) {
                        var g = c[f].categoryId;
                        g.sort(function(a, b) {
                            return a.sortId - b.sortId
                        }
                        )
                    }
                    e.push(c[f])
                }
            return e.sort(function(a, b) {
                return a.sortId - b.sortId
            }
            ),
            d.sort(function(a, b) {
                return a.sortId - b.sortId
            }
            ), b&&(b(e,d)),e
    }
    ,
    this.saveCategory = function(b, c, d) {
        return a.post("saveCategory", {
            categories: b,
            delList: d || [],
            markList: c || []
        }).then(function(a) {
            return a.data
        }
        )
    }
    ,
    this.markCategory = function(b) {
        return a.get("markCategory", {
            categoryId: b
        }).then(function(a) {
            return a.data
        }
        )
    }
    ,
    this.unmarkCategory = function(b) {
        return a.get("unmarkCategory", {
            categoryId: b
        }).then(function(a) {
            return a.data
        }
        )
    }
    ,
    this.getCategoryIcons = function() {
        var a = {
            income: {
                name: "收入",
                picName: "income",
                code: "&#x30;",
                color: "#4aa5ea"
            },
            fun: {
                name: "休闲娱乐",
                picName: "entertainment",
                code: "&#x31;",
                color: "#8574dc"
            },
            traffic: {
                name: "交通",
                picName: "traffic",
                code: "&#x32;",
                color: "#75c740"
            },
            teaching: {
                name: "文化教育",
                picName: "education",
                code: "&#x33;",
                color: "#30c5cb"
            },
            shopping: {
                name: "购物",
                picName: "shopping",
                code: "&#x34;",
                color: "#f04132"
            },
            home: {
                name: "居家生活",
                picName: "home",
                code: "&#x35;",
                color: "#75c740"
            },
            dining: {
                name: "餐饮",
                picName: "dining",
                code: "&#x36;",
                color: "#f39800"
            },
            heart: {
                name: "收藏",
                picName: "",
                code: "&#x37;",
                color: "#f94b15"
            },
            bag: {
                name: "购物袋",
                picName: "",
                code: "&#x39;",
                color: "#fa6383"
            },
            travel: {
                name: "旅游",
                picName: "",
                code: "&#x3a;",
                color: "#8574dc"
            },
            common: {
                name: "其它",
                picName: "",
                code: "&#x3b;",
                color: "#f39800"
            },
            health: {
                name: "医疗健康",
                picName: "medical",
                code: "&#x3d;",
                color: "#02b540"
            },
            digital: {
                name: "数码",
                picName: "",
                code: "&#x3e;",
                color: "#8574dc"
            },
            hospitalization: {
                name: "住院",
                picName: "",
                code: "&#x3f;",
                color: "#30c5cb"
            },
            healthcare: {
                name: "保健",
                picName: "",
                code: "&#x40;",
                color: "#f04132"
            },
            gift: {
                name: "礼品",
                picName: "",
                code: "&#x41;",
                color: "#8574dc"
            },
            game: {
                name: "游戏",
                picName: "",
                code: "&#x42;",
                color: "#8574dc"
            },
            furniture: {
                name: "家具",
                picName: "",
                code: "&#x43;",
                color: "#4aa5ea"
            },
            financing: {
                name: "理财",
                picName: "",
                code: "&#x44;",
                color: "#4aa5ea"
            },
            favor: {
                name: "人情",
                picName: "",
                code: "&#x45;",
                color: "#f04132"
            },
            "electrical-equipment": {
                name: "电器",
                picName: "",
                code: "&#x46;",
                color: "#4aa5ea"
            },
            "electric-charge": {
                name: "水电",
                picName: "",
                code: "&#x47;",
                color: "#f04132"
            },
            drug: {
                name: "药品",
                picName: "",
                code: "&#x48;",
                color: "#32ca9c"
            },
            drink: {
                name: "饮品",
                picName: "",
                code: "&#x49;",
                color: "#8574dc"
            },
            housekeeping: {
                name: "家政",
                picName: "",
                code: "&#x4a;",
                color: "#f39800"
            },
            dessert: {
                name: "甜点",
                picName: "",
                code: "&#x4b;",
                color: "#f39800"
            },
            dentistry: {
                name: "牙科",
                picName: "",
                code: "&#x4c;",
                color: "#75c740"
            },
            "daily-expenses": {
                name: "日用",
                picName: "",
                code: "&#x4d;",
                color: "#32ca9c"
            },
            clothes: {
                name: "服饰",
                picName: "",
                code: "&#x4e;",
                color: "#30c5cb"
            },
            bus: {
                name: "公交",
                picName: "",
                code: "&#x4f;",
                color: "#75c740"
            },
            book: {
                name: "书刊",
                picName: "",
                code: "&#x50;",
                color: "#4aa5ea"
            },
            bonus: {
                name: "奖金",
                picName: "",
                code: "&#x51;",
                color: "#f39800"
            },
            bodybuilding: {
                name: "健身",
                picName: "",
                code: "&#x52;",
                color: "#75c740"
            },
            bill: {
                name: "话费",
                picName: "",
                code: "&#x53;",
                color: "#75c740"
            },
            beauty: {
                name: "美妆",
                picName: "",
                code: "&#x54;",
                color: "#f04132"
            },
            art: {
                name: "艺术",
                picName: "",
                code: "&#x55;",
                color: "#8574dc"
            },
            ariplane: {
                name: "飞机",
                picName: "",
                code: "&#x56;",
                color: "#4aa5ea"
            },
            movie: {
                name: "电影",
                picName: "",
                code: "&#x57;",
                color: "#30c5cb"
            },
            oiling: {
                name: "加油",
                picName: "",
                code: "&#x58;",
                color: "#f39800"
            },
            park: {
                name: "停车",
                picName: "",
                code: "&#x59;",
                color: "#8574dc"
            },
            pet: {
                name: "宠物",
                picName: "",
                code: "&#x5a;",
                color: "#f39800"
            },
            renovation: {
                name: "装修",
                picName: "",
                code: "&#x5b;",
                color: "#32ca9c"
            },
            snacks: {
                name: "零食",
                picName: "",
                code: "&#x5c;",
                color: "#32ca9c"
            },
            stationery: {
                name: "文具",
                picName: "",
                code: "&#x5d;",
                color: "#30c5cb"
            },
            "three-meals": {
                name: "三餐",
                picName: "",
                code: "&#x5e;",
                color: "#75c740"
            },
            train: {
                name: "火车",
                picName: "",
                code: "&#x5F;",
                color: "#8574dc"
            },
            tuition: {
                name: "学费",
                picName: "",
                code: "&#x60;",
                color: "#75c740"
            },
            wages: {
                name: "工资",
                picName: "",
                code: "&#x61;",
                color: "#75c740"
            },
            fruit: {
                name: "水果",
                picName: "",
                code: "&#x62;",
                color: "#f04132"
            }
        }
          , c = function(a) {
            var b = [];
            for (var c in a)
                a[c].iconName = c,
                b.push(a[c]);
            return b
        }
          , d = b.defer();
        return d.resolve(c(a)),
        d.promise
    }
}
]),
angular.module("wealth-app.more.controllers", []).controller("MoreController", ["$scope", "close", "$element", "modalService", "$rootScope", function(a, b, c, d, e) {
    a.dataTime = "2015-09-17",
    a.closeMore = function() {
        b(null , 250)
    }
    ,
    a.showCurrency = function() {
        a.closeMore(),
        d.showCalculator()
    }
    ,
    a.showShopping = function() {
        a.closeMore(),
        d.showShopping()
    }
    ,
    a.showCategoryEdit = function() {
        a.closeMore(),
        d.showCategoryEdit()
    }
}
]),
angular.module("wealth-app.currency.controllers", []).controller("CurrencyController", ["$scope", "close", "$element", "modalService", "currencyService", "currencType", function(a, b, c, d, e, f) {
    a.hideHome = "app" === f,
    a.dataTime = "",
    a.rates = [{
        name: "人民币",
        aka: "CNY",
        value: "0"
    }, {
        name: "美元",
        aka: "USD",
        value: "0"
    }, {
        name: "港币",
        aka: "HKD",
        value: "0"
    }],
    e.getRates(function(b) {
        a.rates = b.items,
        a.dataTime = b.time,
        a.dataTime = new Date
    }
    ),
    a.closeCurrency = function() {
        ANI.slideOutBottom(c[0]),
        b(null , 250)
    }
    ,
    a.showCalculator = function() {
        d.showCalculator()
    }
}
]).controller("CurrencyFastController", ["$scope", "$element", "modalService", "currencyService", "$rootScope", "$filter", "$location", function(a, b, c, d, e, f, g) {
    a.hideHome = "app" === g.search().refer,
    a.dataTime = "",
    a.rates = [{
        name: "人民币",
        aka: "CNY",
        value: "0"
    }, {
        name: "美元",
        aka: "USD",
        value: "0"
    }, {
        name: "港币",
        aka: "HKD",
        value: "0"
    }],
    a.currentRate = a.rates[0],
    d.getRates(function(b) {
        a.rates = b.items,
        a.dataTime = b.time,
        a.dataTime = new Date,
        a.currentRate = a.rates[0]
    }
    ),
    a.setCurrentRate = function(b) {
        a.inputVal = f("exchangeRate")(a.inputVal, b.value, a.currentRate.value),
        a.currentRate = b,
        h = !0
    }
    ,
    a.nums = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, ".", "清空", "确定", ""],
    a.inputVal = 100;
    var h = !0;
    a.showNum = !1,
    a.showKeyboard = function() {
        h = !0,
        setTimeout(function() {
            a.showNum = !0,
            a.$apply(),
            ANI.slideInBottom(b[4])
        }
        )
    }
    ,
    a.hideKeyboard = function() {
        ANI.slideOutBottom(b[4]),
        setTimeout(function() {
            a.showNum = !1,
            a.$apply()
        }
        , 250)
    }
    ,
    a.inputNum = function(b, c) {
        if ("确定" === b)
            return void a.hideKeyboard();
        var d = a.inputVal.toString();
        if ("" === b)
            1 === d.length ? a.inputVal = d = 0 : d = d.slice(0, d.length - 1);
        else {
            if (h === !1 && "清空" !== b && d.indexOf(".") > -1 && d.length - d.indexOf(".") === 3)
                return void console.log("二位小数限制");
            "." === b ? d.indexOf(".") < 0 && (d += ".") : 0 === b ? "0" !== d && (d += "0") : "清空" === b ? d = "0" : "0" === d || h ? (d = b,
            h = !1) : d += "" + b
        }
        a.inputVal = d
    }
    ,
    a.showCurrency = function() {
        c.showCurrency()
    }
    ,
    a.closeCalculator = function() {
        e.$state.go("index")
    }
}
]).controller("CalculatorController", ["$scope", "close", "$element", "modalService", "currencyService", "$filter", function(a, b, c, d, e, f) {
    a.dataTime = "",
    a.rates = [{
        name: "人民币",
        aka: "CNY",
        value: "0"
    }, {
        name: "美元",
        aka: "USD",
        value: "0"
    }, {
        name: "港币",
        aka: "HKD",
        value: "0"
    }],
    a.currentRate = a.rates[0],
    e.getRates(function(b) {
        a.rates = b.items,
        a.dataTime = b.time,
        a.dataTime = new Date,
        a.currentRate = a.rates[0]
    }
    ),
    a.setCurrentRate = function(b) {
        a.inputVal = f("exchangeRate")(a.inputVal, b.value, a.currentRate.value),
        a.currentRate = b,
        g = !0
    }
    ,
    a.nums = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, ".", "清空", "确定", ""],
    a.inputVal = 100;
    var g = !0;
    a.showNum = !1,
    a.showKeyboard = function() {
        g = !0,
        setTimeout(function() {
            a.showNum = !0,
            a.$apply(),
            ANI.slideInBottom(c[4])
        }
        )
    }
    ,
    a.hideKeyboard = function() {
        ANI.slideOutBottom(c[4]),
        setTimeout(function() {
            a.showNum = !1,
            a.$apply()
        }
        , 250)
    }
    ,
    a.inputNum = function(b, c) {
        if ("确定" === b)
            return void a.hideKeyboard();
        var d = a.inputVal.toString();
        if ("" === b)
            1 === d.length ? a.inputVal = d = 0 : d = d.slice(0, d.length - 1);
        else {
            if (g === !1 && "清空" !== b && d.indexOf(".") > -1 && d.length - d.indexOf(".") === 3)
                return void console.log("二位小数限制");
            "." === b ? d.indexOf(".") < 0 && (d += ".") : 0 === b ? "0" !== d && (d += "0") : "清空" === b ? d = "0" : "0" === d || g ? (d = b,
            g = !1) : d += "" + b
        }
        a.inputVal = d
    }
    ,
    a.showCurrency = function() {
        d.showCurrency()
    }
    ,
    a.closeCalculator = function() {
        ANI.slideOutBottom(c[0]),
        b(null , 250)
    }
}
]),
angular.module("wealth-app.currency.services", []).service("currencyService", ["api", function(a) {
    this.getRates = function(b) {
        var c = {
            time: "",
            items: [{
                name: "人民币",
                aka: "CNY",
                value: "1"
            }]
        };
        a.get("listCurrency").then(function(a) {
            c.time = a.data.data.updateDate;
            var d = a.data.data.listData;
            if (d && d.length > 0)
                for (var e in d) {
                    var f = {
                        name: d[e].CurrencyName,
                        aka: d[e].CurrencyCode,
                        value: d[e].ExchangeRate
                    };
                    c.items.push(f)
                }
            b && b(c)
        }
        )
    }
}
]),
angular.module("wealth-app.shopping.controllers", []).controller("ShoppingController", ["$scope", "close", "$element", "modalService", "shoppingService", function(a, b, c, d, e) {
    a.currentTab = "todos",
    a.showOpt = {
        ifNewTodo: !1
    },
    a.todoItems = [],
    a.doneItems = [],
    e.getTodos(function(b) {
        a.todoItems = b,
        0 === a.todoItems.length && (a.showOpt.ifNewTodo = !0)
    }
    ),
    e.getFinished(function(b) {
        a.doneItems = b
    }
    ),
    a.newTodo = {
        name: "",
        status: !1
    },
    a.setCurrentTab = function(b) {
        a.currentTab = b
    }
    ,
    a.slideLeft = function(a, b) {
        a.deleted = !0
    }
    ,
    a.slideRight = function(a, b) {
        a.deleted = !1
    }
    ,
    a.showAddTodo = function() {
        a.showOpt.ifNewTodo = !0
    }
    ,
    a.addTodo = function(b) {
        "" !== b.name ? e.addTodo(b, function(c) {
            c ? (d.showTips("保存成功"),
            b.id = c,
            a.todoItems.push(b),
            f()) : d.showTips("保存失败")
        }
        ) : f()
    }
    ;
    var f = function() {
        a.showOpt.ifNewTodo = !1,
        a.newTodo = {
            name: "",
            status: !1
        }
    }
      , g = function(a, b) {
        b.push(a)
    }
      , h = function(a, b) {
        for (var c in b)
            a.id === b[c].id && b.splice(c, 1)
    }
    ;
    a.checkItem = function(b, c) {
        setTimeout(function() {
            b.status = !0,
            e.updateTodo(b, function(c) {
                h(b, a.todoItems),
                g(b, a.doneItems),
                d.showTips("已完成")
            }
            )
        }
        , 300)
    }
    ,
    a.updateTodo = function(a) {
        "" !== a.name && e.updateTodo(a, function(a) {
            d.showTips("保存成功")
        }
        )
    }
    ,
    a.deleteTodo = function(b) {
        e.deleteTodo(b, function(c) {
            h(b, a.todoItems),
            d.showTips("删除成功")
        }
        )
    }
    ,
    a.closeShopping = function() {
        ANI.slideOutBottom(c[0]),
        b(null , 250)
    }
}
]).controller("ShoppingFastController", ["$scope", "$element", "modalService", "shoppingService", "$rootScope", function(a, b, c, d, e) {
    a.currentTab = "todos",
    a.showOpt = {
        ifNewTodo: !1
    },
    a.todoItems = [],
    a.doneItems = [],
    d.getTodos(function(b) {
        a.todoItems = b,
        0 === a.todoItems.length && (a.showOpt.ifNewTodo = !0)
    }
    ),
    d.getFinished(function(b) {
        a.doneItems = b
    }
    ),
    a.newTodo = {
        name: "",
        status: !1
    },
    a.setCurrentTab = function(b) {
        a.currentTab = b
    }
    ,
    a.slideLeft = function(a, b) {
        a.deleted = !0
    }
    ,
    a.slideRight = function(a, b) {
        a.deleted = !1
    }
    ,
    a.showAddTodo = function() {
        a.showOpt.ifNewTodo = !0
    }
    ,
    a.addTodo = function(b) {
        "" !== b.name ? d.addTodo(b, function(d) {
            d ? (c.showTips("保存成功"),
            b.id = d,
            a.todoItems.push(b),
            f()) : c.showTips("保存失败")
        }
        ) : f()
    }
    ,
    a.focusInput = function(a) {
        a.target.focus()
    }
    ;
    var f = function() {
        a.showOpt.ifNewTodo = !1,
        a.newTodo = {
            name: "",
            status: !1
        }
    }
      , g = function(a, b) {
        b.push(a)
    }
      , h = function(a, b) {
        for (var c in b)
            a.id === b[c].id && b.splice(c, 1)
    }
    ;
    a.checkItem = function(b, e) {
        setTimeout(function() {
            b.status = !0,
            d.updateTodo(b, function(d) {
                h(b, a.todoItems),
                g(b, a.doneItems),
                c.showTips("已完成")
            }
            )
        }
        , 300)
    }
    ,
    a.updateTodo = function(a) {
        "" !== a.name && d.updateTodo(a, function(a) {
            c.showTips("保存成功")
        }
        )
    }
    ,
    a.deleteTodo = function(b) {
        d.deleteTodo(b, function(d) {
            h(b, a.todoItems),
            c.showTips("删除成功")
        }
        )
    }
    ,
    a.closeShopping = function() {
        e.$state.go("index", "")
    }
}
]),
angular.module("wealth-app.shopping.services", []).service("shoppingService", ["api", function(a) {
    this.getTodos = function(b) {
        var c = [];
        a.get("listNote", {
            pageInfo: "0-50"
        }).then(function(a) {
            var d = a.data.data.data;
            if (d && d.length > 0)
                for (var e in d)
                    if (0 === d[e].NoteType) {
                        var f = {
                            name: d[e].NoteName,
                            id: d[e].NoteId,
                            status: !1
                        };
                        c.push(f)
                    }
            b && b(c)
        }
        )
    }
    ,
    this.getFinished = function(b) {
        var c = [];
        a.get("listNote", {
            pageInfo: "0-50",
            noteType: 1
        }).then(function(a) {
            var d = a.data.data.data;
            if (d && d.length > 0)
                for (var e in d)
                    if (1 === d[e].NoteType) {
                        var f = {
                            name: d[e].NoteName,
                            id: d[e].NoteId,
                            time: d[e].FinishTime,
                            status: !0
                        };
                        c.push(f)
                    }
            b && b(c)
        }
        )
    }
    ,
    this.addTodo = function(b, c) {
        var b = {
            noteName: b.name
        };
        a.post("addNote", b).then(function(a) {
            c && c(a.data.data.nodeId)
        }
        )
    }
    ,
    this.updateTodo = function(b, c) {
        var b = {
            noteId: b.id,
            noteName: b.name,
            noteType: b.status ? 1 : 0
        };
        a.post("modNote", b).then(function(a) {
            c && c(a)
        }
        )
    }
    ,
    this.deleteTodo = function(b, c) {
        var b = {
            noteId: b.id
        };
        a.post("delNote", b).then(function(a) {
            c && c(b)
        }
        )
    }
}
]);
