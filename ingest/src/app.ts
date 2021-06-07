import Redis from './RedisClient'
import Mqtt from './MqttClient'

const mqtt = new Mqtt( {
    host: 'eu.thethings.network',
    port: process.env.MQTT_PORT ? parseInt(<string>process.env.MQTT_PORT) : undefined,
    protocol: process.env.MQTT_PROTOCOL,
    topic: '+/devices/+/up',
    username: 'micro-weather-station',
    password: 'ttn-account-v2._mqNsGv9UNbVzyXhumlhXnDEZhInxDQPmXZYBwv9RyY'
})
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(<string>process.env.REDIS_PORT) : undefined,
    key: process.env.REDIS_KEY
})

let stop = false;

console.log('Ingest ready...')
console.log(mqtt)

mqtt.on('message', (message, topic) => {
    redis.push(message)
    console.log('message:', message)
})

process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing MQTT connection.');
    mqtt.close()
    .then( () => { 
        console.log('MQTT connection closed.')
        console.log('Closing Redis connection.')
        redis.close() 
        console.log('Redis connection closed.')
    })
});
