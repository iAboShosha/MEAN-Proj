(function () {
    'use strict';

    angular
        .module('iRead')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('main', {
                url: '/?{restPassword}',
                templateUrl: 'main/main.html',
                controller: 'AuthenticationController',
                controllerAs: 'vmAuth',
                resolve: {
                    user: function ($http, $rootScope) {
                        if (localStorage.getItem('token'))
                            $http.get('users/me')
                                .then(function (res) {
                                    $rootScope.user = res.data

                                }, function () {
                                    localStorage.clear();
                                    delete $rootScope.logginUserName
                                })
                    }
                }
            })
            .state('verify-email', {
                url: '/email-verify/:key',
                resolve: {
                    verificationCode: function ($stateParams, $http, $state) {
                        $http.post('/users/verify/' + $stateParams.key)
                            .then(function (res) {
                                $state.go('main')
                            }, function (err) {
                                $state.go('main')
                            });

                    }
                }
            })
            .state('participation', {
                url: '/book/participation',
                controllerAs: 'vm',
                controller: 'UniversityController',
                templateUrl: 'book/university/university.html'
            })
            .state('user-participation', {
                url: '/user-participation',
                controllerAs: 'vm',
                controller: 'UserParticipationController',
                templateUrl: 'user-participation/user-participation.html'
            })
            .state('rest', {
                url: '/rest?{key}',
                controllerAs: 'vm',
                controller: 'RestPasswordController',
                templateUrl: 'rest-password/rest-password.html',
                resolve: {
                    token: function ($stateParams, $http, $state, $rootScope) {
                        $http.get('/password-resets/' + $stateParams.key)
                            .then(function (res) {
                                $rootScope.logginUserName = res.data.user.username || res.data.user.email;
                                $rootScope.user = res.data.user;
                                localStorage.setItem('token', res.data.token);
                                //$state.go('main', {restPassword: true})
                                return res.data.token
                            }, function (err) {
                                if (err.status == 404) {
                                    alert('رمز الدخول غير صحيح');
                                    $state.go('main')
                                }
                            })
                    }
                }
            })
            .state('profile', {
                url: '/myProfile/',
                controllerAs: 'vm',
                controller: 'ProfileController',
                templateUrl: 'profile/profile.html',
                resolve: {
                    user: function ($http) {
                        return $http.get('/users/me')
                            .then(function (res) {
                                return res.data;
                            })
                    }
                }
            })
            .state('school', {
                url: '/school',
                resolve: {
                    school: function ($http, $rootScope) {
                        if (localStorage.getItem('token')) {
                            return $http.get('/api/school/me')
                                .then(function (res) {
                                    if (res.data) {
                                        return res.data
                                    } else {
                                        return {};
                                    }
                                }, function (err) {
                                    return {};
                                })
                        } else {
                            //$state.go('main')
                            $rootScope.openLogin();
                        }
                    }
                },
                controllerAs: 'vmSchool',
                controller: 'SchoolController',
                templateUrl: 'school/school.html'
            });
        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true)
    }

})();
