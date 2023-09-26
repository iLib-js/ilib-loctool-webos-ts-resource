/*
 * TSResourceFile.test.js - test the ts file handler object.
 *
 * Copyright (c) 2020-2023, JEDLSoft
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

var p3 = new CustomProject({
    id: "quicksettings",
    projectType: "webos-qml",
    sourceLocale: "en-KR",
    resourceDirs: {
        "ts": "locales"
        }
    }, "./testfiles", {
    locales:["es-CO", "es-ES", "fr-CA","fr-FR"],
    localeMap: {
        "es-CO":"es",
        "fr-CA":"fr"
    }
});

describe("tsresourcefile", function() {
    test("TSResourceFileConstructor", function() {
        expect.assertions(1);

        var tsrf = new TSResourceFile({
            project: p
        });
        expect(tsrf).toBeTruthy();
    });
    test("TSResourceFileConstructorParams", function() {
        expect.assertions(1);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "en-US"
        });

        expect(tsrf).toBeTruthy();
    });
    test("TSResourceFileIsDirty", function() {
        expect.assertions(3);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
        expect(!tsrf.isDirty()).toBeTruthy();

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

        expect(tsrf.isDirty()).toBeTruthy();
    });
    test("TSResourceFileRightContentsWithComment", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
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
        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Hello</name>\n' +
         '    <message>\n' +
         '      <location filename="Hello.qml"/>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellentext</translation>\n' +
         '      <extracomment>i18n comments</extracomment>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
    });
    test("TSResourceFileRightContents", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
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
        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Hello</name>\n' +
         '    <message>\n' +
         '      <location filename="Hello.qml"/>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellentext</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
    });
    test("TSResourceFileRightContents2", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
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

        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>more source text</source>\n' +
         '      <translation>mehr Quellen text</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellen text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
    });
    test("TSResourceFileRightContents3", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
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

        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>more source text</source>\n' +
         '      <translation>mehr Quellen text</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellen text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '  <context>\n' +
         '    <name>Translation</name>\n' +
         '    <message>\n' +
         '      <location filename="Translation.qml"/>\n' +
         '      <source>yet more source text</source>\n' +
         '      <translation>noch mehr Quellen text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
    });
    test("TSResourceFileRightContents4", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
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

        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>more source text</source>\n' +
         '      <translation>mehr Quellen text</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellen text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '  <context>\n' +
         '    <name>Test2</name>\n' +
         '    <message>\n' +
         '      <location filename="Test2.qml"/>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellen text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
    });
    test("TSResourceFileRightContents5", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
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

        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>more source text</source>\n' +
         '      <translation>mehr Quellen text</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellen text</translation>\n' +
         '      <comment>source text key1</comment>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '  <context>\n' +
         '    <name>Test2</name>\n' +
         '    <message>\n' +
         '      <location filename="Test2.qml"/>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellen text</translation>\n' +
         '      <comment>source text key3</comment>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
    });
    test("TSResourceJSFileRightContents", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
        var resource = new SourceContextResourceString({
                type: "string",
                project: "inputcommon",
                pathName: "./src/JString.js",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext",
                context: "Hello"

            });
        tsrf.addResource(resource);
        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Hello</name>\n' +
         '    <message>\n' +
         '      <location filename="JString.js"/>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellentext</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
    });
    test("TSResourceJSFileRightContents2", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
        [
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.js",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen text"
            },
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.js",
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

        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.js"/>\n' +
         '      <source>more source text</source>\n' +
         '      <translation>mehr Quellen text</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.js"/>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellen text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
    });
    test("TSResourceJSFileRightContents3", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
        [
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.js",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen text"
            },
            {
                type: "string",
                project: "inputcommon",
                pathName: "./jsstring.js",
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

        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
        '<!DOCTYPE TS>\n' +
        '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
        '  <context>\n' +
        '    <name>jsstring</name>\n' +
        '    <message>\n' +
        '      <location filename="jsstring.js"/>\n' +
        '      <source>more source text</source>\n' +
        '      <translation>mehr Quellen text</translation>\n' +
        '    </message>\n' +
        '  </context>\n' +
        '  <context>\n' +
        '    <name>Test</name>\n' +
        '    <message>\n' +
        '      <location filename="Test.js"/>\n' +
        '      <source>source text</source>\n' +
        '      <translation>Quellen text</translation>\n' +
        '    </message>\n' +
        '  </context>\n' +
        '</TS>'
        );
    });
    test("TSResourceFileRightContentsSourceTargetSame", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
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

        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>source text</source>\n' +
         '      <translation>source text</translation>\n' +
         '      <comment>source text key</comment>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
    });
    test("TSResourceFileRightContentsSourceTargetSame2", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
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

        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>source text</source>\n' +
         '      <translation>source text</translation>\n' +
         '      <comment>source text key</comment>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>source text </source>\n' +
         '      <translation>source text </translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
    });
    test("TSResourceFileRightContentsKeyTargetSame", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
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

        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>source text one</source>\n' +
         '      <translation>more source text</translation>\n' +
         '      <comment>more source text</comment>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
    });
    test("TSResourceFileRightContentsSourceKeyTargetSame", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
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

        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>source text</source>\n' +
         '      <translation>source text</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
    });
    test("TSResourceFileRightContentsSourceKeyTargetSame2", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
        [
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "1.source text",
                target: "1.source text"
            },
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test.qml",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "2.more source text",
                target: "2.more source text",
                context: "contextTest"
            },
            {
                type: "string",
                project: "inputcommon",
                pathName: "./Test2.qml",
                targetLocale: "de-DE",
                key: "source text2",
                sourceLocale: "en-US",
                source: "3.source text2",
                target: "3.source text2",
                context: "contextTest"
            },
        ].forEach(function(res) {
            var resource = new SourceContextResourceString(res);
            tsrf.addResource(resource);
        });

        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
        '<!DOCTYPE TS>\n' +
        '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
        '  <context>\n' +
        '    <name>contextTest</name>\n' +
        '    <message>\n' +
        '      <location filename="Test.qml"/>\n' +
        '      <source>2.more source text</source>\n' +
        '      <translation>2.more source text</translation>\n' +
        '      <comment>more source text</comment>\n' +
        '    </message>\n' +
        '    <message>\n' +
        '      <location filename="Test2.qml"/>\n' +
        '      <source>3.source text2</source>\n' +
        '      <translation>3.source text2</translation>\n' +
        '      <comment>source text2</comment>\n' +
        '    </message>\n' +
        '  </context>\n' +
        '  <context>\n' +
        '    <name>Test</name>\n' +
        '    <message>\n' +
        '      <location filename="Test.qml"/>\n' +
        '      <source>1.source text</source>\n' +
        '      <translation>1.source text</translation>\n' +
        '      <comment>source text</comment>\n' +
        '    </message>\n' +
        '  </context>\n' +
        '</TS>'
        );
    });
    test("TSResourceFileRightContentsDupkeys", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
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

        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellen text</translation>\n' +
         '      <comment>duplicated keys</comment>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>more source text</source>\n' +
         '      <translation>mehr Quellen text</translation>\n' +
         '      <comment>duplicated keys</comment>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
    });
    test("TSResourceFileGetContentsNoContent", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE TS>\n<TS version="2.1" language="de-DE" sourcelanguage="en-KR"></TS>');
    });
    test("TSResourceFileGetResourceFilePathDefaultLocaleForLanguage", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
        expect(tsrf.getResourceFilePath()).toBe("testfiles/locales/quicksettings_de.ts");
    });
    test("TSResourceFileGetResourceFilePathDefaultLocaleForLanguageNoDefaultAvailable", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
        expect(tsrf.getResourceFilePath()).toBe("inputcommon_de.ts");
    });
    test("TSResourceFileGetResourceFilePathNonDefaultLocaleForLanguage", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-AT"
        });

        expect(tsrf).toBeTruthy();
        expect(tsrf.getResourceFilePath()).toBe("testfiles/locales/quicksettings_de_AT.ts");
    });
    test("TSResourceFileGetResourceFilePathDefaultLocaleForLanguageWithFlavor", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-DE"
        });

        expect(tsrf).toBeTruthy();
        expect(tsrf.getResourceFilePath()).toBe("testfiles/locales/quicksettings_de.ts");
    });
    test("TSResourceFileGetResourceFilePathNonDefaultLocaleForLanguageWithFlavor", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-AT-ASDF"
        });

        expect(tsrf).toBeTruthy();
        expect(tsrf.getResourceFilePath()).toBe("testfiles/locales/quicksettings_de_AT_ASDF.ts");
    });
    test("TSResourceFileGetResourceFilePathDefaultLocaleForLanguageZH", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "zh-Hans-CN"
        });

        expect(tsrf).toBeTruthy();
        expect(tsrf.getResourceFilePath()).toBe("testfiles/locales/quicksettings_zh.ts");
    });
    test("TSResourceFileGetResourceFilePathDefaultLocaleForLanguageZHNoDefaultsAvailable", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p,
            locale: "zh-Hans-CN"
        });

        expect(tsrf).toBeTruthy();
        expect(tsrf.getResourceFilePath()).toBe("inputcommon_zh.ts");
    });
    test("TSResourceFileGetResourceFilePathDefaultLocaleForLanguageZH", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "zh-Hant-HK"
        });

        expect(tsrf).toBeTruthy();
        expect(tsrf.getResourceFilePath()).toBe("testfiles/locales/quicksettings_zh_Hant_HK.ts");
    });
    test("TSResourceFileGetResourceFilePathNonDefaultLocaleForLanguageZH2", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "zh-Hans-SG"
        });

        expect(tsrf).toBeTruthy();
        expect(tsrf.getResourceFilePath()).toBe("testfiles/locales/quicksettings_zh_Hans_SG.ts");
    });
    test("TSResourceFileGetResourceFilePathNonDefaultLocaleForLanguageZH3", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "zh-Hant-TW"
        });

        expect(tsrf).toBeTruthy();
        expect(tsrf.getResourceFilePath()).toBe("testfiles/locales/quicksettings_zh_Hant_TW.ts");
    });
    test("TSResourceFileGetResourceFilePathDefaultLocale", function() {
        expect.assertions(2);

        // should default to English/US
        var tsrf = new TSResourceFile({
            project: p2
        });

        expect(tsrf).toBeTruthy();
        expect(tsrf.getResourceFilePath()).toBe("testfiles/locales/quicksettings_en.ts");
    });
    test("TSResourceFileGetResourceFilePathAlreadyHasPath", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-AT"
        });

        expect(tsrf).toBeTruthy();
        expect(tsrf.getResourceFilePath()).toBe("testfiles/locales/quicksettings_de_AT.ts");
    });
    test("TSResourceFileGetContentDefaultLocale", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "ko-KR"
        });

        expect(tsrf).toBeTruthy();

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

        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="ko-KR" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test</name>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>more source text</source>\n' +
         '      <translation>mehr Quellentext</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellentext</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test.qml"/>\n' +
         '      <source>yet more source text</source>\n' +
         '      <translation>noch mehr Quellentext</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
    });
    test("TSResourceFileGetContentDefaultLocaleWithFlavor", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "de-DE-ASDF"
        });

        expect(tsrf).toBeTruthy();

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

        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="de-DE-ASDF" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>Test2</name>\n' +
         '    <message>\n' +
         '      <location filename="Test2.qml"/>\n' +
         '      <source>more source text</source>\n' +
         '      <translation>mehr Quellentext</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test2.qml"/>\n' +
         '      <source>source text</source>\n' +
         '      <translation>Quellentext</translation>\n' +
         '    </message>\n' +
         '    <message>\n' +
         '      <location filename="Test2.qml"/>\n' +
         '      <source>yet more source text</source>\n' +
         '      <translation>noch mehr Quellentext</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
    });
    test("TSResourceFileGetContentwithContext", function() {
        expect.assertions(2);

        var tsrf = new TSResourceFile({
            project: p2,
            locale: "ko-KR"
        });

        expect(tsrf).toBeTruthy();

        [
            {
                type: "string",
                project: "quicksettings",
                targetLocale: "ko-KR",
                pathName: "./System.js",
                key: "This function is not supported.",
                sourceLocale: "en-KR",
                source: "This function is not supported.",
                target: "사용할 수 없는 기능입니다.",
                context: "appLaunch"
            },
            {
                type: "string",
                project: "quicksettings",
                targetLocale: "ko-KR",
                pathName: "./appLaunch.js",
                key: "This function is not supported.",
                sourceLocale: "en-KR",
                source: "This function is not supported.",
                target: "사용할 수 없는 기능입니다.",
                context: "appLaunch"
            },
        ].forEach(function(res) {
            var resource = new SourceContextResourceString(res);
            tsrf.addResource(resource);
        });

        expect(tsrf.getContent()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE TS>\n' +
         '<TS version="2.1" language="ko-KR" sourcelanguage="en-KR">\n' +
         '  <context>\n' +
         '    <name>appLaunch</name>\n' +
         '    <message>\n' +
         '      <location filename="System.js"/>\n' +
         '      <source>This function is not supported.</source>\n' +
         '      <translation>사용할 수 없는 기능입니다.</translation>\n' +
         '    </message>\n' +
         '  </context>\n' +
         '</TS>'
        );
    });
    test("teasTSResourceFileGetResourceFilePaths", function() {
        expect.assertions(13);
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
            expect(tsrf.getResourceFilePath()).toBe(expected[i]);
        }
    });
    test("teasTSResourceFileGetResourceFilePathsCustom", function() {
        expect.assertions(4);
        var tsrf;
        var locales = ["es-CO", "es-ES", "fr-CA","fr-FR"];

        var expected = [
            "testfiles/locales/quicksettings_es.ts",
            "testfiles/locales/quicksettings_es_ES.ts",
            "testfiles/locales/quicksettings_fr.ts",
            "testfiles/locales/quicksettings_fr_FR.ts"
        ];
        for (var i=0; i<locales.length;i++) {
            tsrf = new TSResourceFile({
                project: p3,
                locale: locales[i]
            });
            expect(tsrf.getResourceFilePath()).toBe(expected[i]);
        }
    });
});