(function () {
    'use strict';

    angular
        .module('iRead')
        .controller('AuthenticationController', authenticationController);

    /** @ngInject */
    function authenticationController($stateParams, baseUrl, $http, $q, $uibModal, $auth, $rootScope, vcRecaptchaService) {
        var vm = this;
        vm.test = function () {
            $http.get(baseUrl + '/goodreads/searchBooks/' + 'Ender%27s+Game')
                .then(function (res) {
                    console.log(res);
                }, function (err) {
                });
        };
        vm.endTime = new Date("April 22, 2017 12:00:00").getTime();
        vm.fbLogin = fbLogin;
        vm.twLogin = twLogin;
        vm.gLogin = gLogin;
        vm.liveLogin = liveLogin;
        vm.createUser = createUser;

        vm.userInfo = {};
        vm.genders = [{Name: 'اختر الجنس', value: 1}, {Name: 'ذكر', value: 0}, {Name: 'انثى', value: 1}];
        vm.publicKey = "";
        vm.setWidgetId = setWidgetId;


        vm.authenticate = function (provider) {
            $auth.authenticate(provider).then(function (res) {
                $rootScope.logginUserName = res.data.user.username || res.data.user.email;
                $rootScope.user = res.data.user;
                localStorage.setItem('token', res.data.token)
                $('#NewUser').modal('toggle');
            });
        };
        vm.signup = function () {

        };
        vm.recaptchaWidgetId = null;

        function setWidgetId(widgetId) {
            console.log(widgetId);
            vm.recaptchaWidgetId = widgetId;
        }
        function createUser() {
            vm.submitted = true;
            if (vm.userInfo['g-recaptcha-response'] === "" || vm.userInfo['g-recaptcha-response'] == null) { //if string is empty
                alert("قم بادخال كلمه التحقيق")
            } else {
                if (vm.userInfo.email && vm.userInfo.reemail && vm.userInfo.mobile && vm.userInfo.username && vm.userInfo.password && vm.userInfo.repassword && vm.userInfo.checkedInfo)
                    registerUser();
                else
                    return false;
            }
        }

        function registerUser() {
            $http.post(baseUrl + '/users', vm.userInfo)
                .then(function (res) {
                    $('#NewUser').modal('toggle');
                    vm.userInfo = null;
                }, function (err) {
                    //vcRecaptchaService.reload(vm.recaptchaWidgetId);
                    alert(err.data.message);
                });
        }


        function twLogin() {
            var key = '';
            var secret = '';
            var cat = key + ":" + secret;
            var credentials = btoa(cat);

            $http.post('https://api.twitter.com/oauth2/token', {grant_type: 'client_credentials'}, {
                headers: {
                    "Authorization": "Basic " + credentials,
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                }
            })
                .then(function (res) {
                    console.log(res);
                }, function (err) {
                });
        }

        function gLogin() {
            gapi.auth2.getAuthInstance().signIn().then(function () {
                //getUserInfofromGoogle().then(function (usrModel) {
                registerSMUser('google', gapi.client.getToken().access_token);
                //});
            }, function (error) {
                console.log(error);
            });
        }


        function liveLogin() {
            WL.login({
                scope: ["wl.signin", "wl.basic", "wl.emails"]
            }).then(function (loginInfo) {
                    WL.api({
                        path: "me",
                        method: "GET"
                    }).then(function (usrModel) {
                            registerSMUser('live', loginInfo.session.access_token);
                        },
                        function (responseFailed) {
                            console.log(responseFailed);
                        });
                },
                function (sessionError) {
                    // Some error handling.
                });
        }

        function fbLogin() {
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    var accessToken = response.authResponse.accessToken;
                    registerSMUser('facebook', accessToken);

                } else {
                    FB.login(function (loginResponse) {
                        var accessToken = loginResponse.authResponse.accessToken;
                        registerSMUser('facebook', accessToken);
                    });
                }
            });
        }

        function registerSMUser(smName, accessToken) {
            $http.post(baseUrl + '/auth/' + smName, null,
                {
                    withCredentials: true,
                    headers: {'Authorization': 'Bearer ' + accessToken}
                })
                .then(function (res) {
                    $('#NewUser').modal('toggle');
                    vm.logginUserName = res.data.user.username || res.data.user.email;
                    $rootScope.logginUserName = vm.logginUserName;
                    $rootScope.user = res.data.user;
                    localStorage.setItem('token', res.data.token);
                }, function (err) {
                    if(err.status==401){
                        alert('لايمكن التسجيل لان البريد الالكترونى غير متاح عبر موقع التواصل الاجتماعى');
                    }
                    else {
                        alert(err.data.message);
                    }
                });
        }

    }
})();
