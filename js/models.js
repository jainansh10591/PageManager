fb.models.Person = Backbone.Model.extend({
    defaults: {
        "name":     "",
        "id":       ""
    }
});

fb.models.PersonCollection = Backbone.Collection.extend({

    model: fb.models.Person

});