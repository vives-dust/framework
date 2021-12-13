import Redis from './RedisClient'
import InfluxDB from './InfluxDbClient'

interface Data {
    temperature: number,
    pressure: number,
    humidity: number,
    battery: number,
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
    database: process.env.INFLUXDB_DB
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
        temperature: input.uplink_message.decoded_payload.temperature,
        pressure: input.uplink_message.decoded_payload.pressure,
        humidity: input.uplink_message.decoded_payload.humidity,
        battery: input.uplink_message.decoded_payload.batteryVoltage,
        dev_id: input.end_device_ids.device_id,
        hardwareSerial: input.end_device_ids.dev_eui,

        time: input.received_at,
        frequency: input.uplink_message.settings.frequency,
        codingRate: input.uplink_message.settings.coding_rate,
        airtime: (input.uplink_message.consumed_airtime).replace('s', ''),
        rssi: getBestRssi(input.uplink_message.rx_metadata),
        snr: getBestSnr(input.uplink_message.rx_metadata),
        spreadFactor: input.uplink_message.settings.data_rate.lora.spreading_factor,
        counter: input.uplink.message.f_cnt,
        gateways: input.metadata.gateways.length
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

