// Generates JSON files from API.
var fs = require('fs');

var load = require('./api-data-loader.js');

var conf = require('./conf.json');

/**
 * Writes given configuration data into source file.
 *
 * @param {ConfigData} configData
 */
function configWriter(configData) {
    fs.writeFile(__dirname + '/../src/source/config.json', JSON.stringify(configData, null, 2))
}

/**
 * Writes given language data into source file.
 *
 * @param {String} language
 * @param {LanguageData} languageData
 */
function languageWriter(language, languageData) {
    fs.writeFile(__dirname + '/../src/source/data_' + language + '.json', JSON.stringify(languageData, null, 2));
}

// Write data files.
load(conf, configWriter, languageWriter);
