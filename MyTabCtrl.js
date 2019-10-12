"use strict";
MyTabCtrl.$inject = ['$scope', "$encryptHttp", "$session", "$ocr", "$remote", '$localStorage', "$copy"];

function MyTabCtrl($scope, $encryptHttp, $session, $ocr, $remote, $localStorage, $copy) {
	$scope.xx=function(){
		$("#id1").toggle();
	}
    $scope.init = function () {
        /*    $scope.bindCardInfo={
                BaseAcNo:"123123123123123"
            };*/
        $scope.userRank = $session.get("userRank");
        //开户去查绑定卡信息
        if ($scope.userRank == '0') {
            $scope.cardInit();
        }
        $scope.payeeInfo = $session.getSession("payeeInfo");
        $scope.BankAcc = $session.getSession("BankAcc");
        console.log("userRank", $scope.userRank);
        console.log($scope.payeeInfo);
        $scope.img = $localStorage.localHandle($scope.img, "img");
        //QueryCifNameAndImg
        $encryptHttp("QueryCifNameAndImg.do", {}).then(function (data) {
            if ($scope.img != 'data.headimgurl') {
                $scope.img = data.headimgurl;//微信头像
                $localStorage.set('img', $scope.img);
            }
            $scope.name = data.nickname;//微信昵称
            $session.set('wxName', $scope.name);
        });
    };
    //我的绑定卡,个人信息
    $scope.goToNext = function () {
        switch ($scope.userRank) {
            case "0"://已开户,个人信息
            case "1"://未开户,已注册
                $scope.goto('AccInfo');
                break;
            case "2"://新用户/未登录
                $scope.goto("Register");
                break;
        }
    };
    //立即开户
    $scope.goOpenAcc = function () {
        $ocr();
    };
    //资产总览
    $scope.amountInfo = function () {
        $scope.goto("AccOverview");
    };
    //我的绑定卡详情
    $scope.cardInit = function () {
        $scope.isXEShowFlag = true;//限额是否显示
        $encryptHttp("CarDetailsQuery.do", {}).then(function (data) {
            console.log(data);
            $scope.bindCardInfo = data.List[0];
            if ($scope.bindCardInfo.ProtocolNo == 323465000019) {
                $scope.isXEShowFlag = false;
            }
            $session.addSession('cardDetail', $scope.bindCardInfo);
        });
    };

    //复制卡号
    $scope.copy = function () {
        $copy("copy");
    };
    //分享
    wx.ready(function () {
        console.log(window.location.origin + '/pwxweb/login.html?ChannelId=wxbank&appid=' + $session.get('appId') + '&scope=snsapi_userinfo&redirect_uri=static/index.html%3FChannelId%3Dwxbank%23MyTab');
        //分享到朋友圈
        wx.onMenuShareTimeline({
            title: '金城银行微银行', // 分享标题
            desc: '欢迎体验金城银行微银行', // 分享描述
            link: window.location.origin + '/pwxweb/login.html?ChannelId=wxbank&appid=' + $session.get('appId') + '&scope=snsapi_userinfo&redirect_uri=static/index.html%3FChannelId%3Dwxbank%23MyTab',
            imgUrl: window.location.origin + '/pwxweb/dist/images/share_logo.png', // 分享图标
            success: function () {

            },
            cancel: function () {

            }
        });
        //分享给朋友
        wx.onMenuShareAppMessage({
            title: '金城银行微银行', // 分享标题
            desc: '欢迎体验金城银行微银行', // 分享描述
            link: window.location.origin + '/pwxweb/login.html?ChannelId=wxbank&appid=' + $session.get('appId') + '&scope=snsapi_userinfo&redirect_uri=static/index.html%3FChannelId%3Dwxbank%23MyTab',//生产
            imgUrl: window.location.origin + '/pwxweb/dist/images/share_logo.png', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {

            },
            cancel: function () {

            }
        });
    })
}
