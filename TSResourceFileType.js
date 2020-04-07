/*
 * TSResourceFileType.js - Represents a collection of ts files
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

var fs = require("fs");
var path = require("path");
var log4js = require("log4js");
var TSResourceFile = require("./TSResourceFile.js");
var logger = log4js.getLogger("loctool.plugin.TSResourceFileType");

/**
 * @class Manage a collection of ts resource files.
 *
 * @param {Project} project that this type is in
 */
var TSResourceFileType = function(project) {
    this.type = "ts";
    this.datatype = "ts";
    this.project = project;
    this.extensions = [".ts"];
    this.resourceFiles = {};

    this.API = project.getAPI();
    this.extracted = this.API.newTranslationSet(project.getSourceLocale());
    this.newres = this.API.newTranslationSet(project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(project.getSourceLocale());
};

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
TSResourceFileType.prototype.handles = function(pathName) {
    // ts resource files are only generated. Existing ones are never read in.
    logger.debug("TSResourceFileType handles " + pathName + "?");
    logger.debug("No");
    return false;
};

/**
 * Write out all resources for this file type. For ts resources, each
 * resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write out.
 */
TSResourceFileType.prototype.write = function() {
    logger.trace("Now writing out " + Object.keys(this.resourceFiles).length + " resource files");
    for (var hash in this.resourceFiles) {
        var file = this.resourceFiles[hash];
        file.write();
    }
};

TSResourceFileType.prototype.name = function() {
    return "TS Resource File";
};

/**
 * Return a new file of the current file type using the given
 * path name.
 *
 * @param {String} pathName the path of the resource file
 * @return {TSResourceFile} a resource file instance for the
 * given path
 */
TSResourceFileType.prototype.newFile = function(pathName) {
    var file = new TSResourceFile({
        project: this.project,
        pathName: pathName,
        type: this,
        API: this.API
    });

    var locale = file.getLocale() || this.project.sourceLocale;

    this.resourceFiles[locale] = file;
    return file;
};

/**
 * Find or create the resource file object for the given project, context,
 * and locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @return {TSResourceFile} the JSON resource file that serves the
 * given project, context, and locale.
 */
TSResourceFileType.prototype.getResourceFile = function(locale) {
    var key = locale || this.project.sourceLocale;
    var resfile = this.resourceFiles && this.resourceFiles[key];

    if (!resfile) {
        resfile = this.resourceFiles[key] = new TSResourceFile({
            project: this.project,
            locale: key
        });

        logger.trace("Defining new resource file");
    }

    return resfile;
};

/**
 * Return the translation set containing all of the extracted
 * resources for all instances of this type of file. This includes
 * all new strings and all existing strings. If it was extracted
 * from a source file, it should be returned here.
 *
 * @returns {TranslationSet} the set containing all of the
 * extracted resources
 */
TSResourceFileType.prototype.getExtracted = function() {
    return this.extracted;
};

TSResourceFileType.prototype.getDataType = function() {
    return this.datatype;
};

TSResourceFileType.prototype.getResourceTypes = function() {
    return {};
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
TSResourceFileType.prototype.getExtensions = function() {
    return this.extensions;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
TSResourceFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
TSResourceFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
TSResourceFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

module.exports = TSResourceFileType;