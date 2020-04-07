# ilib-loctool-webos-ts-resource
ilib-loctool-webos-ts-resource is a plugin for the loctool that
allows it to read and localize ts resource files. This plugins is optimized for webOS platform.

## Release Notes
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

Copyright © 2020, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.
