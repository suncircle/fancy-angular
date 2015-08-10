define(['fancyPlugin!angular','fancyPlugin!introspective-api-resources'], function (angular, apiResources) {
	'use strict';

  /* Services */

  // Demonstrate how to register services
  // In this case it is a simple value service.
	return angular.module('services', ['config'])
		.value('version', '0.1')
        .provider('$ApiProvider', ['frontendCore', function(frontendCore) {
    // In the provider function, you cannot inject any
    // service or factory. This can only be done at the
    // "$get" method.

    this.stage = 'productive';

    this.$get = function($q) {
        var stage = this.stage;
        return {
            getDefaultConnection: function(){
                return frontendCore.get_host()
            },
            getConnection: function(identifier){
                return frontendCore.get_host(identifier)
            },
            get: function(x, y , z){
                var ajax = getDefaultConnection().ajax
                return ajax.access.apply(ajax, arguments)
            },
            _get: function(settings) {
                var type = settings.target,
                    selector = settings.data;
                if (stage == 'fixtures') {
                    var src = type;
                    var deferred = $q.defer();
                    require(['fancyPlugin!fixture:'+ src +':'+ src], function(result){
                        var data = null;
                        if (typeof selector == "number") {
                          for (var i=0;i<result.length;i++) {
                              if (result[i].id == selector) {
                                  data = result[i];
                                  break;
                              }
                          }
                        }else if (selector.length != undefined){
                          data = result;/*
                          for (var i=0;i<result.length;i++) {
                              if (selector.indexOf(result[i]) < 0) {
                                  data.slice(data.indexOf(result[i]));
                              }
                          }
                          console.log('l',data);*/ // TODO: filter
                        }else{
                            data = result;
                        }
                        deferred.resolve(data);
                      }, function() {
                        deferred.reject();
                    });
                    return deferred.promise
                }else{// frontendCore.endpoint
                    if (!settings.apiClient) {
                        //settings.apiClient = this.getDefaultConnection().ajax;
                    }
                    
                    return this.getDefaultConnection().ajax.access('object').get(settings); //new apiResources.Object(settings)
                }
            },
            blank: function(settings){
                if (!settings.apiClient) {
                    settings.apiClient = this.getDefaultConnection().ajax;
                }
                return this.getDefaultConnection().ajax.blank(settings); //new apiResources.Placeholder(settings)
            },
            getAuth: function(frontendCore, parentAuth){
                if (parentAuth) {
                    return parentAuth.asProxy()
                }
                return frontendCore.getAuth().asProxy()
            }
        }
    };

    this.setStage = function(stage) {
        this.stage = stage;
    };
}]);
});
