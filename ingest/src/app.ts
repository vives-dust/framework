import Redis from './RedisClient'
import Mqtt from './MqttClient'

const mqtt = new Mqtt( {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT ? parseInt(<string>process.env.MQTT_PORT) : undefined,
    protocol: process.env.MQTT_PROTOCOL,
    topic: process.env.MQTT_TOPIC,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
})
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(<string>process.env.REDIS_PORT) : undefined,
    key: process.env.REDIS_KEY
})

console.log('Ingest ready...')

mqtt.on('message', (message, topic) => {
    redis.push(message)
    console.log('message:', message)
})

process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing MQTT connection.');
    mqtt.close();
});
