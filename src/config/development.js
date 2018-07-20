

function createMongoUri() {
  if (process.env.MONGOLAB_URI) return process.env.MONGOLAB_URI;
  if (process.env.MONGOHQ_URL) return process.env.MONGOHQ_URL;
  if (process.env.OPENSHIFT_MONGODB_DB_URL && process.env.OPENSHIFT_APP_NAME) return process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
  if (process.env.MONGODB_USER
      && process.env.MONGODB_PASSWORD
      && process.env.DATABASE_SERVICE_NAME
      && process.env.MONGODB_DATABASE) {
      return `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.DATABASE_SERVICE_NAME}/${process.env.MONGODB_DATABASE}`; }
  return 'mongodb://localhost/network-server-dev';
}

function createMqttClientId() {
  if (process.env.MQTT_CLIENTID) return process.env.MQTT_CLIENTIDM;
  if (process.env.MQTT_CLIENTSUFFIX) return `network-server_${process.env.MQTT_CLIENTSUFFIX}`;
  return 'network-server-dev';
}

// Development specific configuration
// ==================================
module.exports = {

    // MongoDB connection options
  mongo: {
    uri: createMongoUri(),
  },

  mqtt: {
    host: process.env.MQTT_ADDR || '192.168.94.200',
    port: process.env.MQTT_PORT || 8883,
    protocol: process.env.MQTT_PROTOCOL || 'mqtts', // const myClientId = 'dashboard_' + uuid();
    clientId: createMqttClientId(), // Math.random().toString(16).substr(2, 8),
  },

    // Greylog Config
  graylog: {
    uri: process.env.GRAYLOG_URL ||
        '192.168.94.200',
    port: process.env.GRAYLOG_PORT ||
        3515,
    enabled: process.env.GRAYLOG_ENABLED ||
        true,
    tag: process.env.GRAYLOG_IMAGE_NAME ||
        'loraman-evelynn-src-dev',
  },

};
