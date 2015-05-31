(function (global) {
    var DemoViewModel,
        app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {
        if (cordova.plugins) {

            // set some global defaults for all local notifications
            cordova.plugins.notification.local.setDefaults({
                ongoing : false, // see http://developer.android.com/reference/android/support/v4/app/NotificationCompat.Builder.html#setOngoing(boolean)
								autoClear: true
            });
    
					 	cordova.plugins.notification.local.on("click", function (notification ) {
                navigator.notification.alert(JSON.stringify(notification), null, 'Notification background click', 'Close');
            });

	          cordova.plugins.notification.local.on("schedule", function (id, state, json) {
                navigator.notification.alert("Scheduled", null, 'Notification scheduled', 'Close');
            });

           	// On iOS this event doesn't fire when the app is coldstarted, use "click" above instead in that case
	          cordova.plugins.notification.local.on("trigger", function (notification, state) {
                var message = 'Notification with ID is triggered: ' + notification.id + ' state: ' + state;
								navigator.notification.alert(message, function() { // callback invoked when the alert dialog is dismissed
                  // if the app started without clicking the notification, it can be cleared like this:
				    			cordova.plugins.notification.local.clear(notification.id, function() {
						        navigator.notification.alert("Notification cleared from notification center");
					    		}, 'Notification triggered', 'Close');
								});
						});
        };
    });

    DemoViewModel = kendo.data.ObservableObject.extend({

        showMessageWithoutSound: function () {
            this.notify({
                     id : 1,
                  title : 'I\'m the title!',
                   text : 'Sssssh!',
                  sound : null,
                     at : this.getNowPlus10Seconds()
            });
        },

        showMessageWithDefaultSound: function () {
            this.notify({
                     id : '2', // you don't have to use an int by the way.. '1a' or just 'a' would be fine
                  title : 'Sorry for the noise',
                   text : 'Unless you have sound turned off',
                     at : this.getNowPlus10Seconds()
            });
        },

        showMessageWithData: function () {
            this.notify({
                     id : 3,
                   text : 'I have data, click me to see it',
                   json : JSON.stringify({ test: 123 }),
                     at : this.getNowPlus10Seconds()
            });
        },

        showMessageWithBadge: function () {
            this.notify({
                     id : 4,
                  title : 'Your app now has a badge',
                   text : 'Clear it by clicking the \'Cancel all\' button',
                  badge : 1,
                     at : this.getNowPlus10Seconds()
            });
        },

        showMessageWithSoundEveryMinute: function () {
            this.notify({
                     id : 5,
                  title : 'I will bother you every minute',
                   text : '.. until you cancel all notifications',
                  every : 'minute',
              autoClear : false,
                     at : this.getNowPlus10Seconds()
            });
        },

        cancelAll: function () {
            if (!this.checkSimulator()) {
                cordova.plugins.notification.local.cancelAll(function() {alert('ok, all cancelled')});
            }
        },
         
        getScheduledNotificationIDs: function () {
            if (!this.checkSimulator()) {
                cordova.plugins.notification.local.getScheduledIds(function (scheduledIds) {
                    navigator.notification.alert(scheduledIds.join(', '), null, 'Scheduled Notification ID\'s', 'Close');
                })
            }
        },
         
        notify: function (payload) {
            if (!this.checkSimulator()) {
                cordova.plugins.notification.local.schedule(payload, function(){console.log('scheduled')});
            }
        },

        getNowPlus10Seconds: function () {
            return new Date(new Date().getTime() + 10*1000);
        },

        checkSimulator: function() {
            if (window.navigator.simulator === true) {
                alert('This plugin is not available in the simulator.');
                return true;
            } else if (cordova.plugins === undefined || cordova.plugins.notification === undefined) {
                alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
                return true;
            } else {
                return false;
            }
        }
    });

    app.demoService = {
        viewModel: new DemoViewModel()
    };
})(window);