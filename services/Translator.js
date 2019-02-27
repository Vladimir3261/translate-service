const redisClient = require('../services/redis');
const redis = new redisClient.redis;
const sqlite = require('./sqlite');

// Service types
const TYPE_GOOGLE = 1;
const TYPE_YANDEX = 2;
const TYPE_MICROSOFT = 3;

/**
 * @class Translator
 */
class Translator {
    constructor() {
        redis.on('connect', () => console.log("Translation service initialized"));
    }

    // Avaliable types drop-down (API providers)
    providers() {
        return [
            {id: TYPE_GOOGLE, name: 'Google Translate API'},
            {id: TYPE_YANDEX, name: 'Yandex Translate API'},
            {id: TYPE_MICROSOFT, name: 'Microsoft Translate API'},

        ]
    }

    // Full list of existing services
    services() {
        return new Promise( (resolve, reject) => {
            sqlite.all("SELECT * FROM services", async (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(await this.format(data))
                }
            });
        });
    }

    // Get detailed info by service
    service(id) {
        return new Promise((resolve, reject) => {
            sqlite.get("SELECT * FROM services WHERE id=?", [id], (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data)
                }
            });
        })
    }

    // Create new service
    async createService(data) {
        const stmt = sqlite.prepare("INSERT INTO services(`name`, `provider`, `credentials`, `limit`, `used`) VALUES(?, ?, ?, ?, ?)");
        stmt.run(data.name, data.provider, data.credentials, data.limit, 0);
        return stmt.finalize();
    }

    // Edit specified service
    async editService(id, data) {
        let service = await this.service(id);

        for (let key in data) {
            service[key] = data[key];
        }

        const stmt = sqlite.prepare("UPDATE services SET `name`=?, `provider`=?, `credentials`=?, `limit`=?");
        stmt.run(service.name, service.provider, service.credentials, service.limit);
        return stmt.finalize();
    }

    // Remove service from database
    removeService(id) {
        return new Promise((resolve, reject) => {
            sqlite.run("DELETE FROM services WHERE id=?", [id], (err) => {
                if (err) reject(err)
                else resolve(true);
            })
        })
    }

    // System stats
    async stats() {
        let services = await this.services();

        for (let service of services) {
            service = await this.format(service);
        }

        return services;
    }

    // Make service total stats.
    async format(service) {
        service.percent = parseFloat(((service.used / service.limit) * 100).toFixed(2))
        service.current = parseInt(await redis.get('current_service_id')) === parseInt(service.id);

        return service;
    }

    async translate(req) {
        return {
            sourceLanguage: 'EN',
            sourceText: 'Hello',
            targetLanguage: 'EN',
            translatedText: 'Hello',
            translationService: 'Google'
        }
    }
}

module.exports = Translator;