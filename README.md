# ilib-loctool-webos-ts-resource
ilib-loctool-webos-ts-resource is a plugin for the loctool that
allows it to read and localize ts resource files. This plugins is optimized for webOS platform.

## Release Notes
v1.5.0
* Updated dependencies. (loctool: 2.22.0)
* Update to set context name value properly which is not always a file name.

v1.4.2
* Updated dependencies. (loctool: 2.21.0)
* Fixed not to have file extension in name element with js file.

v1.4.1
* Updated dependencies. (loctool: 2.20.2)

v1.4.0
* Replaced dependent `xml2json` package to `xml-js`

v1.3.1
* Updated dependencies. (loctool: 2.20.0)

v1.3.0
* Updated dependencies. (loctool: 2.18.0)
* Added ability to override language default locale.
    ~~~~
       "settings": {
            "localeMap": {
                "es-CO": "es"
            }
        }
    ~~~~

v1.2.10
* Updated dependencies. (loctool: 2.17.0)

v1.2.9
* Updated dependencies. (loctool: 2.16.3)
* Used the logger provided by the loctool instead of using log4js directly.
* Added node 16 version testing for circleCI. (minimum version of node is v10)

v1.2.8
* Updated dependent module version to have the latest one. (loctool: 2.16.2)

v1.2.7
* Updated dependent module version to have the latest one. (loctool: 2.14.1)

v1.2.6
* Updated dependent module version to have the latest one. (loctool: 2.13.0)

v1.2.5
* Fixed `newFile()` to get locale parameter for convert feature
* Updated dependent module version to have the latest one. (loctool: 2.12.0)

v1.2.4
* Updated dependent module version to have the latest one. (loctool: 2.10.3)

v1.2.3
* Updated dependent module version to have the latest one.

v1.2.2
* Updated code to generate resource even though source and target are the same.

v1.2.1
* Fixed resource target path
* Updated code to print log with log4js.

v1.2.0
* Changed default sourcelanguage to `en-KR`.

v1.1.0
* Fixed an issue case which a `key` value is not written to TS file.

v1.0.0
* Implemented to generate [TS](https://doc.qt.io/qt-5/linguist-ts-file-format.html) style resource file.
  Here's simple output example.
   ~~~~
   <?xml version="1.0" encoding="utf-8"?>
   <!DOCTYPE TS>
   <TS version="2.1" language="ko-KR" sourcelanguage="en-US">
   <context>
    <name>Intro</name>
       <message>
           <location filename="Intro.qml"></location>
           <source>Hello!</source>
           <translation>안녕</translation>
       </message>
   </context>
   </TS
   ~~~~

## License

Copyright (c) 2020-2023, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.