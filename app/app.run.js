(function () {
    'use strict';

    angular
        .module('app')
        .run(land)
        .run(configureCordova)
        .run(setCustomLogs)
        .run(setHttpDefaultCache);

    function land($state, $log, $cordovaSplashscreen, $timeout) {
        //$state.go('app.landing').then(hideSplash);
        // TODO
        hideSplash();
        /////////////////////
        function hideSplash() {
            return $timeout(function () {
                $log.debug('Splashscreen hidden');
                $cordovaSplashscreen.hide();
            });
        }
    }

    function configureCordova() {

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(false);
        }

        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    }

    function setCustomLogs($rootScope, $log, stringify) {
        $rootScope.$on('$stateChangeStart', logViewName);

        function logViewName(event, toState, toParams) {
            $log.debug('Entering state ' + toState.name + ' with parameters: ' + stringify(toParams));
        }
    }

    function setHttpDefaultCache($log, $http, CacheFactory) {
        var options = {
            maxAge: 60 * 60 * 1000, // Items added to this cache expire after 1 hour
            deleteOnExpire: 'passive' // Cache will do nothing when an item expires.
            // Expired items will remain in the cache until requested, at which point they are removed, and undefined is returned.
        };

        $log.debug('Created a default cache for HTTP requests with properties:', options);

        $http.defaults.cache = new CacheFactory('defaultCache', options);
    }

})();