import Redis from './RedisClient'
import InfluxDB from './InfluxDbClient'

interface Data {
    moistureLevel_1: number,
    moistureLevel_2: number,
    moistureLevel_3: number,
    moistureLevel_4: number,
    battery: number,
    internalTemperature: number,
    dev_id: string,
    hardwareSerial: string,

    time: string,
    frequency: number,
    codingRate: string,
    airtime: number,
    rssi: number,
    snr: number,
    spreadFactor: number,
    counter: number,
    gateways: number,
}

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(<string>process.env.REDIS_PORT) : undefined,
    key: process.env.REDIS_KEY
})

const influxdb = new InfluxDB({
    host: process.env.INFLUXDB_HOST,
    port: process.env.INFLUXDB_PORT ? parseInt(<string>process.env.INFLUXDB_PORT) : undefined,
    bucket: process.env.INFLUXDB_BUCKET,
    org: process.env.INFLUXDB_ORG,
    token: process.env.INFLUXDB_TOKEN
});

// console.log('Processing ready...')
let stop = false;

( async () => {
    while(!stop){
        const input = (await redis.pull())[1]
        if( input !== null){
            try{
                const data = processData(JSON.parse(input))
                influxdb.save(data)
            } catch (error) {
                console.error('input has wrong format', input)
                console.error(error)
            }
        }
    }
})()

function processData(input :any) :Data {
    return {
        moistureLevel_1: input.uplink_message.decoded_payload.moistureLevel_1,
        moistureLevel_2: input.uplink_message.decoded_payload.moistureLevel_2,
        moistureLevel_3: input.uplink_message.decoded_payload.moistureLevel_3,
        moistureLevel_4: input.uplink_message.decoded_payload.moistureLevel_4,
        battery: input.uplink_message.decoded_payload.batteryVoltage,
        internalTemperature: input.uplink_message.decoded_payload.internalTemperature,
        dev_id: input.end_device_ids.device_id,
        hardwareSerial: input.end_device_ids.dev_eui,

        time: input.received_at,
        frequency: input.uplink_message.settings.frequency,
        codingRate: input.uplink_message.settings.coding_rate,
        airtime: (input.uplink_message.consumed_airtime).replace('s', ''),
        rssi: getBestRssi(input.uplink_message.rx_metadata),
        snr: getBestSnr(input.uplink_message.rx_metadata),
        spreadFactor: input.uplink_message.settings.data_rate.lora.spreading_factor,
        counter: input.uplink_message.f_cnt,
        gateways: input.uplink_message.rx_metadata.filter( (g :any) => g.gateway_id !== "packetbroker").length
    }
}

function getBestRssi(gateways :any) :number{
    const rssis = gateways.map( (gateway :any) => gateway.rssi)
    return Math.max(...rssis)
}

function getBestSnr(gateways :any) :number{
    const snrs = gateways.map( (gateway : any) => gateway.snr)
    return Math.max(...snrs)
}

process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing redis connection.');
    redis.close();
    stop = true;
});

