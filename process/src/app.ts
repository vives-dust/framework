import Redis from './RedisClient'
import InfluxDB from './InfluxDbClient'
import processDustData, { saveDustData } from './interfaces/dust-v3.interface';
import processISFData, { saveISFData } from './interfaces/sapflow-isf.interface';
import processDiverData, {saveDiverData } from './interfaces/divers.interface';

interface dataProcessing {
    process: Function,
    save: Function
}

const deviceFPortMap: { [key: number] : dataProcessing } = {
    // FPort for each type of sensordevice
    1: {    process: processDustData,
            save: saveDustData },
    2: {    process: processDiverData,
            save: saveDiverData },
    10: {   process: processISFData,
            save: saveISFData },
}

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(<string>process.env.REDIS_PORT) : undefined,
    key: process.env.REDIS_KEY
});

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
        const result = await redis.pull()
        console.log(result)
        if(result === null) { continue }
        const input = JSON.parse(result['element'] || "{}")
        if( Object.keys(input).length === 0) { continue }
        const fport = input.uplink_message.f_port
        if( !(fport in deviceFPortMap)) {
            console.error('Data was sent through non-assigned FPort', input)
            continue
        }
        try {
            // Process the input, create a point for saving in influx and save the point for each specific sensordevice
            const save = deviceFPortMap[fport].save
            const process = deviceFPortMap[fport].process
            const point = save(process(input))
            influxdb.save(point)
        } catch (error) {
            console.error('Input has wrong format', input)
            console.error(error)
        }
    }
})()

process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing redis connection.');
    redis.close();
    stop = true;
});

