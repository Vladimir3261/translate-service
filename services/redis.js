/**
 * @class Client
 */
class Client {
    constructor() {
        this.events = new (require('events').EventEmitter);

        this.redis = require('redis').createClient({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        });

        this.redis.on('error', e => {
            console.log(`Something went wrong with redis connection: ${e.message}`);
            this.events.emit('error', e);
        });
        this.redis.on('connect', () => {
            console.log('Redis server connected...');
            this.events.emit('connect');
        });
        this.redis.on('reconnecting', () => {
            console.log('Redis server reconnecting...');
            this.events.emit('reconnecting')
        });
        this.redis.on('end', () => {
            console.log('Redis connection closed.');
            this.events.emit('end');
        });
    }

    on(event, callback) {
        this.events.on(event, callback);
    }

    get(itemName) {
        return new Promise((resolve, reject) => {
            this.redis.get(itemName, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            })
        })
    }

    set(item, value, duration) {
        this.redis.set(item, value, duration);
    }

    deleteKey(key) {
        return new Promise((resolve, reject) => {
            this.redis.del(key, (err) => {
                if (err) reject(err);
                else resolve();
            })
        })
    }
}

module.exports.redis = Client;