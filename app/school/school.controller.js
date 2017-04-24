/**
 * Created by iAboShosha on 4/17/17.
 */
(function () {
    'use strict';

    angular
        .module('iRead')
        .controller('SchoolController', schoolController);

    /** @ngInject */
    function schoolController($http, baseUrl, $state, school, $rootScope) {
        var vm = this;

        _init();
        vm.school = school || {};
        vm.schoolRegister = schoolRegister;
        vm.filterCities = filterCities;

        function schoolRegister() {
            if (localStorage.getItem('token')) {
                var method = vm.school.id ? 'put' : 'post'
                $http[method]('/api/school', vm.school)
                    .then(function (res) {
                        console.log(res.data)
                        alert('شكرا لك لاضافة المدرسة وسيتم التواصل معكم لامدامكم بكود التفعيل، مع العلم أنه يمنكم التواصل مباشرة مع الأستاذة نورة العفيلي 057081775');
                        $state.go('main')
                    }, function (err) {
                        alert(err.message)
                    })
            } else {
                $rootScope.openLogin()
            }
        }

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

        vm.schoolTypes = [{Name:'أهلية بنين', value: 0}, {Name: 'أهلية بنات', value: 1}, {Name: 'حكومية بنين', value: 2}, {Name: 'حكومية بنات', value: 3}, {Name: 'دولية', value: 4}];

        vm.school.latlng = [23.8859, 45.0792];
        vm.getpos = function (event) {
            vm.school.latlng = [event.latLng.lat(), event.latLng.lng()];
        };
    }
})();