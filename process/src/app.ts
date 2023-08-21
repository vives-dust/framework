import Redis from './RedisClient'
import InfluxDB from './InfluxDbClient'
import processDustData from './interfaces/dust-v3.interface';
import processISFData from './interfaces/sapflow-isf.interface';

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
let data = {};

( async () => {
    while(!stop){
        const input = JSON.parse((await redis.pull())[1])
        if( input !== null){
            try{
                // Check which FPort is used on TTN
                switch (input.uplink_message.f_port){
                    case 1:
                        // FPort = 1 are the DUST v3 Soil Moisture Sensors
                        data = processDustData(input);
                        break;
                    case 10:
                        // FPort = 10 are the Decentlab SapFlow Sensors
                        data = processISFData(input);
                        break;
                    default:
                        console.error('Data was sent through non-assigned FPort', input);
                        break;                    
                }
                influxdb.save(data)
            } catch (error) {
                console.error('Input has wrong format', input)
                console.error(error)
            }
        }
    }
})()

process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing redis connection.');
    redis.close();
    stop = true;
});

