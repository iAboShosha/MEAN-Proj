/**
 * Created by iAboShosha on 4/20/17.
 */
(function () {
    'use strict';

    angular
        .module('iRead')
        .run(function ($uibModal,$rootScope,$state) {

            $rootScope.openProfile = openProfile;
            $rootScope.logOut = logOut;
            $rootScope.openLogin = openLogin;
            $rootScope.contactUs = contactUs;

            function contactUs() {
                $uibModal.open({
                    templateUrl: 'contactus/contactus.html',
                    controller: 'ContactusController',
                    controllerAs: 'vm'
                });
            }

            function logOut() {
                if(window.confirm('تأكيد تسجيل الخروج ؟')) {
                    localStorage.clear();
                    delete $rootScope.logginUserName;
                    delete $rootScope.user;
                    $state.go('main');
                }
            }

            function openLogin() {
                $uibModal.open({
                    templateUrl: 'login/login.html',
                    controller: 'LoginController',
                    controllerAs: 'login'
                });
            }

            function openProfile() {
                $uibModal.open({
                    controller: 'ProfileController',
                    templateUrl: 'profile/profile.html',
                    controllerAs: 'vm',
                    windowClass: 'profile-model',
                    resolve: {
                        user: function ($http) {
                            return $http.get('/users/me')
                                .then(function (res) {
                                    return res.data;
                                })
                        }
                    }
                });
            }

        })
})();