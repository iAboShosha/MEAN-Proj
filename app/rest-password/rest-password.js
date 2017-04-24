/**
 * Created by iAboShosha on 4/17/17.
 */
(function () {
    'use strict';

    angular
        .module('iRead')
        .controller('RestPasswordController', RestPasswordController);

    /** @ngInject */
    function RestPasswordController($http, $stateParams, $state, $rootScope) {
        var vm = this;
        vm.update = update;
        //////////////////////

        function update() {
            vm.error = '';
            $http.put('/password-resets/' + $stateParams.key, {password: vm.password})
                .then(function (res) {
                    localStorage.clear();
                    delete $rootScope.logginUserName;
                    $state.go('main')
                }, function (err) {
                    vm.error = err.data.message
                })
        }
    }
})();