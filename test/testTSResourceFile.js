/*
 * testTSResourceFile.js - test the ts file handler object.
 *
 * Copyright © 2020, JEDLSoft
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

if (!TSResourceFile) {
    var TSResourceFile = require("../TSResourceFile.js");
    var CustomProject = require("loctool/lib/CustomProject.js");
}

function diff(a, b) {
    var min = Math.min(a.length, b.length);

    for (var i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    }
}

var p = new CustomProject({
    id: "webOSQML",
    projectType: "webos-qml",
    sourceLocale: "en-US",
    resourceDirs: {
        "json": "localized_json"
        }
    }, "./testfiles", {
        locales:["en-GB"]
    });

var p2 = new CustomProject({
    id: "webOSQML",
    projectType: "webos-qml",
    sourceLocale: "en-US",
    resourceDirs: {
        "json": "localized_json"
        }
    }, "./testfiles", {
    locales:["en-GB", "de-DE", "de-AT"],
    identify: true
});

module.exports.tsresourcefile = {
    testTSResourceFileConstructor: function(test) {
        test.expect(1);

        var tsrf = new TSResourceFile({
            project: p
        });
        test.ok(tsrf);
        test.done();
    },

    testTSResourceFileConstructorParams: function(test) {
        test.expect(1);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "en-US"
        });

        test.ok(tsrf);
        test.done();
    },
    testTSResourceFileIsDirty: function(test) {
        test.expect(3);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        test.ok(!tsrf.isDirty());

        [
            p.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            tsrf.addResource(res);
        });

        test.ok(tsrf.isDirty());
        test.done();
    },

    testTSResourceFileRightContents: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        [
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            tsrf.addResource(res);
        });

        test.equal(tsrf.getContent(),
            '{\n' +
            '    "more source text": "mehr Quellentext",\n' +
            '    "source text": "Quellentext",\n' +
            '    "yet more source text": "noch mehr Quellentext"\n' +
            '}'
        );

        test.done();
    },

    testTSResourceFileGetContentsNoContent: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        test.equal(tsrf.getContent(),'{}');
        test.done();
    },

    testTSResourceFileEscapeDoubleQuotes: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        [
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen\"text"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellen\"text"
            })
        ].forEach(function(res) {
            tsrf.addResource(res);
        });

        test.equal(tsrf.getContent(),
            '{\n' +
            '    "more source text": "mehr Quellen\\"text",\n' +
            '    "source text": "Quellen\\"text"\n' +
            '}'
        );
        test.done();
    },

    testTSResourceFileDontEscapeSingleQuotes: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        [
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen'text"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellen'text"
            })
        ].forEach(function(res) {
            tsrf.addResource(res);
        });

        test.equal(tsrf.getContent(),
            '{\n' +
            '    "more source text": "mehr Quellen\'text",\n' +
            '    "source text": "Quellen\'text"\n' +
            '}'
        );

        test.done();
    },

    testTSResourceFileIdentifyResourceIds: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-DE"
        });

        test.ok(tsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            tsrf.addResource(res);
        });

        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = tsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testTSResourceFileGetResourceFilePathDefaultLocaleForLanguage: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-DE"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "localized_json/de.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathDefaultLocaleForLanguageNoDefaultAvailable: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "localized_json/de.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathNonDefaultLocaleForLanguage: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-AT"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "localized_json/de-AT.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathDefaultLocaleForLanguageWithFlavor: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-DE"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "localized_json/de.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathNonDefaultLocaleForLanguageWithFlavor: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-AT-ASDF"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "localized_json/de-AT-ASDF.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathDefaultLocaleForLanguageZH: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "zh-Hans-CN"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "localized_json/zh.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathDefaultLocaleForLanguageZHNoDefaultsAvailable: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "zh-Hans-CN"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "localized_json/zh.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathDefaultLocaleForLanguageZH: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "zh-Hant-HK"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "localized_json/zh-Hant-HK.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathNonDefaultLocaleForLanguageZH2: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "zh-Hans-SG"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "localized_json/zh-Hans-SG.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathNonDefaultLocaleForLanguageZH3: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "zh-Hant-TW"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "localized_json/zh-Hant-TW.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathDefaultLocale: function(test) {
        test.expect(2);

        // should default to English/US
        var tsrf = new TSResourceFile({
            project: p2
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "localized_json/en.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathAlreadyHasPath: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-AT"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "localized_json/de-AT.ts");
        test.done();
    },

    testTSResourceFileGetContentDefaultLocale: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-DE"
        });

        test.ok(tsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            tsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = tsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testTSResourceFileGetContentDefaultLocaleNoDefaultsAvailable: function(test) {
        test.expect(2);

        var customP = new CustomProject({
            id: "webOSQML",
            sourceLocale: "en-US",
            resourceDirs: {
                "json": "localized_json"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            identify: true
        });

        var tsrf = new TSResourceFile({
            project: customP,
            locale: "de-DE"
        });

        test.ok(tsrf);

        [
            customP.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            customP.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            customP.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            tsrf.addResource(res);
        });

        // should use the full locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = tsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testTSResourceFileGetContentNonDefaultLocale: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-AT"
        });

        test.ok(tsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-AT",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-AT",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-AT",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            tsrf.addResource(res);
        });

        // should use the full locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = tsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testTSResourceFileGetContentDefaultLocaleZH: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "zh-Hans-CN"
        });

        test.ok(tsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "zh-Hans-CN",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "zh-Hans-CN",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "zh-Hans-CN",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            tsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = tsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testTSResourceFileGetContentDefaultLocaleZH2: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "zh-Hant-HK"
        });

        test.ok(tsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "zh-Hant-HK",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "zh-Hant-HK",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "zh-Hant-HK",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            tsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = tsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testTSResourceFileGetContentNonDefaultLocaleZH: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "zh-Hans-SG"
        });

        test.ok(tsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "zh-Hans-SG",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "zh-Hans-SG",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "zh-Hans-SG",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            tsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = tsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testTSResourceFileGetContentNonDefaultLocaleZH2: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "zh-Hant-TW"
        });

        test.ok(tsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "zh-Hant-TW",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "zh-Hant-TW",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "zh-Hant-TW",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            tsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = tsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testTSResourceFileGetContentDefaultLocaleWithFlavor: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-DE-ASDF"
        });

        test.ok(tsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE-ASDF",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE-ASDF",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE-ASDF",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            tsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = tsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testTSResourceFileGetContentNonDefaultLocaleWithFlavor: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-DE-ASDF"
        });

        test.ok(tsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE-ASDF",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE-ASDF",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webOSQML",
                targetLocale: "de-DE-ASDF",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            tsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = tsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },
    teasTSResourceFileGetResourceFilePaths: function(test) {
        test.expect(13);
        var tsrf;
        var locales = ["en-US","en-GB", "en-AU", "es-CO",
                    "es-ES","et-EE","fa-IR","fa-AF","fr-FR","fr-CA", "zh-Hans-CN","zh-Hant-HK","zh-Hant-TW"];

        var expected = [
            "localized_json/en.ts","localized_json/en-GB.ts",
            "localized_json/en/AU.ts","localized_json/es-CO.ts",
            "localized_json/es.ts","localized_json/et.ts",
            "localized_json/fa.ts","localized_json/fa-AF.ts",
            "localized_json/fr.ts","localized_json/fr-CA.ts",
            "localized_json/zh.ts","localized_json/zh-Hant-HK.ts",
            "localized_json/zh/Hant/TW.ts"
        ];
        for (var i=0; i<locales.length;i++) {
            jsrf = new TSResourceFile({
                project: p2,
                locale: locales[i]
            });
            test.equal(tsrf.getResourceFilePath(), expected[i]);
        }
        test.done();
    }
};