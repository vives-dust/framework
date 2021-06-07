import { Tedis } from 'tedis'

interface Options {
    host?: string,
    port?: number,
    key?: string
}

export default class RedisClient{

    private redis: Tedis
    private key: string

    constructor(options: Options = {}) {
        const { // default values
            host = 'localhost',
            port = 6379,
            key = 'test'
        } = options
        this.key = key 
        this.redis = new Tedis({ port, host})
        this.redis.on("connect", () => {
            console.log(`Connected to Redis (${host}:${port})`)
        })
        this.redis.on("error", (error) => {
            console.log("Redis error: ", error)
        })
        this.redis.on("close", () => {
            console.log("Redis connection closed")
        })
        this.redis.on("timeout", () => {
            console.log("Redis timeout...")
        })
    }

    public async push(value: string) {
        await this.redis.rpush(this.key, value)
    }

    public close() {
        this.redis.close()
    }
}