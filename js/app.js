var fb = new Application();

fb.Router = Backbone.Router.extend({

    routes: {
        "":                         "welcome",
        "me":                       "me",
        "person/:id":               "person",
        "person/:id/accounts":      "accounts",
        "revoke":                   "revoke",
        "post":                     "post",
        "postui":                   "postui"
    },

    initialize: function() {
        // Caching the Welcome View
        this.welcomeView = new fb.views.Welcome({model: fb.user});
    },

    welcome: function () {
        $('#content').html(this.welcomeView.el);
    },

    me: function () {
        this.person('me');
    },

    person: function (id) {
        var self = this;
        $('#content').html('<div class="breadcrumb api">FB.api("/' + id + '");</div>');
        try {
            FB.api("/" + id, function (response) {
                if (response.error) {
                    self.showErrorPage();
                } else {
                    console.log(response);
                    $('#content').append(new fb.views.Person({model: new fb.models.Person(response)}).el);
                }
            });
        } catch (e) {
            this.showErrorPage();
        }
    },

    // to fetch information about owned pages
    accounts: function (id) {
        var self = this;
        $('#content').html('<div class="breadcrumb api">FB.api("/' + id + '/accounts");</div>');
        try {
            FB.api("/" + id + "/accounts",{"access_token":"CAACEdEose0cBAEwsfgPHZCs094TVRHajlDAYarDZBZATMRjkpBRn7bnRKAmbKxEZC1oUpgI0t3Xra9yU5Hgwkjo5GOAgZBgLBj3tzPUwyATJZAYYhLXkOU6ZCIN3ZAikwht7hdtl9V4NEatMZAyeMJsBZCqjTXOiAMZAJYsihR6RfxrwSZBZBWZBlZC1XFPmqjbwkZB2mTZAHpqvyEDMkb0U0GP8CDDbL"}, function (response) {
                console.log("/accounts");
                console.log(response);
                if (response.error) {
                    self.showErrorPage();
                } else {
                    $('#content').append(new fb.views.Accounts({model: new Backbone.Model(response)}).el);
                }
            });
        } catch (e) {
            this.showErrorPage();
        }
    },

    post: function () {
        $('#content').html('<div class="breadcrumb api">FB.api("/me/feed", "post", data);</div>');
        $('#content').append(new fb.views.Post().el);
    },

    postui: function () {
        $('#content').html('<div class="breadcrumb api">FB.ui();</div>');
        $('#content').append(new fb.views.PostUI().el);
    },

    revoke: function () {
        $('#content').html('<div class="breadcrumb api">FB.api("/me/permissions", "delete");</div>');
        $('#content').append(new fb.views.Revoke().el);
    },

    showErrorPage: function () {
        $('#content').append(new fb.views.Error().el);
    }

});

$(document).on('ready', function() {
    fb.user = new fb.models.Person(); // Holds the authenticated Facebook user
    // Load HTML templates for the app
    fb.templateLoader.load(['shell', 'welcome', 'login', 'person', 'accounts', 'post', 'postui', 'error', 'revoke'], function () {
        fb.shell = new fb.views.Shell({el: "#shell", model: fb.user});
        fb.router = new fb.Router();
        Backbone.history.start();
    });
});

$(document).on('fbStatusChange', function (event, data) {
    if (data.status === 'connected') {
        FB.api('/me', function (response) {
            fb.user.set(response); // Store the newly authenticated FB user
        });
    } else {
        fb.user.set(fb.user.defaults); // Reset current FB user
    }
});

$(document).on('logout', function (req, res) {
    FB.logout();
    res.redirect("/");
    return false;
});

$(document).on('login', function () {
    FB.login(function(response) {
    }, {scope: 'publish_actions'});
    return false;
});