//define(['fancyPlugin!jquery', 'fancyPlugin!fancyFrontendCore'], function($, core){
//    function FrontendCore() {
//        this.init.apply(this, arguments);
//    }
//
//    /* prototype extension */
//    $.extend(FrontendCore.prototype, core.prototype);
//    $.extend(FrontendCore.prototype,
define(['fancyPlugin!widget:fancy-frontend:frontend'], function(fancyWidgetConfig_frontend){
    var $ = fancyWidgetConfig_frontend.$,
        config = fancyWidgetConfig_frontend.getFrontendConfig(),
        widgetConfig = fancyWidgetConfig_frontend.getWidgetConfig();

    frontend = fancyWidgetConfig_frontend.derive({
        namespace: config.apps['fancy-frontend'].namespace,
        name: 'frontend',
        widget: {
            validate_app: function(){
                    var widgetSelector = this.config.selector;
                    if ($(widgetSelector).size() == 0){
                        console.warn('no element with '+widgetSelector+' found.');
                        return false;
                    }else if ($(widgetSelector).size()>1) {
                        console.error('this app currently supports only one active widget with  ' +
                                widgetSelector)
                        return false;
                    }
                return true;
            },
            prepare_app: function(){
                var $this = this,
                    config = {
                        "defaults": {
                            angularRoute: 'fancyPlugin!lib:angular/angular-route',
                            angularAnimate: 'fancyPlugin!lib:angular/angular-animate',
                            angularMocks: 'fancyPlugin!lib:angular/angular-mocks',
                            angularTranslate: 'fancyPlugin!lib:angular/translate/v2/translate',
                            angularTranslateService: 'fancyPlugin!lib:angular/translate/v2/service/translate',
                            angularTranslateServiceInterpolation: 'fancyPlugin!lib:angular/translate/v2/service/default-interpolation',
                            angularTranslateServiceLog: 'fancyPlugin!lib:angular/translate/v2/service/handler-log',
                            angularTranslateServiceStorage: 'fancyPlugin!lib:angular/translate/v2/service/storage-key',
                            angularTranslateFilter: 'fancyPlugin!lib:angular/translate/v2/filter/translate',
                            angularTranslateDirective: 'fancyPlugin!lib:angular/translate/v2/directive/translate',
                            angularTranslateStaticsLoader: 'fancyPlugin!app:fancy-angular:plugins/angular-partial-locales-loader',
                            angular: "fancyPlugin!lib:angular/angular",
                            cookie: "fancyPlugin!lib:jquery/jquery.cookie",
        
                            appConfig: 'fancyPlugin!app:fancy-angular:config',
                            filters: 'fancyPlugin!app:fancy-angular:filters',
                            services: 'fancyPlugin!app:fancy-angular:services',
                            directives: 'fancyPlugin!app:fancy-angular:directives',
                            controllers: 'fancyPlugin!app:fancy-angular:controllers',
                            routes: 'fancyPlugin!app:fancy-angular:routes',
        
                            currentApp: 'fancyPlugin!app:fancy-angular:sample_app',
                            "locale-global": 'fancyPlugin!locale:fancy-angular:locale.global',
                        },
                        shim: {
                            'angular' : {
                                'exports' : 'angular'
                            },
                            'angularRoute': ['fancyPlugin!angular'],
                            'angularTranslate': ['fancyPlugin!angular'],
                            'angularTranslateServiceInterpolation': ['fancyPlugin!angularTranslate'],
                            'angularTranslateServiceLog': ['fancyPlugin!angularTranslate'],
                            'angularTranslateServiceStorage': ['fancyPlugin!angularTranslate'],
                            'angularTranslateService': [
                                'fancyPlugin!angularTranslate',
                                'fancyPlugin!angularTranslateServiceInterpolation',
                                'fancyPlugin!angularTranslateServiceLog',
                                'fancyPlugin!angularTranslateStaticsLoader',
                                'fancyPlugin!angularTranslateServiceStorage'
                            ],
                            'angularTranslateFilter': ['fancyPlugin!angularTranslate'],
                            'angularTranslateDirective': ['fancyPlugin!angularTranslate'],
                            'angularAnimate': ['fancyPlugin!angular'],
                            'angularMocks': {
                                deps: ['fancyPlugin!angular'],
                                'exports': 'angular.mock'
                            }
                        },
                        priority: [
                            "fancyPlugin!angular",
                            "fancyPlugin!jquery",
                            "fancyPlugin!angularTranslate",
                        ],
                        config: {}
                    }
                /*config.config[this.config.appName] = {
                    'currentApp': this.config.appName,
                    'htmlUrl': this.config.htmlUrl || '',
                    'localesUrl': this.config.localesUrl || ''
                }*/
                
                require.config(config);
                
                var frontendCore, $this = frontendCore = this;
                
                if (true) {
                    // TODO: window.name != "NG_DEFER_BOOTSTRAP!" doesnt work, window name seems to stay on reload
                    //http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
                    window.name = "NG_DEFER_BOOTSTRAP!";
                    var config = this.config;
                    require( [
                        'fancyPlugin!jquery',
                        'fancyPlugin!angular',
                        'fancyPlugin!currentApp',
                        'fancyPlugin!fancyScopeCore',
                        'fancyPlugin!appConfig',
                        'fancyPlugin!routes',
                    ], function($, angular, app, scopeCore){
                        'use strict';
                                
                        $(config.selector).each(function(index, element){
                                $(element).attr('ng-keydown', '_ctrlModeActive = $event.altKey');
                                $(element).attr('ng-keyup', '_ctrlModeActive = $event.altKey');
                                $(element).attr('ng-class', '_ctrlModeActive ? "'+frontendCore.config.appName+'-interaction-reveal" : ""');
                                angular.bootstrap(element, [app['name']]);
                                app.run(function($injector, $rootScope) {
                                    $rootScope.auth = frontendCore.option('auth');
                                    $rootScope.host = frontendCore.get_host();
                                    $rootScope.frontend = frontendCore;
                                    scopeCore.prepareRoot($injector, $rootScope, widgetConfig);

                                    frontendCore.option('scope', $rootScope);
                                });
                                angular.module('config').constant('frontendCore', frontendCore);
                                
                                // TODO: this isnt usefull:
                                if (!frontendCore.$root_element) frontendCore.$root_element = element;
                        });
        
                        angular.resumeBootstrap();
                        frontendCore.perform_init();
                    });
                }else{
                    rontendCore.perform_init();
                }
                
                
                
                var debug_requesting = false;
                var debug_requested = false;
                $(window).keydown(function(event){
                    if (event.which == 68 && event.shiftKey && event.altKey && !debug_requesting) {
                        debug_requested = true;
                        debug_requesting = true;
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        return false
                    }
                    return true
                })
                $(window).keyup(function(event){
                    if (event.which == 68 && debug_requesting) {
                        if (debug_requested) {
                            var $widget = $('<div></div>');
                            $this.create_widget($widget, 'fancyOS.debug', {use_os: true, closable: true, draggable: true});  
                            $this.appendElement($widget)
                            event.preventDefault();
                            event.stopImmediatePropagation();
                            debug_requested = false;
                        }
                        debug_requesting = false;
                        return false
                    }
                    return true
                })
                $(window).click(function(event){
                    if (debug_requested) {
                        var $widget = $('<div></div>');
                        $this.create_widget($widget, 'fancyOS.debug', {use_os: true, closable: true, draggable: true, target:event.target});  
                        $this.appendElement($widget)
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        debug_requested = false;
                        return false
                    }
                    return true
                })
            },
            scan: function(){
                // nothing. scan is done via angularJS
            },
            _init_app: function(){
                var selector = this.config.selector;
                var appName = this.config.appName;
                var namespace = this.config.widgets.namespace;

                $(selector).each(function(index, element){
                    var $widget = $(element);
                    var widgetName = $widget.attr('load-'+appName);
                    //$widget.html('<div class="'+appName+'-loading"></div>');
                    
                    //$this.create_widget($widget, namespace+'.'+widgetName)
                    $widget.attr('load-widget', widgetName.indexOf('.') == 0 ? namespace+'.'+widgetName : widgetName);
                    $widget.attr('load-'+appName, null);
                    this.options.scope.apply($widget, undefined, true);
                }.bind(this))
            },
    
    
            // api endpoints
            data: null,
            me: null,
            content: null,
    
            setCredentials: function(response) {
                    var accessId = response.accessId;
                    var accessSecret = response.accessSecret;
                    var accessAlgorithm = response.accessAlgorithm;
    
                    this.data.setCredentials(
                        accessId,
                        accessSecret
                    );
                    this.data.setAlgorithm(
                        accessAlgorithm
                    );
                    this.me.setCredentials(
                        accessId,
                        accessSecret
                    );
                    this.me.setAlgorithm(
                        accessAlgorithm
                    );
                    this.content.setCredentials(
                        accessId,
                        accessSecret
                    );
                    this.content.setAlgorithm(
                        accessAlgorithm
                    );
    
            },
    
    
            _load_widget: function ($widget, response, widget_name, js, scope) {
                var options = this.get_options($widget[0]);
                if (($widget[0].nodeName == 'svg')){// && $widget.hasClass(config.frontend_generateClassName('action')))) {
                    var $new = $('<div></div>'),
                        $header = $('<header></header>').addClass(config.frontend_generateClassName('header'));
                        $new.append($header);

                    $new.attr('load-widget', $widget.attr('load-widget') || widget_name);
                    $widget.wrap($new);
                    $widget.attr('load-widget', undefined)
                    $widget = $widget.closest('div[load-widget]');
                }
                if (widget_name === undefined) {
                    widget_name = $widget.attr('load-widget');
                }
                if (widget_name.search(':') != -1) {
                    widget_name = widget_name.split(':')[0]
                }
                
                $widget.attr('data-' + this.config.prefix + '-widget-name', widget_name); // .slice(widget_name.search('>')+1)
    
                if (($widget[0] == this.$root_element) && !this.__scope) {
                    this.setScope(scope);
                }
                options['frontend'] = this;
                options['scope'] = scope;
                if (options['content'] || response) {
                    options['content'] = options['content'] || response;
                }
                
                options['activeView'] =  scope.__defaultWidgetView;
    
                if ($widget.data('__initialized')){
                    js('options', options)
                }else{
                    if (!js) {
                        return false
                    }
                    js(options, $widget)
                }
                scope.$apply();
                scope.$emit('applied');
    
            },
            
            load_dependencies: function(settings){
                for (var key in settings.templates){
                    var template = 'fancyPlugin!template:' + (settings.templates[key]+':'+settings.templates[key]);
                    settings.scope.__required.push(template);
                    require([template], function(response){
                        if (settings.callback){
                            settings.callback('template', settings.templates[key], response);
                        }
                        settings.scope.$apply();
                        settings.scope.$emit('applied');
                    });
                }
                for (var key in settings.locales){
                    settings.scope.addLocale(settings.locales[key]);
                    //if (promise.required) settings.scope.__required.push(promise.required);
                    // TODO: enable tracking of required locales
                    if (settings.callback){settings.callback('locale', settings.locales[key])};
                    
                }
                for (var key in settings.css){
                    // TODO: test if file is not loaded with core.css
                    var css = 'fancyPlugin!css:' + (settings.css[key]);
                    settings.scope.__required.push(css);
                    require([css], function(response){
                        if (settings.callback){
                            settings.callback('css', settings.css[key], response);
                        }
                    });
                }
                for (var key in settings.fixtures){
                    settings.scope.loadFixture(settings.fixtures[key]);
                    var fixture = 'fancyPlugin!fixture:' + (settings.fixtures[key]+':'+settings.fixtures[key]);
                    settings.scope.__required.push(fixture);
                    require([fixture, 'fancyPlugin!angular', 'fancyPlugin!currentApp', 'fancyPlugin!services'], function(fixture, angular, app){
                        settings.scope.log.event('loaded fixture', settings.fixtures[key], fixture)
                        settings.scope.addFixture(settings.fixtures[key], fixture)
                        settings.scope.$apply();
                        settings.scope.$emit('applied');
                        if (settings.callback){
                            settings.callback('fixture', settings.fixtures[key], fixture);
                        }
                    });
                }
            }
        }
    });
    return frontend
})