/*
 * testTSResourceFileType.js - test the HTML template file type handler object.
 *
 * Copyright (c) 2020-2021, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if (!TSResourceFileType) {
    var TSResourceFileType = require("../TSResourceFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"]
});

module.exports.tsresourcefiletype = {
    testTSResourceFileTypeConstructor: function(test) {
        test.expect(1);

        var tsft =new TSResourceFileType(p);
        test.ok(tsft);
        test.done();
    },
    testTSResourceFileGetName: function(test) {
        test.expect(2);

        var tsft =new TSResourceFileType(p);
        test.ok(tsft);
        test.equal(tsft.name(), 'TS Resource File');
        test.done();
    },
    testTSResourceFileGetDataType: function(test) {
        test.expect(2);

        var tsft =new TSResourceFileType(p);
        test.ok(tsft);
        test.equal(tsft.getDataType(), 'ts');
        test.done();
    },
    testTSResourceFileGetExtensions: function(test) {
        test.expect(2);

        var tsft =new TSResourceFileType(p);
        test.ok(tsft);

        test.equal(tsft.getExtensions(),'.ts');
        test.done();
    },

    testTSResourceFileTypeHandlesTS: function(test) {
        test.expect(2);

        var tsft =new TSResourceFileType(p);
        test.ok(tsft);
        test.ok(!tsft.handles("foo.ts"));
        test.done();
    },

    testTSResourceFileTypeHandlesActualJSResFile: function(test) {
        test.expect(2);

        var tsft =new TSResourceFileType(p);
        test.ok(tsft);
        test.ok(!tsft.handles("localized_js/de-DE.js"));
        test.done();
    },

    testTSResourceFileTypeGetResourceFile: function(test) {
        test.expect(2);

        var tsft =new TSResourceFileType(p);
        test.ok(tsft);

        var jsrf = tsft.getResourceFile("fr-FR");
        test.equal(jsrf.getLocale(), "fr-FR");
        test.done();
    },

    testTSResourceFileTypeGetResourceFileSameOneEachTime: function(test) {
        test.expect(4);

        var tsft =new TSResourceFileType(p);
        test.ok(tsft);

        var jsrf1 = tsft.getResourceFile("fr-FR");
        test.equal(jsrf1.getLocale(), "fr-FR");

        var jsrf2 = tsft.getResourceFile("fr-FR");
        test.equal(jsrf2.getLocale(), "fr-FR");

        test.deepEqual(jsrf1, jsrf2);
        test.done();
    }
};