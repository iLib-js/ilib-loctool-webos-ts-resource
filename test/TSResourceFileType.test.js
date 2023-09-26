/*
 * TSResourceFileType.test.js - test the HTML template file type handler object.
 *
 * Copyright (c) 2020-2021, 2023 JEDLSoft
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

describe("tsresourcefiletype", function() {
    test("TSResourceFileTypeConstructor", function() {
        expect.assertions(1);

        var tsft =new TSResourceFileType(p);
        expect(tsft).toBeTruthy();
    });
    test("TSResourceFileGetName", function() {
        expect.assertions(2);

        var tsft =new TSResourceFileType(p);
        expect(tsft).toBeTruthy();
        expect(tsft.name()).toBe('TS Resource File');
    });
    test("TSResourceFileGetDataType", function() {
        expect.assertions(2);

        var tsft =new TSResourceFileType(p);
        expect(tsft).toBeTruthy();
        expect(tsft.getDataType()).toBe('ts');
    });
    test("TSResourceFileGetExtensions", function() {
        expect.assertions(2);

        var tsft =new TSResourceFileType(p);
        expect(tsft).toBeTruthy();

        expect(tsft.getExtensions()[0]).toBe('.ts');
    });
    test("TSResourceFileTypeHandlesTS", function() {
        expect.assertions(2);

        var tsft =new TSResourceFileType(p);
        expect(tsft).toBeTruthy();
        expect(!tsft.handles("foo.ts")).toBeTruthy();
    });
    test("TSResourceFileTypeHandlesActualJSResFile", function() {
        expect.assertions(2);

        var tsft =new TSResourceFileType(p);
        expect(tsft).toBeTruthy();
        expect(!tsft.handles("localized_js/de-DE.js")).toBeTruthy();
    });
    test("TSResourceFileTypeGetResourceFile", function() {
        expect.assertions(2);

        var tsft =new TSResourceFileType(p);
        expect(tsft).toBeTruthy();

        var jsrf = tsft.getResourceFile("fr-FR");
        expect(jsrf.getLocale().getSpec()).toBe("fr-FR");
    });
    test("TSResourceFileTypeGetResourceFileSameOneEachTime", function() {
        expect.assertions(4);

        var tsft =new TSResourceFileType(p);
        expect(tsft).toBeTruthy();

        var jsrf1 = tsft.getResourceFile("fr-FR");
        expect(jsrf1.getLocale().getSpec()).toBe("fr-FR");

        var jsrf2 = tsft.getResourceFile("fr-FR");
        expect(jsrf2.getLocale().getSpec()).toBe("fr-FR");

        expect(jsrf1).toStrictEqual(jsrf2);
    });
});