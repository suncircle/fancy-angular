define(['fancyPlugin!app:fancy-frontend:widgets', 'fancyPlugin!fancyFrontendConfig'], function(fancyWidgetCore, config){
    var $ = fancyWidgetCore.$,
        widgetConfig = fancyWidgetCore.getWidgetConfig(),
        AngularCore = {
                    options: {
                        show_plugins_as_overlay: false
                    },
                    
                    apply: function(){
                        if (this.options.scope) {
                            var ret = this.options.scope.apply.apply(this, arguments);
                            if (this.updatedContent)this.updatedContent();
                            return ret;
                        }
                        return this._superApply(arguemtns);
                    },
                    
                    _create: function(){
                        var $element = this.element;
                        var $this = this;
                        
                        if (this.options.scope && this.options.scope.init) {
                            this.options.scope.init(this);
                        }
                        this._superApply( arguments );
/*
                        $this.scope = this.options.scope;
                        if (!this.scope.widgetView) {
                            this.scope.widgetView = this.scope.defaultWidgetView;
                        }
                        
                        if (this.scope.widgetView == 'list') {
                            var $content = $('<div></div>');
                            $content.attr('load-plugin', 'list');
                            $content.attr('plugin-template', 'false');
                            $content.attr('plugin-js', 'false');
                            $content.attr('plugin-css', 'false');
                            $content.attr('plugin-reference', this.scope.widgetType);
                            this.element.children().wrapAll($content);
                            this.apply($content);
                            //$content.attr('plugin-reference', 'list');
                            //this.element.children().remove();
                            //console.log($content);
                        }else{
                            $this.init_plugins();
                            // TODO: trigger event init_done
                        }
                        
                        */

                        
                    },
                    
                    get_widgetData: function(){
                        return this.scope['_' + this.scope.widgetType]
                    },

                    init_plugins: function(){
                        var $element = this.element;
                        var data = this.get_widgetData(),
                            attributeName = config.widgets.prefix + '-plugin';
                        var $this = this;
                        //console.log('init plugins with data ', data, 'and scope:', this.scope);

                        $element.find('[' + attributeName + ']:not([' + attributeName + '] [' + attributeName + '])').each(function(index, element){
                            var $plugin = $(element);
                            var pluginType = $plugin.attr(attributeName);
                            var pluginRef = null;
                            //console.log('found plugin ', pluginType);

                            if ($plugin.attr('plugin-reference')) {
                                pluginRef = $plugin.attr('plugin-reference').split('.');
                                pluginRef = pluginRef.length > 1 ? pluginRef[1] : pluginRef[0];
                            };
                            if (pluginRef) {
                                if (pluginRef && data === undefined) {
                                    var watchExpr = $this.scope.widgetType;
                                    var unregister = $this.scope.$watch('_'+watchExpr, function(newValue, oldValue){
                                        if (newValue === oldValue) {
                                            return
                                        }
                                        if (newValue && newValue[pluginRef] === undefined) {  // its being handled by other watch method
                                            $plugin.attr('load-plugin', pluginType);
                                            //console.log('load-plugin', $plugin.attr('load-plugin'), '(empty)');
                                            $this.apply($plugin);
                                        }
                                        unregister();
                                    });
                                }
                                var watchExpr = $this.scope.widgetType+'.'+pluginRef;
                                $this.scope.$watch('_'+watchExpr, function(newValue, oldValue){
                                    if (newValue === oldValue) {
                                        return
                                    }
                                    var widgetIdentifier = pluginType;
                                    var state = '(none)';
                                    /*if (newValue) {
                                        widgetIdentifier += ':'+newValue
                                        state = '(instance)';
                                    }*/
                                    $plugin.attr('load-plugin', widgetIdentifier);
                                    //console.log('load-plugin', $plugin.attr('load-plugin'), state);
                                    $this.apply($plugin);
    
                                });
                            }else{
                                $plugin.attr('load-plugin', pluginType);
                                //console.log('load-plugin', $plugin.attr('load-plugin'), '(standalone)');
                                $this.apply($plugin);
                            }
                            
                        })
                    }
        };

    fancyWidgetCore_widgets = fancyWidgetCore.derive('widget', {
        namespace: config.apps['fancy-angular'].namespace,
        name: 'widget',
        widget: $.extend({}, AngularCore, {
            initHeader: function(){
                var ret = this._superApply(arguments);
                var $sessionStatus = $('<div class="'+ config.frontend_generateClassName('auth-overlay') +'"><span load-plugin="fancy-frontend.auth?" action-icon="profile"></span></div>'),
                    $authInfo = $('<span>{{ auth.getProfile() }}</span>'),
                    $hostInfo = $('<span>{{ host.name }}</span>');
                $authInfo.attr('ng-show', '{{ showAuthStatus() }}');
                $hostInfo.attr('ng-show', '{{ showHostStatus() }}');
                $sessionStatus.attr('ng-show', '{{ showSessionStatus() }}');
                $sessionStatus.append($authInfo)
                $sessionStatus.append($hostInfo)
                this.apply($sessionStatus, function(content){this.$header.append(content);}.bind(this))
                
                return ret
            }
        })
    });
    fancyWidgetCore.derive('core', {
        namespace: config.apps['fancy-angular'].namespace,
        name: 'core',
        widget: {}
    })
    fancyWidgetCore.derive('complete', {
        namespace: config.apps['fancy-angular'].namespace,
        name: 'complete',
        widget: $.extend({}, AngularCore , {
            _create: function(){
                if (this.options.scope && this.options.scope.__type && typeof(this['init_' + this.options.scope.__type]) == 'function') {
                    this['init_' + this.options.scope.__type].apply(this, arguments)
                }
                AngularCore._create.apply(this, arguments);
            }
            // TODO: get from scope the widget Type and init it.
            
        })
    });
            //
            //$.widget( config.apps['fancy-angular'].namespace + '.widget',{
            //        options: {
            //        },
            //
            //        _create: function(){
            //            this.element.draggable({ snap: true });
            //        },
            //
            //        apply: function(){
            //            $scope.$apply()
            //        }
            //
            //});
    fancyWidgetCore.derive('plugin', {
        namespace: config.apps['fancy-angular'].namespace,
        name: 'plugin',
        widget: AngularCore
    });
    return fancyWidgetCore_widgets;
})
