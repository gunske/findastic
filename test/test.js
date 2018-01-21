var assert = require('assert');

describe('findastic-lib', function() {

    const findastic = require('../lib');

    describe('add/export', function () {

        it('export empty index', function (done) {

            const dump = findastic.export();

            assert.notEqual(dump, null);
            assert.equal(typeof dump.index, 'object');
            assert.equal(typeof dump.phrases, 'object');

            done();

        });

        it('length', function (done) {

            var numberOfItems = findastic.length;
            assert.equal(numberOfItems, 0);
            done();

        });

        it('search on empty index', function (done) {

            findastic.search("dette liker vi heisann på deg", function (err, result) {

                assert.equal(err, null);
                assert.notEqual(result, null);
                assert.ok(Array.isArray(result));
                assert.equal(result.length, 0);

                done();
            });

        });

        it('add non-string phrase (throws)', function (done) {

            assert.throws(function () {
                findastic.add({hello: "world"}, null);
            }, /Phrase must be a string/, 'did not throw with expected message');

            done();

        });

        it('add undefined data (ok)', function (done) {

            findastic.add("heisann", undefined);

            const dump = findastic.export();

            assert.notEqual(dump, null);
            assert.equal(typeof dump.index, 'object');
            assert.equal(typeof dump.phrases, 'object');
            assert.equal(dump.phrases['1'], null);
            assert.equal(dump.index['hei']['heisann'], 1);

            done();

        });

        it('add object data (ok)', function (done) {

            findastic.add("heida", {a:'b'});

            const dump = findastic.export();

            assert.notEqual(dump, null);
            assert.equal(typeof dump.index, 'object');
            assert.equal(typeof dump.phrases, 'object');
            assert.equal(dump.phrases['2'].a, 'b');
            assert.equal(dump.index['hei']['heida'], 2);

            done();

        });

    });

    describe('import', function () {

        var firstDump;
        it('init import', function (done) {

            firstDump = findastic.export();
            done();

        });

        it('import data wrong type', function (done) {

            assert.throws(function () {
                findastic.import("hei");
            }, /Param data should be object/, 'did not throw with expected message');

            done();

        });

        it('import data (lacking index -> fail)', function (done) {

            assert.throws(function () {
                findastic.import({phrases: {}});
            }, /Param data.index should be object/, 'did not throw with expected message');

            done();

        });

        it('import data (lacking phrases -> fail)', function (done) {

            assert.throws(function () {
                findastic.import({index: {}});
            }, /Param data.phrases should be object/, 'did not throw with expected message');

            done();

        });

        it('reset data', function (done) {

            findastic.reset();
            const dump = findastic.export();

            assert.notEqual(dump, null);
            assert.equal(typeof dump.index, 'object');
            assert.equal(typeof dump.phrases, 'object');
            assert.equal(Object.keys(dump.phrases).length, 0);
            assert.equal(Object.keys(dump.index).length, 0);

            done();

        });

        it('import data', function (done) {

            findastic.import(firstDump);
            const dump = findastic.export();

            assert.notEqual(dump, null);
            assert.equal(typeof dump.index, 'object');
            assert.equal(typeof dump.phrases, 'object');
            assert.equal(dump.phrases['2'].a, 'b');
            assert.equal(dump.index['hei']['heida'], 2);

            done();

        });

    });

    describe('search', function () {

        it('init search', function (done) {

            findastic.reset();
            findastic.add("a", {a:'a'});
            findastic.add("ab", {a:'b'});
            findastic.add("abs", {a:'s'});
            findastic.add("abs ab", {a:'s2'});
            findastic.add("heisann", {a:'h'});
            findastic.add("heida", {a:'e'});
            findastic.add("GründeRe", {a:'g'});
            done();

        });

        it('length', function (done) {
            assert.equal(findastic.length, 6);
            done();

        });

        it('search wrong input (fail)', function (done) {

            findastic.search({hallo: "n"}, function(err, result) {

                assert.notEqual(err, null);
                done();

            });

        });

        it('search no results', function (done) {

            findastic.search("join absolute is king", function(err, result) {
                assert.equal(err, null);
                assert.notEqual(result, null);
                assert.ok(Array.isArray(result));
                assert.equal(result.length, 0);
                done();
            });

        });

        it('search abs', function (done) {

            findastic.search("join abs is king", function(err, result) {

                assert.equal(err, null);
                assert.notEqual(result, null);
                assert.equal(result[0].phrase, 'abs');
                assert.equal(result[0].position, 5);
                assert.equal(result[0].data.a, 's');
                done();

            });

        });

        it('search a', function (done) {

            findastic.search("join  is ab king", function(err, result) {

                assert.equal(err, null);
                assert.notEqual(result, null);
                assert.equal(result[0].phrase, 'ab');
                assert.equal(result[0].position, 9);
                assert.equal(result[0].data.a, 'b');
                done();

            });

        });

        it('search heisann er bra for heisann', function (done) {

            findastic.search("join heisann er bra for heida", function(err, result) {

                assert.equal(err, null);
                assert.notEqual(result, null);
                assert.equal(result[0].phrase, 'heisann');
                assert.equal(result[0].position, 5);
                assert.equal(result[0].data.a, 'h');
                assert.equal(result[1].phrase, 'heida');
                assert.equal(result[1].position, 24);
                assert.equal(result[1].data.a, 'e');
                done();

            });

        });

        it('searchOne heisann er bra for heisann', function (done) {

            findastic.searchOne("join heisann er bra for heida", function(err, result) {

                assert.equal(err, null);
                assert.notEqual(result, null);
                assert.equal(result.length, 1);
                assert.equal(result[0].phrase, 'heisann');
                assert.equal(result[0].position, 5);
                assert.equal(result[0].data.a, 'h');
                done();

            });

        });

        it('search GRUNDERE', function (done) {

            findastic.search("GRUNDERE", function(err, result) {

                assert.equal(err, null);
                assert.notEqual(result, null);
                assert.equal(result[0].phrase, 'grundere');
                assert.equal(result[0].position, 0);
                assert.equal(result[0].data.a, 'g');
                done();

            });

        });

        it('search two sentences', function (done) {

            findastic.search("dette liker abs.ab la oss abs ab her heisann idag", function(err, result) {

                assert.equal(err, null);
                assert.notEqual(result, null);
                assert.equal(result[0].phrase, 'abs');
                assert.equal(result[0].position, 12);
                assert.equal(result[0].data.a, 's');
                assert.equal(result[1].phrase, 'ab');
                assert.equal(result[1].position, 16);
                assert.equal(result[1].data.a, 'b');
                assert.equal(result[2].phrase, 'abs ab');
                assert.equal(result[2].position, 26);
                assert.equal(result[2].data.a, 's2');
                assert.equal(result[3].phrase, 'heisann');
                assert.equal(result[3].position, 37);
                assert.equal(result[3].data.a, 'h');
                done();

            });

        });

    });

    describe('promise', function () {

        it('init search', function (done) {

            findastic.reset();
            findastic.add("a", {a:'a'});
            findastic.add("ab", {a:'b'});
            findastic.add("abs", {a:'s'});
            findastic.add("abs ab", {a:'s2'});
            findastic.add("heisann", {a:'h'});
            findastic.add("heida", {a:'e'});
            findastic.add("GründeRe", {a:'g'});
            done();

        });

        it('search', function (done) {

            findastic.search("abs ab. ab").then(function(result) {

                assert.notEqual(result, null);
                assert.notEqual(result.length, 0);
                assert.equal(result.length, 2);
                assert.equal(result[0].phrase, 'abs ab');
                assert.equal(result[0].position, 0);
                assert.equal(result[0].data.a, 's2');
                done();

            }, function (err) {

                done(err);

            });

        });

        it('searchOne', function (done) {

            findastic.searchOne("abs ab. ab").then(function(result) {

                assert.notEqual(result, null);
                assert.notEqual(result.length, 0);
                assert.equal(result.length, 1);
                assert.equal(result[0].phrase, 'abs');
                assert.equal(result[0].position, 0);
                assert.equal(result[0].data.a, 's');
                done();

            }, function (err) {

                done(err);

            });

        });

        it('search should fail', function (done) {

            findastic.search([]).then(function(result) {

                done(new Error("Should fail"));

            }, function (err) {

                done();

            });

        });

    });
});
