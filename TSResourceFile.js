/*
 * TSResourceFile.js - represents an ts style resource file
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

var fs = require("fs");
var path = require("path");
var Locale = require("ilib/lib/Locale.js");
var xmljs = require("xml-js");
var PrettyData = require("pretty-data").pd;
var Utils = require("loctool/lib/utils.js");

/**
 * @class Represents an ts resource file.
 * The props may contain any of the following properties:
 *
 * <ul>
 * <li>project - the name of the project for this file
 * <li>pathName - the path to the file, relative to the root of the project
 * <li>type - type of this resource file
 * <li>locale - the locale of this file
 * </ul>
 * @param {Object} props properties that control the construction of this file.
 */
var TSResourceFile = function(props) {
    this.project = props.project;
    this.locale = new Locale(props.locale);
    this.API = props.project.getAPI();
    this.logger = this.API.getLogger("loctool.plugin.webOSTSResourceFile");
    if (Object.keys(this.project.localeMap).length > 0){
        Utils.setBaseLocale(props.project.localeMap);
    }
    this.baseLocale = Utils.isBaseLocale(this.locale.getSpec());
    this.set = this.API.newTranslationSet(this.project && this.project.sourceLocale || "en-US");
};

/**
 * We don't read javascript resource files. We only write them.
 */
TSResourceFile.prototype.extract = function() {};

/**
 * Get the locale of this resource file. For ts resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
TSResourceFile.prototype.getLocale = function() {
    return this.locale;
};

/**
 * Get the locale of this resource file. For ts resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
TSResourceFile.prototype.getContext = function() {
    return this.context;
};

/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 *
 * @returns {Resource} all of the resources available in this resource file.
 */
TSResourceFile.prototype.getAll = function() {
    return this.set.getAll();
};

TSResourceFile.prototype.getFileName = function(pathName) {
    if (!pathName) return;

    var fileName = pathName;
    var splitDir = fileName.split("/");
    fileName = splitDir[splitDir.length-1];

    return fileName;
};

/**
 * Add a resource to this file. The locale of the resource
 * should correspond to the locale of the file, and the
 * context of the resource should match the context of
 * the file.
 *
 * @param {Resource} res a resource to add to this file
 */
