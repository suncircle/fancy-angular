define(['jquery', 'introspective-api-resources', 'introspective-api-log', 'json'], function ($, apiResources, _log, JSON) {

    var superGetNew = apiResources.Result.prototype.getNew;
    apiResources.Result.prototype.getNew = function(name){
        var ret = superGetNew.apply(this, arguments);
        if (this.getSettings() && this.getSettings().source) {
            var source = this.getSettings().source;
            if (source.options && source.options.scope && source.options.scope._initAttrBindings) {
                source.options.scope._initAttrBindings(ret);
            }
        }
        return ret
    }
    
    return apiResources;
});