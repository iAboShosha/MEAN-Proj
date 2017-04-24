/**
 * Created by iAboShosha on 4/17/17.
 */
(function () {
    'use strict';

    angular
        .module('iRead')
        .controller('UserParticipationController', userParticipationController);

    /** @ngInject */
    function userParticipationController(baseUrl, $http, $rootScope) {
        var vm = this;

        vm.participation = [];
        vm.userName = $rootScope.logginUserName;

        function _init() {
            $http.get(baseUrl + '/iread-legacy')
                .then(function (res) {
                    if (res) {
                        vm.participation = res.data;
                    }
                    else {
                        vm.participation = [];
                    }
                });
        }
        _init();
    }
})();