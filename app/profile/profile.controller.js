/**
 * Created by iAboShosha on 4/17/17.
 */
(function () {
    'use strict';

    angular
        .module('iRead')
        .controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController(user, $http, baseUrl, $state) {
        var vm = this;

        _init();
        vm.fbLogin = fbLogin;
        vm.twLogin = twLogin;
        vm.gLogin = gLogin;
        vm.liveLogin = liveLogin;
        vm.update = update;
        vm.filterCities = filterCities;
        vm.filteredCities = [];
        vm.genders = [{Name: 'اختر الجنس', value: 1}, {Name: 'ذكر', value: 0}, {Name: 'انثى', value: 1}];
        vm.user = user;
        //////////////////////
        function _init() {
            $http.get(baseUrl + '/region')
                .then(function (res) {
                    if (res) {
                        vm.regions = res.data;
                        $http.get(baseUrl + '/city')
                            .then(function (res) {
                                if (res) {
                                    vm.cities = res.data;
                                }
                                else {
                                    vm.citeis = [];
                                }
                            });
                    }
                    else {
                        vm.regions = [];
                        vm.citeis = [];
                    }
                });
        }

        function filterCities(regionId) {
            vm.filteredCities = [];
            angular.forEach(vm.cities, function (city) {
                if (city.region_id == regionId) {
                    vm.filteredCities.push(city);
                }
            });
        }

        function update() {
            vm.error = '';
            vm.user.gender *= 1;
            $http.put('/users', vm.user)
                .then(function (res) {
                    $state.go('main')
                }, function (err) {
                    vm.error = err.data.message
                })
        }


        function twLogin() {
            var key = 'test';
            var secret = 'test';
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
                    alert('تم التسجيل بنجاح');
                    $http.get('/users/me')
                        .then(function (res) {
                            vm.user = res.data;
                        })
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