import mqtt from 'mqtt'
import { EventEmitter } from 'events'

interface Options {
    host?: string
    port?: number
    protocol?: string
    topic?: string
    username?: string
    password?: string
}

export default class MqttClient extends EventEmitter{

    private client: mqtt.MqttClient
    private topic: string

    constructor( options: Options = {}) {
        super()
        const { // default values
            protocol = 'mqtt',
            host = 'localhost',
            port = 1883,
            topic = 'test',
            username,
            password
        } = options
        this.topic = topic
        this.client = mqtt.connect({ host, port, protocol, username, password})
        this.client.on('connect', this.onConnect)
        this.client.on('message', this.onMessage)
        this.client.on('error', this.onError)
    }

    private onConnect = () => {
        console.log('MQTT connected')
        this.client.subscribe(this.topic)
    }

    private onMessage = ( topic: string, message: Buffer) => {
        this.emit('message', message.toString(), topic)
    }

    public close() :Promise<void>{
        this.client.unsubscribe(this.topic)
        return new Promise( (resolve) => {
            this.client.end( false, {},  () => {
                resolve()
            })
        })
    }

    private onError(error: Error) {
        console.log("MQTT Error", error)
    }
}