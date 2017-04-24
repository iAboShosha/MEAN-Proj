(function () {
    'use strict';

    angular
        .module('iRead')
        .controller('HighSchoolController', highSchoolController);

    /** @ngInject */
    function highSchoolController(baseUrl, $http, $rootScope, $stateParams) {
        var vm = this;
        vm.books = [];
        vm.filteredCities = [];
        vm.dob = {
            days: [],
            months: [],
            years: []
        };
        vm.book = {
            personalInfo: {
                gender: '0',
                dob: {
                    day: '1',
                    month: 'يناير',
                    year: '1995'
                },
                region: '1'
            },
            book: {},
            reading: {}
        };

        vm.filterCities = filterCities;
        vm.submitBookForm = submitBookForm;
        vm.refreshBooks = refreshBooks;

        function _init() {
            vm.dob = {
                days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                months: ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيه", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
                years: [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010]
            };
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
        };

        function filterCities(regionId) {
            angular.forEach(vm.cities, function (city) {
                if (city.region_id === regionId) {
                    vm.filteredCities.push(city);
                }
            });
        }

        function refreshBooks(bookName) {
            $http.get(baseUrl + '/goodreads/searchBooks/' + bookName)
                .then(function (res) {
                    if (res) {
                        vm.books = res.data;
                    }
                    else {
                        vm.citeis = [];
                    }
                });
        }

        function submitBookForm() {
        };

        _init();
    }
})();
