/*
 * testTSResourceFile.js - test the ts file handler object.
 *
 * Copyright (c) 2020-2022, JEDLSoft
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
    var SourceContextResourceString = require("loctool/lib/SourceContextResourceString.js");
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
    id: "inputcommon",
    projectType: "webos-qml",
    sourceLocale: "en-KR",
    resourceDirs: {
        "ts": "."
        }
    }, ".", {
        locales:["en-GB"]
    });

var p2 = new CustomProject({
    id: "quicksettings",
    projectType: "webos-qml",
    sourceLocale: "en-KR",
    resourceDirs: {
        "ts": "locales"
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
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            },
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test1.qml",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            },
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test1.qml",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            }
        ].forEach(function(res) {
            var resource = new SourceContextResourceString(res);
            tsrf.addResource(resource);
        });

        test.ok(tsrf.isDirty());
        test.done();
    },
    testTSResourceFileRightContentsWithComment: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        var resource = new SourceContextResourceString({
                type: "string",
                project: "inputcommon",
                pathName: "./src/Hello.qml",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext",
                context: "Hello",
                comment: "i18n comments"

            });
        tsrf.addResource(resource);
        test.equal(tsrf.getContent(),
         '<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Hello</name>\n' +
         '    <message>\n' +
         '      <location filename="Hello.qml"></location>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellentext</translation>\n' +
         '      <extracomment>i18n comments</extracomment>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
        test.done();
    },

    testTSResourceFileRightContents: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        var resource = new SourceContextResourceString({
                type: "string",
                project: "inputcommon",
                pathName: "./src/Hello.qml",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext",
                context: "Hello"

            });
        tsrf.addResource(resource);
        test.equal(tsrf.getContent(),
         '<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Hello</name>\n' +
         '    <message>\n' +
         '      <location filename="Hello.qml"></location>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellentext</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
        test.done();
    },

    testTSResourceFileRightContents2: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        [
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen text"
            },
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellen text"
            }
        ].forEach(function(res) {
            var resource = new SourceContextResourceString(res);
            tsrf.addResource(resource);
        });

        test.equal(tsrf.getContent(),
         '<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>more source text</source>\n' +
         '      <translation>mehr Quellen text</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellen text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );

        test.done();
    },
    testTSResourceFileRightContents3: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-DE"
        });

        test.ok(tsrf);
        [
            {
                type: "string",
                project: "quicksettings",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen text"
            },
            {
                type: "string",
                project: "quicksettings",
                targetLocale: "de-DE",
                pathName: "./Test.qml",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellen text"
            },
            {
                type: "string",
                project: "quicksettings",
                pathName: "./Translation.qml",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellen text"
            }
        ].forEach(function(res) {
            var resource = new SourceContextResourceString(res);
            tsrf.addResource(resource);
        });

        test.equal(tsrf.getContent(),
         '<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>more source text</source>\n' +
         '      <translation>mehr Quellen text</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellen text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '  <context>\n' +
         '    <name>Translation</name>\n' +
         '    <message>\n' +
         '      <location filename="Translation.qml"></location>\n' +
         '      <source>yet more source text</source>\n' +
         '      <translation>noch mehr Quellen text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );

        test.done();
    },
    testTSResourceFileRightContents4: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        [
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen text",
                context: "Test"
            },
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellen text",
                context: "Test"
            },
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test2.qml",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen text",
                context: "Test2"
            }
        ].forEach(function(res) {
            var resource = new SourceContextResourceString(res);
            tsrf.addResource(resource);
        });

        test.equal(tsrf.getContent(),
         '<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>more source text</source>\n' +
         '      <translation>mehr Quellen text</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellen text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '  <context>\n' +
         '    <name>Test2</name>\n' +
         '    <message>\n' +
         '      <location filename="Test2.qml"></location>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellen text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
        test.done();
    },
    testTSResourceFileRightContents5: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        [
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "source text key1",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen text",
                context: "Test"
            },
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellen text",
                context: "Test"
            },
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test2.qml",
                targetLocale: "de-DE",
                key: "source text key3",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen text",
                context: "Test2"
            }
        ].forEach(function(res) {
            var resource = new SourceContextResourceString(res);
            tsrf.addResource(resource);
        });

        test.equal(tsrf.getContent(),
         '<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>more source text</source>\n' +
         '      <translation>mehr Quellen text</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>source text</source>\n' +
         '      <comment>source text key1</comment>\n' +
         '      <translation>Quellen text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '  <context>\n' +
         '    <name>Test2</name>\n' +
         '    <message>\n' +
         '      <location filename="Test2.qml"></location>\n' +
         '      <source>source text</source>\n' +
         '      <comment>source text key3</comment>\n' +
         '      <translation>Quellen text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
        test.done();
    },
    testTSResourceFileRightContentsSourceTargetSame: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        [
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "source text key",
                sourceLocale: "en-US",
                source: "source text",
                target: "source text"
            }
        ].forEach(function(res) {
            var resource = new SourceContextResourceString(res);
            tsrf.addResource(resource);
        });

        test.equal(tsrf.getContent(),
         '<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>source text</source>\n' +
         '      <comment>source text key</comment>\n' +
         '      <translation>source text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );

        test.done()
    },
    testTSResourceFileRightContentsSourceTargetSame2: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        [
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "source text key",
                sourceLocale: "en-US",
                source: "source text",
                target: "source text"
            },
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                sourceLocale: "en-US",
                source: "source text ",
                target: "source text "
            }
        ].forEach(function(res) {
            var resource = new SourceContextResourceString(res);
            tsrf.addResource(resource);
        });

        test.equal(tsrf.getContent(),
         '<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>source text</source>\n' +
         '      <comment>source text key</comment>\n' +
         '      <translation>source text</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>source text </source>\n' +
         '      <translation>source text </translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );

        test.done()
    },
    testTSResourceFileRightContentsKeyTargetSame: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        [
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "source text one",
                target: "more source text"
            }
        ].forEach(function(res) {
            var resource = new SourceContextResourceString(res);
            tsrf.addResource(resource);
        });

        test.equal(tsrf.getContent(),
         '<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>source text one</source>\n' +
         '      <comment>more source text</comment>\n' +
         '      <translation>more source text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );

        test.done()
    },
    testTSResourceFileRightContentsSourceKeyTargetSame: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        [
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "source text"
            }
        ].forEach(function(res) {
            var resource = new SourceContextResourceString(res);
            tsrf.addResource(resource);
        });

        test.equal(tsrf.getContent(),
         '<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>source text</source>\n' +
         '      <translation>source text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );

        test.done()
    },
    testTSResourceFileRightContentsSourceKeyTargetSame2: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        [
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "source text"
            },
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "more source text",
                context: "Test"
            },
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test2.qml",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "source text2",
                target: "source text2",
                context: "Test"
            },
        ].forEach(function(res) {
            var resource = new SourceContextResourceString(res);
            tsrf.addResource(resource);
        });

        test.equal(tsrf.getContent(),
         '<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>more source text</source>\n' +
         '      <translation>more source text</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>source text</source>\n' +
         '      <translation>source text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '  <context>\n' +
         '    <name>Test2</name>\n' +
         '    <message>\n' +
         '      <location filename="Test2.qml"></location>\n' +
         '      <source>source text2</source>\n' +
         '      <comment>more source text</comment>\n' +
         '      <translation>source text2</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );

        test.done()
    },
    testTSResourceFileRightContentsDupkeys: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        [
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "duplicated keys",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen text"
            },
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "duplicated keys",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellen text"
            }
        ].forEach(function(res) {
            var resource = new SourceContextResourceString(res);
            tsrf.addResource(resource);
        });

        test.equal(tsrf.getContent(),
         '<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>source text</source>\n' +
         '      <comment>duplicated keys</comment>\n' +
         '      <translation>Quellen text</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>more source text</source>\n' +
         '      <comment>duplicated keys</comment>\n' +
         '      <translation>mehr Quellen text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
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
        test.equal(tsrf.getContent(),'<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE TS>\n<TS version="2.1" language="de-DE" sourcelanguage="en-KR"></TS>');
        test.done();
    },

    testTSResourceFileGetResourceFilePathDefaultLocaleForLanguage: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-DE"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "testfiles/locales/quicksettings_de.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathDefaultLocaleForLanguageNoDefaultAvailable: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "inputcommon_de.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathNonDefaultLocaleForLanguage: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-AT"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "testfiles/locales/quicksettings_de_AT.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathDefaultLocaleForLanguageWithFlavor: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-DE"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "testfiles/locales/quicksettings_de.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathNonDefaultLocaleForLanguageWithFlavor: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-AT-ASDF"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "testfiles/locales/quicksettings_de_AT_ASDF.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathDefaultLocaleForLanguageZH: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "zh-Hans-CN"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "testfiles/locales/quicksettings_zh.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathDefaultLocaleForLanguageZHNoDefaultsAvailable: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "zh-Hans-CN"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "inputcommon_zh.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathDefaultLocaleForLanguageZH: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "zh-Hant-HK"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "testfiles/locales/quicksettings_zh_Hant_HK.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathNonDefaultLocaleForLanguageZH2: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "zh-Hans-SG"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "testfiles/locales/quicksettings_zh_Hans_SG.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathNonDefaultLocaleForLanguageZH3: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "zh-Hant-TW"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "testfiles/locales/quicksettings_zh_Hant_TW.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathDefaultLocale: function(test) {
        test.expect(2);

        // should default to English/US
        var tsrf = new TSResourceFile({
            project: p2
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "testfiles/locales/quicksettings_en.ts");
        test.done();
    },

    testTSResourceFileGetResourceFilePathAlreadyHasPath: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-AT"
        });

        test.ok(tsrf);
        test.equal(tsrf.getResourceFilePath(), "testfiles/locales/quicksettings_de_AT.ts");
        test.done();
    },

    testTSResourceFileGetContentDefaultLocale: function(test) {
        test.expect(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "ko-KR"
        });

        test.ok(tsrf);

        [
            {
                type: "string",
                project: "quicksettings",
                targetLocale: "ko-KR",
                key: "source text",
                pathName: "./Test.qml",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            },
            {
                type: "string",
                project: "quicksettings",
                targetLocale: "ko-KR",
                pathName: "./Test.qml",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            },
            {
                type: "string",
                project: "quicksettings",
                targetLocale: "ko-KR",
                pathName: "./Test.qml",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            }
        ].forEach(function(res) {
            var resource = new SourceContextResourceString(res);
            tsrf.addResource(resource);
        });

        test.equal(tsrf.getContent(),
         '<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="ko-KR" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>more source text</source>\n' +
         '      <translation>mehr Quellentext</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellentext</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"></location>\n' +
         '      <source>yet more source text</source>\n' +
         '      <translation>noch mehr Quellentext</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
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
            {
                type: "string",
                project: "quicksettings",
                targetLocale: "de-DE-ASDF",
                pathName: "./Test2.qml",
                key: "source text",
                sourceLocale: "en-KR",
                source: "source text",
                target: "Quellentext"
            },
            {
                type: "string",
                project: "quicksettings",
                targetLocale: "de-DE-ASDF",
                pathName: "./Test2.qml",
                key: "more source text",
                sourceLocale: "en-KR",
                source: "more source text",
                target: "mehr Quellentext"
            },
            {
                type: "string",
                project: "quicksettings",
                targetLocale: "de-DE-ASDF",
                pathName: "./Test2.qml",
                key: "yet more source text",
                sourceLocale: "en-KR",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            }
        ].forEach(function(res) {
            var resource = new SourceContextResourceString(res);
            tsrf.addResource(resource);
        });

        test.equal(tsrf.getContent(),
         '<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE-ASDF" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test2</name>\n' +
         '    <message>\n' +
         '      <location filename="Test2.qml"></location>\n' +
         '      <source>more source text</source>\n' +
         '      <translation>mehr Quellentext</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test2.qml"></location>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellentext</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test2.qml"></location>\n' +
         '      <source>yet more source text</source>\n' +
         '      <translation>noch mehr Quellentext</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );

        test.done();
    },

    teasTSResourceFileGetResourceFilePaths: function(test) {
        test.expect(13);
        var tsrf;
        var locales = ["en-US","en-GB", "en-AU", "es-CO",
                    "es-ES","et-EE","fa-IR","fa-AF","fr-FR","fr-CA", "zh-Hans-CN","zh-Hant-HK","zh-Hant-TW"];

        var expected = [
            "testfiles/locales/quicksettings_en.ts","testfiles/locales/quicksettings_en_GB.ts",
            "testfiles/locales/quicksettings_en_AU.ts","testfiles/locales/quicksettings_es_CO.ts",
            "testfiles/locales/quicksettings_es.ts","testfiles/locales/quicksettings_et.ts",
            "testfiles/locales/quicksettings_fa.ts","testfiles/locales/quicksettings_fa_AF.ts",
            "testfiles/locales/quicksettings_fr.ts","testfiles/locales/quicksettings_fr_CA.ts",
            "testfiles/locales/quicksettings_zh.ts","testfiles/locales/quicksettings_zh_Hant_HK.ts",
            "testfiles/locales/quicksettings_zh_Hant_TW.ts"
        ];
        for (var i=0; i<locales.length;i++) {
            tsrf = new TSResourceFile({
                project: p2,
                locale: locales[i]
            });
            test.equal(tsrf.getResourceFilePath(), expected[i]);
        }
        test.done();
    }
};