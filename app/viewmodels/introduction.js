﻿define(['durandal/app', 'context', 'plugins/router', 'plugins/http'],
    function (app, context, router, http) {

        var courseTitle = null,
            content = null,

            canActivate = function () {
                if (context.course.hasIntroductionContent == false) {
                    return { redirect: '#objectives' };
                }
                return true;
            },

            activate = function () {
                this.courseTitle = "\"" + context.course.title + "\"";

                var that = this;
                return Q.fcall(function () {
                    return http.get('content/content.html').then(function (response) {
                        that.content = response;
                    }).fail(function () {
                        that.content = '';
                    }).always(function () {
                        app.trigger('user:set-progress-clear');
                    });
                });

            },

            startCourse = function () {
                router.navigate('objectives');
            };

        return {
            courseTitle: courseTitle,
            content: content,

            startCourse: startCourse,
            canActivate: canActivate,
            activate: activate
        };
    }
);