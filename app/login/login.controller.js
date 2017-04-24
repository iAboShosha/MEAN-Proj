(function () {
    'use strict';

    angular
        .module('iRead')
        .controller('LoginController', loginController);

    /** @ngInject */
    function loginController(baseUrl, $http, $uibModalStack, $rootScope, $auth) {
        var vm = this;

        vm.fbLogin = fbLogin;
        vm.twLogin = twLogin;
        vm.gLogin = gLogin;
        vm.liveLogin = liveLogin;
        vm.resetPassword = resetPassword;
        vm.login = login;
        vm.loginForm = loginForm;
        vm.resetForm = resetForm;
        vm.resetMail = "";
        function closeDialog() {
            var topmodal = $uibModalStack.getTop();
            if (topmodal) {
                $uibModalStack.dismiss(topmodal.key);
            }
        }

        function loginForm() {
            $(".resetForm").css("display", "none");
            $(".loginForm").css("display", "block");
        }

        vm.authenticate = function (provider) {
                console.log(res.data)
                $rootScope.logginUserName = res.data.user.username || res.data.user.email;
                $rootScope.user = res.data.user;
                localStorage.setItem('token', res.data.token);
                closeDialog()
            });
        };
        function resetForm() {
            $(".loginForm").css("display", "none");
            $(".resetForm").css("display", "block");
        }

        function resetPassword() {
            $http.post(baseUrl + '/password-resets', {email: vm.resetMail, link: location.origin + '/rest?key='})
                .then(function (res) {
                    closeDialog()
                    alert('يرجى التحقق من البريد الإلكتروني لإعادة تعيين كلمة المرور الخاصة بك');
                }, function (err) {
                    //alert(err.data.message);
                    alert('هذا البريد الإلكتروني غير مسجل');
                });
            // call reset password
        }

        function login() {
            $http.post(baseUrl + '/auth', {},
                {
                    headers: {'Authorization': 'Basic ' + btoa(vm.loginemail + ":" + vm.loginpassword)}
                })
                .then(function (res) {
                    var logUser = res.data;
                    localStorage.setItem("token", logUser.token);
                    vm.logginUserName = logUser.user.username || logUser.user.email;
                    $rootScope.logginUserName = logUser.user.username || logUser.user.email;
                    $rootScope.user = logUser.user;

                    closeDialog()
                }, function (err) {
                    if (err.status == 401) {
                        vm.loginError = 'اسم المستخدم او كلمه المرور غير صحيحه'
                    } else {
                        vm.loginError = err.data.message;
                    }
                    console.log(err)
                });
        }

        function twLogin() {
            var key = '7oDMVNLaBP7BWR8clRLxPBhte';
            var secret = 'v0J8PDF9ByBkSSdmHoMCtoNLsuHujViRbqeqXIL8mK2OMYHLtQ';
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
                // getUserInfofromGoogle().then(function (usrModel) {
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
            return $http.post(baseUrl + '/auth/' + smName, null,
                {
                    withCredentials: true,
                    headers: {'Authorization': 'Bearer ' + accessToken}
                })
                .then(function (res) {
                    closeDialog();

                    vm.logginUserName = res.data.user.username || res.data.user.email;
                    $rootScope.logginUserName = vm.logginUserName;
                    $rootScope.user = res.data.user;
                    localStorage.setItem('token', res.data.token)
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
