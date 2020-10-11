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
    dataRate: string,
    codingRate: string,
    airtime: number,
    rssi: number,
    snr: number,
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
            }
        }
    }
})()

function processData(input :any) :Data {
    return {
        temperature: input.payload_fields.temperature,
        pressure: input.payload_fields.pressure,
        humidity: input.payload_fields.humidity,
        battery: input.payload_fields.batteryVoltage,
        dev_id: input.dev_id,
        hardwareSerial: input.hardware_serial,

        time: input.metadata.time,
        frequency: input.metadata.frequency,
        dataRate: input.metadata.data_rate,
        codingRate: input.metadata.coding_rate,
        airtime: input.metadata.airtime,
        rssi: getBestRssi(input.metadata.gateways),
        snr: getBestSnr(input.metadata.gateways),
        counter: input.counter,
        gateways: input.metadata.gateways.length
    }
}

function getBestRssi(gateways :any) :number{
    const rssis = gateways.map( (gateway :any) => gateway.rssi)
    return Math.min(...rssis)
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

