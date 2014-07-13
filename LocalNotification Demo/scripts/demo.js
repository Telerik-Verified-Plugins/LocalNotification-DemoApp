(function (global) {
    var DemoViewModel,
        app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {
        if (window.plugin) {

            // set some global defaults for all local notifications
            window.plugin.notification.local.setDefaults({
                autoCancel : true // removes the notification from notification centre when clicked
            });
    
            // triggered when a notification was clicked outside the app (background)
            window.plugin.notification.local.onclick = function (id, state, json) {
                var message = 'ID: ' + id + (json == '' ? '' : '\nData: ' + json);
            };

            // triggered when a notification is executed while using the app (foreground)
            // on Android this may be triggered even when the app started by clicking a notification
            window.plugin.notification.local.ontrigger = function (id, state, json) {
                var message = 'ID: ' + id + (json == '' ? '' : '\nData: ' + json);
                navigator.notification.alert(message, null, 'Notification received while the app was in the foreground', 'Close');
            };
    
        };
    });

    DemoViewModel = kendo.data.ObservableObject.extend({

        showMessageWithoutSound: function () {
            this.notify({
                     id : 1,
                  title : 'I\'m the title!',
                message : 'Sssssh!',
                  sound : null,
                   date : this.getNowPlus10Seconds()
            });
        },

        showMessageWithDefaultSound: function () {
            this.notify({
                     id : '2', // you don't have to use an int by the way.. '1a' or just 'a' would be fine
                  title : 'Sorry for the noise',
                message : 'Unless you have sound turned off',
                   date : this.getNowPlus10Seconds()
            });
        },

        showMessageWithData: function () {
            this.notify({
                     id : 3,
                message : 'I have data, click me to see it',
                   json : JSON.stringify({ test: 123 }),
                   date : this.getNowPlus10Seconds()
            });
        },

        showMessageWithBadge: function () {
            this.notify({
                     id : 4,
                  title : 'Your app now has a badge',
                message : 'Clear it by clicking the \'Cancel all\' button',
                  badge : 1,
                   date : this.getNowPlus10Seconds()
            });
        },

        showMessageWithSoundEveryMinute: function () {
            this.notify({
                     id : 5,
                  title : 'I will bother you every minute',
                message : '.. until you cancel all notifications',
                 repeat : 'minutely',
             autoCancel : false,
                   date : this.getNowPlus10Seconds()
            });
        },

        cancelAll: function () {
            if (!this.checkSimulator()) {
                window.plugin.notification.local.cancelAll(function() {alert('ok, all cancelled')});
            }
        },
         
        getScheduledNotificationIDs: function () {
            if (!this.checkSimulator()) {
                window.plugin.notification.local.getScheduledIds(function (scheduledIds) {
                    navigator.notification.alert(scheduledIds.join(', '), null, 'Scheduled Notification ID\'s', 'Close');
                })
            }
        },
         
        notify: function (payload) {
            if (!this.checkSimulator()) {
                window.plugin.notification.local.add(payload, function(){alert('ok, scheduled')});
            }
        },

        getNowPlus10Seconds: function () {
            return new Date(new Date().getTime() + 10*1000);
        },

        checkSimulator: function() {
            if (window.plugin === undefined) {
                alert('Plugin not available. Are you running in the simulator?');
                return true;
            }
            return false;
        }
    });

    app.demoService = {
        viewModel: new DemoViewModel()
    };
})(window);