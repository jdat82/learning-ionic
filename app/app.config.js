(function () {
    'use strict';

    angular
        .module('app')
        .config(appConfig)
        .config(routeConfig)
        .config(localStorageConfig)
        .config(ionicConfig)
        .config(httpInterceptors)
        .config(restConfig);

    function appConfig($compileProvider, env) {
        // Remove angular debug info in DOM when compiling for production
        $compileProvider.debugInfoEnabled(env === 'dev');
    }

    function routeConfig($stateProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router

        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'common/layout/layout.jade'
            })

            // Each tab has its own nav history stack:

            .state('tab.heroes', {
                url: '/heroes',
                views: {
                    'tab-heroes': {
                        templateUrl: 'heroes/tab-heroes.jade',
                        controller: 'HeroesController',
                        controllerAs: 'vm'
                    }
                }
            })

            .state('tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'chats/tab-chats.jade',
                        controller: 'ChatsController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('tab.chat-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: 'chats/chat-detail.jade',
                        controller: 'ChatDetailController',
                        controllerAs: 'vm'
                    }
                }
            })

            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'account/tab-account.jade',
                        controller: 'AccountController',
                        controllerAs: 'vm'
                    }
                }
            });

        console.debug('States defined');

    }

    // All keys in local storage will have the prefix 'lrnion'.
    function localStorageConfig(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('lrnion'); // learning-ionic
    }

    // Ionic defaults
    function ionicConfig($ionicConfigProvider) {
        // Default spinner
        $ionicConfigProvider.spinner.icon('dots');
    }

    // ! NOT USED FOR THE MOMENT !
    function httpInterceptors() {
        // $httpProvider.interceptors.push('throwExceptionOnHttpError');
    }

    // Restangular configuration
    function restConfig(RestangularProvider, apiEndpoint, apiKey, privateApiKey) {

        // Temporary hack: Restangular is not compatible with Lodash v4.
        _.contains = _.includes;

        // All xhr requests url will have this prefix
        RestangularProvider.setBaseUrl(apiEndpoint);

        // All xhr requests will contain the apikey parameter
        RestangularProvider.setDefaultRequestParams({apikey: apiKey});

        // Define which property in JSON responses contains the self link
        RestangularProvider.setRestangularFields({
            selfLink: 'resourceURI'
        });

        // I'm ashamed but marvel API thinks a cordova app which load the index page from a file:// url
        // is a server app and then it requires more query parameters. That's too bad because one of them
        // is the private key !!! So here I am adding it with courage forgetting about what I just did.
        if(window.location.origin === 'file://') {
            RestangularProvider.addFullRequestInterceptor(function (element, operation, model, url,
                                                                    headers, query) {
                query.ts = Date.now();
                query.hash = md5(query.ts + privateApiKey + apiKey);
            });
        }

        // What we need to do everytime we request marvel API
        RestangularProvider.addResponseInterceptor(function (data, operation) {
            var extractedData;
            // For getList operations
            if (operation === 'getList') {
                extractedData = data.data.results;
                extractedData.meta = _.pickBy(data.data, keepMetadata);
            }
            //else {
            //    extractedData = data.data;
            //}
            return extractedData;
        });

        ////////////

        function keepMetadata(key, value) {
            return value !== 'results';
        }

    }

})();

