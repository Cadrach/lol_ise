// Load League of Legend data from API.
var rp = require('request-promise');
var Promise = require('bluebird');

/**
 * Options used to load API data.
 *
 * @typedef {Object} Options
 * @property {String} riotApiKey - Api key to use for RIOT API.
 */

/**
 * Configuration data retrieved from API.
 *
 * @typedef {Object} ConfigData
 * @property {String} version - Latest League of Legend version.
 * @property {String[]} languages - Array of available languages.
 */

/**
 * Language data retrieved from API.
 *
 * @typedef {Object} LanguageData
 * @property {Object} item
 * @property {Object} champion
 * @property {Object} language
 */

/**
 * Callback invoked when global configuration has been loaded.
 *
 * @callback ConfigCb
 * @param {ConfigData} data - An object containing global data retrieved from API.
 */

/**
 * Callback invoked when one language data has been loaded.
 *
 * @callback LanguageCb
 * @param {String} language - Language of the loaded language data.
 * @param {LanguageData} languageData - An object containing language data retrieved from API.
 */

/**
 * Load configuration and language data from API.
 *
 * @param {Options} options Configuration object.
 * @param {ConfigCb} configCb Callback invoked when global configuration has been retrieved.
 * @param {LanguageCb} languageCb Callback invoked when one language data has been retrieved.
 */
function load(options, configCb, languageCb) {
    var API_VERSION = '1.2';

    var getVersionRequest = {
        uri: 'https://global.api.pvp.net/api/lol/static-data/euw/v' + API_VERSION + '/versions',
        qs: {api_key: options.riotApiKey},
        json: true
    };

    var ddragon = 'http://ddragon.leagueoflegends.com/cdn/';

    var getLanguagesRequest = {
        uri: ddragon + 'languages.json',
        json: true
    };

    Promise.all([rp(getVersionRequest), rp(getLanguagesRequest)]).then(function (responses) {
        var versionResponse = responses[0];
        var languagesResponse = responses[1];

        // Write "../source/config.json"
        var configData = {version: versionResponse[0], languages: languagesResponse};
        configCb(configData);

        return configData;
    }).then(function (configData) {
        configData.languages.forEach(function (language) {
            var itemRequest = rp({uri: ddragon + configData.version + "/data/" + language + "/item.json", json: true});
            var champions = rp({
                uri: ddragon + configData.version + "/data/" + language + "/champion.json",
                json: true
            });
            var languages = rp({
                uri: ddragon + configData.version + "/data/" + language + "/language.json",
                json: true
            });

            Promise.all([itemRequest, champions, languages]).then(function (responses) {
                var languageData = {item: responses[0], champion: responses[1], language: responses[2]};
                languageData.language.data.native_ko = '한국어';
                languageCb(language, languageData);
            });
        });
    });
}

module.exports = load;


