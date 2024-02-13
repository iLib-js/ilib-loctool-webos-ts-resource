# ilib-loctool-webos-ts-resource
ilib-loctool-webos-ts-resource is a plugin for the loctool that
allows it to read and localize TS resource files. This plugin is optimized for the webOS platform.

### TSResource FileType
This plugin is for generating [TS](https://doc.qt.io/qt-6/linguist-ts-file-format.html) type of resource file from the QML application.   
The TS file format used by Qt Linguist. The TS file is an intermediate output for QML localization. *.qm files are required for the application. Converting ts file to qm file work happens during a webOS build. Here's a simple ts file example.
```xml
   <?xml version="1.0" encoding="utf-8"?>
   <!DOCTYPE TS>
   <TS version="2.1" language="ko-KR" sourcelanguage="en-US">
   <context>
    <name>Intro</name>
       <message>
           <location filename="Intro.qml"></location>
           <source>Hello</source>
           <translation>안녕하세요</translation>
       </message>
   </context>
   </TS
```

#### Sample
The simple sample is provided in [ilib-loctool-samples](https://github.com/iLib-js/ilib-loctool-samples) repository.
Please check the [webos-qml](https://github.com/iLib-js/ilib-loctool-samples/tree/main/webos-qml) sample to see what TS file looks like.

## License

Copyright (c) 2019-2024, JEDLSoft

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.


## Release Notes
### v1.5.4
* Updated dependencies. (loctool: 2.24.0)
* Converted all the unit tests from `nodeunit` to `jest`.

### v1.5.3
* Removed `npm-shrinkwrap.json`. It takes a bigger memory size than I expected on webOS. so I decided not to maintain the file here.
* Updated to use the path's `basename()` to get filename from the path.

### v1.5.2
* Added `loctool` package to `peerDependencies` in `package.json`.

### v1.5.1
* Updated dependencies. (loctool: 2.23.1)
* Updated to be included `npm-shrinkwrap.json` in the published files.

### v1.5.0
* Updated dependencies. (loctool: 2.22.0)
* Updated to set context name value properly which is not always a file name.

### v1.4.2
* Updated dependencies. (loctool: 2.21.0)
* Fixed not to have file extension in name element with js file.

### v1.4.1
* Updated dependencies. (loctool: 2.20.2)

### v1.4.0
* Replaced dependent `xml2json` package to `xml-js`

### v1.3.1
* Updated dependencies. (loctool: 2.20.0)

### v1.3.0
* Updated dependencies. (loctool: 2.18.0)
* Added ability to override language default locale.
    ~~~~
       "settings": {
            "localeMap": {
                "es-CO": "es"
            }
        }
    ~~~~

### v1.2.10
* Updated dependencies. (loctool: 2.17.0)

### v1.2.9
* Updated dependencies. (loctool: 2.16.3)
* Used the logger provided by the loctool instead of using log4js directly.
* Added node 16 version testing for circleCI. (minimum version of node is v10)

### v1.2.8
* Updated dependent module version to have the latest one. (loctool: 2.16.2)

### v1.2.7
* Updated dependent module version to have the latest one. (loctool: 2.14.1)

### v1.2.6
* Updated dependent module version to have the latest one. (loctool: 2.13.0)

### v1.2.5
* Fixed `newFile()` to get locale parameter for convert feature
* Updated dependent module version to have the latest one. (loctool: 2.12.0)

### v1.2.4
* Updated dependent module version to have the latest one. (loctool: 2.10.3)

### v1.2.3
* Updated dependent module version to have the latest one.

### v1.2.2
* Updated code to generate resource even though source and target are the same.

### v1.2.1
* Fixed resource target path
* Updated code to print log with log4js.

### v1.2.0
* Changed default sourcelanguage to `en-KR`.

### v1.1.0
* Fixed an issue case which a `key` value is not written to TS file.

### v1.0.0
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