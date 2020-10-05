console.log("Hello world")

import { Tedis } from 'tedis'

const host: string = process.env.REDIS_HOST || '127.0.0.1'
const port: number = parseInt(<string>process.env.REDIS_PORT, 10) || 6379

const tedis = new Tedis({ port, host });

(async () => {
    console.log("*** CONSUMER ***")
    while (true) {
        const message  = await tedis.blpop(0, 'temp-sensor-iot-app')
        console.log(message[1])
    }
})()