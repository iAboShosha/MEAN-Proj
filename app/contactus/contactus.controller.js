/**
 * Created by iAboShosha on 4/17/17.
 */
(function () {
    'use strict';

    angular
        .module('iRead')
        .controller('ContactusController', contactusController);

    /** @ngInject */
    function contactusController($http, $stateParams, $uibModalStack) {
        var vm = this;


        vm.submit = submit;


        function submit(form) {
            if (form.$valid) {
                $http.post('/contact-us', vm.model)
                    .then(function (res) {
                        alert('تم ارسال الرساله')
                        var topmodal = $uibModalStack.getTop();
                        if (topmodal) {
                            $uibModalStack.dismiss(topmodal.key);
                        }
                    })
            }
        }
    }
})();