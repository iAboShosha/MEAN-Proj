(function () {
    'use strict';

    angular
        .module('iRead')
        .controller('UniversityController', universityController);

    /** @ngInject */
    function universityController(baseUrl, $http, $rootScope, $uibModal, Upload, $timeout,$state) {
        var vm = this;
        vm.books = [];
        vm.filteredCities = [];
        vm.book = {
            userId: $rootScope.user ? $rootScope.user.id : null,
            nearedCity: '0',
            status: 'notsave',
            files: [],
            filesName: []
        };
        vm.mode = 'add';
        vm.universities = [];

        vm.submitBookForm = submitBookForm;
        vm.refreshBooks = refreshBooks;
        vm.onSelected = onSelected;
        vm.submitParticipat = submitParticipate;
        vm.submitVerificationCode = submitVerificationCode;
        vm.upload = upload;
        vm.refreshSchools = refreshSchools;
        vm.onSelectedSchool = onSelectedSchool;
        function _init() {
            if (!$rootScope.user || !$rootScope.user.id) {
                vm.disabled = true;
                $state.go('main');
            }
            else {
                $http.get(baseUrl + '/university/' + $rootScope.user.id)
                    .then(function (res) {
                        if (res) {
                            vm.book = res.data;
                            vm.book.name = JSON.parse(vm.book.name);
                            vm.book.knowContest = JSON.parse(vm.book.knowContest);
                            vm.book.filesName = vm.book.filesName ? JSON.parse(vm.book.filesName) : [];
                            vm.book.nearedCity = vm.book.nearedCity.toString();
                            if (vm.book.status === 'save') {
                                vm.book.status = 'notsave';
                            }
                            vm.mode = 'update';
                            vm.disabled = vm.book.status === 'submit';
                        }
                    });

                $http.get(baseUrl + '/api/school')
                    .then(function (res) {
                        if (res) {
                            vm.universities = res.data;
                        }
                    });

                $http.get(baseUrl + '/education-level')
                    .then(function (res) {
                        console.log('sss');
                        console.log(res);
                        if (res) {
                            vm.educationLevels = res.data;
                        }
                    });

            }

        }

        function refreshBooks(bookName) {
            if (bookName) {
                $http.get(baseUrl + '/goodreads/searchBooks/' + bookName)
                    .then(function (res) {
                        if (res && res.data.length > 0) {
                            vm.books = res.data;
                        }
                        else {
                            var book = {
                                title: bookName,
                                author: {
                                    name: ''
                                },
                                image_url: ''
                            };
                            vm.books = [book];
                        }
                    });
            }
        }
        function refreshSchools(search){
            var newuniversities = vm.universities.slice();
            vm.universities = vm.universities.filter(function(university){
               return  university.id !==  "-1"
            });

            if (search && newuniversities.indexOf(search) === -1) {
                vm.universities.unshift({id: "-1", name: search});
            }
        }
        function submitBookForm() {
            if (!checkContest(vm.book.knowContest)) {
                alert('يرجى إختيار من الاخيارات المعرفة بالجائزة');
                return;
            }
            vm.book.name = JSON.stringify(vm.book.name);
            vm.book.knowContest = JSON.stringify(vm.book.knowContest);
            vm.book.filesName = JSON.stringify(vm.book.filesName);

            vm.book.status = 'save';
            if(vm.book.university === "-1"){
                var universityObj = {name: vm.universities[0].name};
                $http.post(baseUrl +'/api/school/fake', universityObj)
                .then(function(res){
                    vm.book.university = res.data.id;
                    $http.get(baseUrl + '/api/school')
                        .then(function (res) {
                            if (res) {
                                vm.universities = res.data;
                            }
                            _addOrUpdateBook();
                        });
                });
            }
            else {
                _addOrUpdateBook();
            }
        };
        function _addOrUpdateBook(){
            if (vm.mode === 'add') {
                $http.post(baseUrl + '/university', vm.book)
                    .then(function (res) {
                        alert('تمت المشاركة بنجاح');
                        vm.book = res.data;
                        vm.book.name = JSON.parse(vm.book.name);
                        vm.book.knowContest = JSON.parse(vm.book.knowContest);
                        vm.book.filesName = vm.book.filesName ? JSON.parse(vm.book.filesName) : [];
                        vm.book.nearedCity = vm.book.nearedCity.toString();
                        vm.book.accepted = true;
                        vm.disabled = vm.book.status === 'submit';
                    }, function (err) {
                        console.log(JSON.stringify(err));
                        alert(err.data.message);
                    });
            }
            else {
                $http.put(baseUrl + '/university/' + vm.book._id, vm.book)
                    .then(function (res) {
                        alert('تم تحديث المشاركة');
                        vm.book = res.data;
                        vm.book.name = JSON.parse(vm.book.name);
                        vm.book.knowContest = JSON.parse(vm.book.knowContest);
                        vm.book.filesName = vm.book.filesName ? JSON.parse(vm.book.filesName) : [];
                        vm.book.nearedCity = vm.book.nearedCity.toString();
                        vm.book.accepted = true;
                        vm.disabled = vm.book.status === 'submit';

                    }, function (err) {
                        console.log(JSON.stringify(err));
                        alert(err.data.message);
                    });
            }
        }
        function checkContest(contests) {
            var result = false;
            angular.forEach(contests, function (contest) {
                if (contest) {
                    result = true;
                }
            });
            return result;
        }

        function onSelected(selectedItem) {
            vm.book.author = selectedItem.author.name;
        };

        function onSelectedSchool(selectedItem){

            vm.selectedSchool = selectedItem;
        }
        function submitParticipate() {
            if (window.confirm('أنت على صدد تسليم المشاركة بشكل نهائي ولن تتمكن من تغير محتوى البيانات، هل أنت متأكد من تسليمك النهائي؟')) {
                $http.put(baseUrl + '/university/updateStatus/' + vm.book._id, {status: 'submit'})
                    .then(function (res) {
                        alert('تم التسجيل المشاركة بنجاح')
                        vm.book = res.data;
                        vm.book.name = JSON.parse(vm.book.name);
                        vm.book.knowContest = JSON.parse(vm.book.knowContest);
                        vm.book.nearedCity = vm.book.nearedCity.toString();
                        vm.book.filesName = vm.book.filesName ? JSON.parse(vm.book.filesName) : [];
                        vm.book.accepted = true;
                        vm.disabled = vm.book.status === 'submit';
                        if (vm.book.postTwit) {
                            var hashtag = "مسابقة_أقرأ";
                            var twitter = window.open('https://twitter.com/intent/tweet?lang=ar&hashtags=' + hashtag + '&text=' + vm.book.twit, ' tweet now ', 'width=1000,height=400')
                        }
                    }, function (err) {
                        console.log(JSON.stringify(err));
                        alert(err.data.message);
                    });
            }
        }

        function submitVerificationCode() {
            $http.put(baseUrl + '/university/updateVerificationCode/' + vm.book._id, {verificationCode: vm.book.verificationCode})
                .then(function (res) {

                    vm.book = res.data;
                    vm.book.name = JSON.parse(vm.book.name);
                    vm.book.knowContest = JSON.parse(vm.book.knowContest);
                    vm.book.nearedCity = vm.book.nearedCity.toString();
                    vm.book.filesName = vm.book.filesName ? JSON.parse(vm.book.filesName) : [];
                    vm.book.accepted = true;
                    vm.disabled = vm.book.status === 'submit';
                    alert('تم تعديل كود التفعيل الان');
                }, function (err) {
                    console.log(JSON.stringify(err));
                    alert(err.data.message);
                });
        }

        function openLogin() {
            var loginModal = $uibModal.open({
                templateUrl: 'login/login.html',
                controller: 'LoginController',
                controllerAs: 'login'
            });
            loginModal.result.then(function () {
                _init();
            }, function () {
                _init();

            });
        }

        var _countOfFiles = 0;

        function upload(files) {
            _countOfFiles = 0;
            vm.disabledUpload = true;
            vm.book.files = files;
            angular.forEach(vm.book.files, function (file) {
                file.upload = Upload.upload({
                    url: baseUrl + '/upload',
                    data: {file: file}
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        file.fileName = response.data.filename;
                        vm.book.filesName.push({name: file.name, filename: file.fileName});
                    });
                }, function (response) {
                    if (response.status > 0) {
                        vm.errorMsg = response.status + ': ' + response.data;
                        console.log(vm.errorMsg);
                    }
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                    if (file.progress == 100) {
                        _countOfFiles += 1;
                        vm.disabledUpload = files.length > _countOfFiles;
                    }
                });
            });
        }

        _init();
    }
})();
