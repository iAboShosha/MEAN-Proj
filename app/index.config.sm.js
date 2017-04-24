/**
 * Created by iAboShosha on 4/17/17.
 */
(function () {
    angular.module('iRead')
        .config(function ($authProvider) {

            $authProvider.twitter({
                url: '/auth/twitter',
                authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
                redirectUri: window.location.origin + '/auth/twitter',
                oauthType: '1.0',
                popupOptions: {width: 495, height: 645}
            });
        })
})();