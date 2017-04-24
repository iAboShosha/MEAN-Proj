(function () {
    'use strict';

    angular
        .module('iRead', ['ngResource', 'ui.router', 'toastr', 'vcRecaptcha', 'ui.bootstrap', 'satellizer',
            'mgcrea.bootstrap.affix', 'ngIntlTelInput', 'ngMap', 'timer', 'ngSanitize', 'ui.select', 'ngFileUpload'])
        .config(function ($httpProvider, ngIntlTelInputProvider) {

            $httpProvider.defaults.headers.common["content-type"] = "application/json";
            ngIntlTelInputProvider.set(
                {
                    initialCountry: 'auto',
                    nationalMode: false,
                    utilsScript: 'bower_components/intl-tel-input/build/js/utils.js',
                    geoIpLookup: function (callback) {
                        $.get("https://ipinfo.io", function () {
                        }, "jsonp").always(function (resp) {
                            var countryCode = (resp && resp.country) ? resp.country : "";
                            callback(countryCode);
                        });
                    }
                });

        })
        .run(function ($http) {
            FB.init({
                appId: 'test',
                status: true,
                cookie: true,
                xfbml: true
            });
            gapi.load('client:auth2', initClient);
            function initClient() {
                gapi.client.init({
                    apiKey: 'test-e8xaLxcv8MxSKhX2A',
                    discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"],
                    clientId: 'test',
                    scope: 'profile'
                }).then(function () {
                });
            }

            WL.init({
                client_id: "test",
                //redirect_uri: "https://login.live.com/oauth20_authorize.srf",
                scope: "wl.signin",
                response_type: "token"
            });
            /*WL.ui({
             name: "signin",
             element: "signin"
             });*/
        })
        .run(function ($http, $rootScope, $uibModal) {


            var token = localStorage.getItem('token')
            if (token) {
                $http.get('users/me')
                    .then(function (res) {
                        console.log('user loaded')
                        $rootScope.user = res.data;
                        $rootScope.logginUserName = res.data.username || res.data.email;
                    })
            }
        });

})
();