TSResourceFile.prototype.addResource = function(res) {
    this.logger.trace("TSResourceFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale + ", " + JSON.stringify(this.context));
    var resLocale = res.getTargetLocale() || res.getSourceLocale();
    if (res && res.getProject() === this.project.getProjectId() && resLocale === this.locale.getSpec()) {
        this.logger.trace("correct project, context, and locale. Adding.");
        this.set.add(res);
    } else {
        if (res) {
            if (res.getProject() !== this.project.getProjectId()) {
                this.logger.warn("Attempt to add a resource to a resource file with the incorrect project.");
            } else {
                this.logger.warn("Attempt to add a resource to a resource file with the incorrect locale. " + resLocale + " vs. " + this.locale.getSpec());
            }
        } else {
            this.logger.warn("Attempt to add an undefined resource to a resource file.");
        }
    }
};

/**
 * Return true if this resource file has been modified
 * since it was loaded from disk.
 *
 * @returns {boolean} true if this resource file has been
 * modified since it was loaded
 */
TSResourceFile.prototype.isDirty = function() {
    return this.set.isDirty();
};

// we don't localize resource files
TSResourceFile.prototype.localize = function() {};

function clean(str) {
    if (!str) return;
    return str.replace(/\s+/, " ").trim();
}

/**
 * Generate the content of the resource file.
 *
 * @private
 * @returns {String} the content of the resource file
 */
TSResourceFile.prototype.getContent = function() {
    var content = {}, json = {};
    var fileList = [], contextList = [];

    if (this.set.isDirty()) {
        var resources = this.set.getAll();

        // make sure resources are sorted by key so that git diff works nicely across runs of the loctool
        resources.sort(function(left, right) {
            return (left.getKey() < right.getKey()) ? -1 : (left.getKey() > right.getKey() ? 1 : 0);
        });

        for (var j = 0; j < resources.length; j++) {
            var resource = resources[j];
            var filename = this.getFileName(resource.getPath());

            if (content["context"] === undefined) {
                content["context"] = {};
            }

            if (resource.getSource() && resource.getTarget()) {
                this.logger.trace("writing translation for " + resource.getKey() + " as " + resource.getTarget());

                filename = this.getFileName(resource.getPath());

                var messageObj = {
                    "location": {
                        "_attributes" :{
                            "filename": filename
                        }
                    },
                    "source": {
                        "_text": resource.getSource()
                    },
                    "translation":{
                        "_text": resource.getSource()
                    }
                }

                if (resource.getKey() && resource.getSource() !== resource.getKey()) {
                    messageObj.comment = {
                        "_text": resource.getKey()
                    }
                }
                messageObj.translation = {
                    "_text": resource.getTarget()
                }

                if (typeof (resource.getComment()) !== "undefined") {
                    messageObj.extracomment = {
                        "_text": resource.getComment()
                    }
                }

                if (fileList.indexOf(filename) !== -1) {
                    for (var i=0; i< content["context"].length; i++) {
                        if (content["context"][i]["name"]["_text"] === filename.replace(".qml", "")) {
                            content["context"][i]["message"].push(messageObj);
                            break;
                        }
                    }
                } else {
                    fileList.push(filename);
                    var contextObj = {
                        "name" :{
                            "_text": filename.replace(".qml", "")
                        },
                        "message": []
                    }
                    contextObj["message"].push(messageObj);
                    contextList.push(contextObj);
                    content["context"] = contextList;
                }
            } else {
                this.logger.warn("String resource " + resource.getKey() + " has no source text. Skipping...");
            }
        }
    }

    // allow for a project-specific prefix to the file to do things like importing modules and such
    var output = "";
    var settings = this.project.settings;
    if (settings && settings.TSResourceFile && settings.TSResourceFile.prefix) {
        output = settings.TSResourceFile.prefix;
    }
    
    json["TS"] = {
        "_attributes":{
            "version": "2.1",
            "language": this.locale.getSpec(),
            "sourcelanguage": "en-KR"
        },
        "context": contextList
    };
    
    // take care of double-escaped unicode chars
    //output = output.replace(/\\\\u/g, "\\u");

    var xml = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE TS>' + xmljs.js2xml(json, {compact: true, spaces: 2});
    return PrettyData.xml(xml);
};

/**
 * Find the path for the resource file for the given project, context,
 * and locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @return {String} resource file path
 */
TSResourceFile.prototype.getResourceFilePath = function(locale) {
    locale = locale || this.locale;
    var dir, newPath;
    var projectId = this.project.options.id;
    var filename = projectId +"_en.ts";

    if (this.baseLocale) {
        filename = locale.getLanguage()+".ts";
    } else {
        filename = locale.getSpec().replace(/-/g, "_") +".ts";
    }
    filename = projectId + "_" + filename;

    dir = path.join(this.project.target, this.project.getResourceDirs("ts")[0] || ".");
    newPath = path.join(dir, filename);

    this.logger.trace("Getting resource file path for locale " + locale + ": " + newPath);
    return newPath;
};

/**
 * Write the resource file out to disk again.
 */
TSResourceFile.prototype.write = function() {
    this.logger.trace("writing resource file. [" + this.project.getProjectId() + "," + this.locale + "]");
    if (this.set.isDirty()) {
        this.defaultSpec = this.locale.getSpec();

        if (!this.pathName) {
            this.pathName = this.getResourceFilePath();
        }

        dir = path.dirname(this.pathName);
        this.API.utils.makeDirs(dir);

        var js = this.getContent();
        fs.writeFileSync(this.pathName, js, "utf8");
        this.logger.info("Wrote string translations to file " + this.pathName);
    } else {
        this.logger.debug("File " + this.pathName + " is not dirty. Skipping.");
    }
};

/**
 * Return the set of resources found in the current ts
 * resource file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current qml file.
 */
TSResourceFile.prototype.getTranslationSet = function() {
    return this.set;
}

module.exports = TSResourceFile;