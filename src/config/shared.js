
module.exports = {
    redis: {
        address: process.env.REDIS_LINK || '192.168.94.200',
        port: process.env.REDIS_PORT || 6379,
        username: process.env.REDIS_USER || '',
        password: process.env.REDIS_PASS || '',
    },
    elastic: {
        host:  process.env.ELASTIC_HOST || 'localhost:9200',
        log:  process.env.ELASTIC_LOG || 'trace',
    }

};
