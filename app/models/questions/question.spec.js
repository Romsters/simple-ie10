﻿define(['models/questions/question', 'models/learningContent'], function (QuestionModel, LearningContentModel) {
    "use strict";

    var eventManager = require('eventManager'),
        eventDataBuilder = require('eventDataBuilders/questionEventDataBuilder'),
        http = require('plugins/http');

    describe('model [question]', function () {

        it('should be defined', function () {
            expect(QuestionModel).toBeDefined();
        });

        it('should return function', function () {
            expect(QuestionModel).toBeFunction();
        });

        var answers = [{
            id: '0',
            isCorrect: true,
            isChecked: false
        },
        {
            id: '1',
            isCorrect: false,
            isChecked: false
        }, {
            id: '2',
            isCorrect: true,
            isChecked: false
        },
        {
            id: '3',
            isCorrect: false,
            isChecked: false
        }];

        var spec = {
            id: 'id',
            objectiveId: 'objId',
            title: 'title',
            hasContent: false,
            score: 0,
            answers: answers,
            learningContents: [],
            hasCorrectFeedback: true,
            hasIncorrectFeedback: false
        };
        var question;

        beforeEach(function () {
            question = new QuestionModel(spec);
        });

        describe('id:', function () {
            it('should be defined', function () {
                expect(question.id).toBeDefined();
            });

            it('should be equal to spec id', function () {
                expect(question.id).toBe(spec.id);
            });
        });

        describe('title:', function () {
            it('should be defined', function () {
                expect(question.title).toBeDefined();
            });

            it('should be equal to spec title', function () {
                expect(question.title).toBe(spec.title);
            });
        });

        describe('hasContent:', function () {
            it('should be defined', function () {
                expect(question.hasContent).toBeDefined();
            });

            it('should be equal to spec hasContent', function () {
                expect(question.hasContent).toBe(spec.hasContent);
            });
        });

        describe('score:', function () {
            it('should be observable', function () {
                expect(question.score).toBeObservable();
            });

            it('should be equal to spec score', function () {
                expect(question.score()).toBe(spec.score);
            });
        });

        describe('learningContents:', function () {
            it('should be defined', function () {
                expect(question.learningContents).toBeDefined();
            });

            it('should be equal to spec learningContents', function () {
                expect(question.learningContents).toBe(spec.learningContents);
            });
        });

        describe('feedback:', function() {

            it('should be defined', function() {
                expect(question.feedback).toBeDefined();
            });

            describe('hasCorrect:', function () {

                it('should be defined', function() {
                    expect(question.feedback.hasCorrect).toBeDefined();
                });

                it('should be equal to spec hasCorrectFeedback', function () {
                    expect(question.feedback.hasCorrect).toBe(spec.hasCorrectFeedback);
                });

            });

            describe('correct:', function() {

                it('should be defined', function() {
                    expect(question.feedback.correct).toBeDefined();
                });

            });

            describe('hasIncorrect:', function () {

                it('should be defined', function () {
                    expect(question.feedback.hasIncorrect).toBeDefined();
                });

                it('should be equal to spec hasIncorrectFeedback', function () {
                    expect(question.feedback.hasIncorrect).toBe(spec.hasIncorrectFeedback);
                });

            });

            describe('incorrect:', function () {

                it('should be defined', function () {
                    expect(question.feedback.incorrect).toBeDefined();
                });

            });

        });

        describe('loadFeedback:', function () {

            it('should be function', function() {
                expect(question.loadFeedback).toBeFunction();
            });

            it('should return promise', function() {
                expect(question.loadFeedback()).toBePromise();
            });

            var httpDeferred = null;
            beforeEach(function () {
                httpDeferred = Q.defer();
                spyOn(http, 'get').andReturn(httpDeferred.promise);
            });

            describe('when correct feedback is not present', function() {

                beforeEach(function() {
                    question.feedback.hasCorrect = false;
                });

                it('should not load feedback content', function() {
                    var promise = question.loadFeedback();
                    httpDeferred.resolve();

                    waitsFor(function() {
                        return !promise.isPending();
                    });
                    runs(function() {
                        expect(http.get).not.toHaveBeenCalledWith('content/' + question.objectiveId + '/' + question.id + '/correctFeedback.html');
                    });
                });

            });

            describe('when correct feedback is present', function() {
                
                beforeEach(function () {
                    question.feedback.hasCorrect = true;
                });

                it('should load feedback content', function () {
                    var promise = question.loadFeedback();
                    httpDeferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(http.get).toHaveBeenCalledWith('content/' + question.objectiveId + '/' + question.id + '/correctFeedback.html');
                    });
                });

                describe('and when feedback content loaded', function() {

                    it('should set feedback.correct', function () {
                        question.feedback.correct = null;
                        var promise = question.loadFeedback();
                        httpDeferred.resolve('some correct feedback');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(question.feedback.correct).toBe('some correct feedback');
                        });
                    });

                });

            });

            describe('when incorrect feedback is not present', function () {

                beforeEach(function () {
                    question.feedback.hasIncorrect = false;
                });

                it('should not load feedback content', function () {
                    var promise = question.loadFeedback();
                    httpDeferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(http.get).not.toHaveBeenCalledWith('content/' + question.objectiveId + '/' + question.id + '/incorrectFeedback.html');
                    });
                });

            });

            describe('when incorrect feedback is present', function () {

                beforeEach(function () {
                    question.feedback.hasIncorrect = true;
                });

                it('should load feedback content', function () {
                    var promise = question.loadFeedback();
                    httpDeferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(http.get).toHaveBeenCalledWith('content/' + question.objectiveId + '/' + question.id + '/incorrectFeedback.html');
                    });
                });

                describe('and when feedback content loaded', function () {

                    it('should set feedback.incorrect', function () {
                        question.feedback.incorrect = null;
                        var promise = question.loadFeedback();
                        httpDeferred.resolve('some incorrect feedback');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(question.feedback.incorrect).toBe('some incorrect feedback');
                        });
                    });

                });

            });

        });

        describe('learningContentExperienced:', function () {
            var eventData = {};
            beforeEach(function () {
                spyOn(eventManager, 'learningContentExperienced');
                spyOn(eventDataBuilder, 'buildLearningContentExperiencedEventData').andReturn(eventData);
            });

            it('should be function', function () {
                expect(question.learningContentExperienced).toBeFunction();
            });

            it('should call event data builder buildLearningContentExperiencedEventData', function () {
                question.learningContentExperienced({});
                expect(eventDataBuilder.buildLearningContentExperiencedEventData).toHaveBeenCalled();
            });

            it('should call event manager learningContentExperienced', function () {
                question.learningContentExperienced({});
                expect(eventManager.learningContentExperienced).toHaveBeenCalledWith(eventData);
            });
        });

        describe('loadContent:', function () {
            var deferred = null;
            beforeEach(function () {
                deferred = Q.defer();
                spyOn(http, 'get').andReturn(deferred.promise);
            });

            it('should be function', function () {
                expect(question.loadContent).toBeFunction();
            });

            it('should return promise', function () {
                expect(question.loadContent({})).toBePromise();
            });

            describe('and when question does not have content', function () {
                beforeEach(function () {
                    question.hasContent = false;
                    question.content = undefined;
                });

                it('should resolve promise', function () {
                    var promise = question.loadContent();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolved();
                    });
                });

                it('should not load content', function () {
                    var promise = question.loadContent();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(http.get).not.toHaveBeenCalled();
                    });
                });

                it('should not change question content', function () {
                    var promise = question.loadContent();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(question.content).toBeUndefined();
                    });
                });
            });

            describe('and when question has content', function () {
                beforeEach(function () {
                    question.hasContent = true;
                });

                var content = 'content';

                it('should load content', function () {
                    var promise = question.loadContent();
                    deferred.resolve(content);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(http.get).toHaveBeenCalledWith('content/' + question.objectiveId + '/' + question.id + '/content.html');
                    });
                });

                describe('and when content loaded successfully', function () {

                    it('should set question content', function () {
                        var promise = question.loadContent();
                        deferred.resolve(content);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(question.content).toBe(content);
                        });
                    });

                    it('should resolve promise', function () {
                        var promise = question.loadContent();
                        deferred.resolve(content);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                        });
                    });

                });

                describe('and when failed to load content', function () {
                    it('should set error message to question content', function () {
                        var promise = question.loadContent();
                        deferred.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(question.content).toBe('');
                        });
                    });

                    it('should resolve promise', function () {
                        var promise = question.loadContent();
                        deferred.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                        });
                    });
                });

            });
        });

        describe('loadLearningContent:', function () {
            var getDeferred = null;
            beforeEach(function () {
                question.learningContents.splice(0, 2);
                question.learningContents.push(new LearningContentModel({ id: '0' }));
                question.learningContents.push(new LearningContentModel({ id: '1' }));

                getDeferred = Q.defer();
                spyOn(http, 'get').andReturn(getDeferred.promise);
                spyOn(Q, 'allSettled').andCallFake(function (requests) {
                    return Q.fcall(function () {
                        _.each(requests, function (request) {
                            request();
                        });
                    });
                });
            });

            it('should be function', function () {
                expect(question.loadLearningContent).toBeFunction();
            });

            it('should return promise', function () {
                expect(question.loadLearningContent()).toBePromise();
            });

            it('should load question learning content', function () {
                var promise = question.loadLearningContent();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(http.get).toHaveBeenCalledWith('content/' + question.objectiveId + '/' + question.id + '/' + question.learningContents[0].id + '.html');
                    expect(http.get).toHaveBeenCalledWith('content/' + question.objectiveId + '/' + question.id + '/' + question.learningContents[1].id + '.html');
                });
            });

            it('should set content for each learning content', function () {
                question.learningContents[0].content = null;
                question.learningContents[1].content = null;

                var promise = question.loadLearningContent();
                var content = 'content';
                getDeferred.resolve(content);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(question.learningContents[0].content).toBe(content);
                    expect(question.learningContents[1].content).toBe(content);
                });
            });

            describe('when content is already loaded for some learning contents', function () {
                beforeEach(function() {
                    question.learningContents[0].content = 'loaded content';
                    question.learningContents[1].content = null;
                });

                it('should load question learning content if unloaded', function () {

                    var promise = question.loadLearningContent();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(http.get).not.toHaveBeenCalledWith('content/' + question.objectiveId + '/' + question.id + '/' + question.learningContents[0].id + '.html');
                        expect(http.get).toHaveBeenCalledWith('content/' + question.objectiveId + '/' + question.id + '/' + question.learningContents[1].id + '.html');
                    });
                });

                it('should set content for unloaded learning content', function () {
                    var promise = question.loadLearningContent();
                    var content = 'content';
                    getDeferred.resolve(content);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(question.learningContents[0].content).not.toBe(content);
                        expect(question.learningContents[1].content).toBe(content);
                    });
                });
            });
        });

        describe('load:', function () {
            var loadContentDeferred = null;
            var loadLearningContentDeferred = null;
            var loadFeedbackContentDeferred = null;
            beforeEach(function () {
                loadContentDeferred = Q.defer();
                loadLearningContentDeferred = Q.defer();
                loadFeedbackContentDeferred = Q.defer();
                spyOn(question, 'loadContent').andReturn(loadContentDeferred.promise);
                spyOn(question, 'loadLearningContent').andReturn(loadLearningContentDeferred.promise);
                spyOn(question, 'loadFeedback').andReturn(loadFeedbackContentDeferred.promise);
            });

            it('should be function', function () {
                expect(question.load).toBeFunction();
            });

            it('should return promise', function () {
                expect(question.load()).toBePromise();
            });

            it('should call loadContent', function () {
                var promise = question.load();
                loadContentDeferred.resolve();
                loadLearningContentDeferred.resolve();
                loadFeedbackContentDeferred.resolve();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(question.loadContent).toHaveBeenCalled();
                });
            });

            describe('and when content loaded', function () {

                it('should call loadLearningContent', function () {
                    var promise = question.load();
                    loadContentDeferred.resolve();
                    loadLearningContentDeferred.resolve();
                    loadFeedbackContentDeferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(question.loadLearningContent).toHaveBeenCalled();
                    });
                });

                describe('and when learningContent loaded', function() {

                    it('should load feedback', function () {
                        var promise = question.load();
                        loadContentDeferred.resolve();
                        loadLearningContentDeferred.resolve();
                        loadFeedbackContentDeferred.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(question.loadFeedback).toHaveBeenCalled();
                        });
                    });

                });

            });

            describe('and when content has failed to load', function () {

                it('should not call loadLearningContent', function () {
                    var promise = question.load();
                    loadContentDeferred.reject();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(question.loadLearningContent).not.toHaveBeenCalled();
                    });
                });

            });

            xdescribe('and when question does not have content', function () {
                beforeEach(function () {
                    question.hasContent = false;
                    question.content = undefined;
                });

                it('should resolve promise', function () {
                    var promise = question.loadContent();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolved();
                    });
                });

                it('should not load content', function () {
                    var promise = question.loadContent();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(http.get).not.toHaveBeenCalled();
                    });
                });

                it('should not change question content', function () {
                    var promise = question.loadContent();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(question.content).toBeUndefined();
                    });
                });
            });

            xdescribe('and when question has content', function () {
                beforeEach(function () {
                    question.hasContent = true;
                });

                var content = 'content';

                it('should load content', function () {
                    var promise = question.loadContent();
                    deferred.resolve(content);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(http.get).toHaveBeenCalledWith('content/' + question.objectiveId + '/' + question.id + '/content.html');
                    });
                });

                describe('and when content loaded successfully', function () {

                    it('should set question content', function () {
                        var promise = question.loadContent();
                        deferred.resolve(content);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(question.content).toBe(content);
                        });
                    });

                    it('should resolve promise', function () {
                        var promise = question.loadContent();
                        deferred.resolve(content);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                        });
                    });

                });

                describe('and when failed to load content', function () {
                    it('should set error message to question content', function () {
                        var promise = question.loadContent();
                        deferred.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(question.content).toBe('');
                        });
                    });

                    it('should resolve promise', function () {
                        var promise = question.loadContent();
                        deferred.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                        });
                    });
                });

            });
        });
    });
});