/**
 * Created by iAboShosha on 4/17/17.
 */

(function () {
    angular.module('iRead')
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push(function ($rootScope, $q, $location, $window) {
                return {
                    'request': function (config) {
                        if (localStorage.getItem('token'))
                            config.headers['authorization2'] =  localStorage.getItem('token');
                        return config;
                    },
                    // 'responseError': function (rejection) {
                    //     // do something on error
                    //     if(rejection.status === 404){
                    //         $location.path('/404');
                    //     }
                    //     else if (rejection.status === 401 && $location.path().indexOf('/share/') == -1) {
                    //         $location.path('/login');
                    //         console.log('===========')
                    //         console.log('401 logout')
                    //         console.log('===========')
                    //         return;
                    //     } else if (rejection.status === 401 && $location.path().indexOf('/share/') != -1) {
                    //         localStorage.clear();
                    //         $window.location.href = $location.path();
                    //         return;
                    //     }
                    //     return $q.reject(rejection);
                    // }
                };
            });
        })

})();