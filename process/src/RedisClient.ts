import { createClient, RedisClientType } from 'redis';

interface Options {
    host?: string,
    port?: number,
    key?: string
}

export default class RedisClient{

    private redis: RedisClientType
    private key: string

    constructor(options: Options = {}) {
        const { // default values
            host = 'localhost',
            port = 6379,
            key = 'test'
        } = options
        this.key = key 
        this.redis = createClient({
            url: `redis://${host}:${port}`,
            socket: {
              reconnectStrategy: retries => Math.min(Math.pow(2,retries) * 100, 10000)
            }
          })
        this.redis.on("connect", () => {
            console.log(`Connected to Redis (${host}:${port})`)
        })
        this.redis.on("error", (error: Error) => {
            console.log("Redis error: ", error)
        })
        this.redis.on("close", () => {
            console.log("Redis connection closed")
        })
        this.redis.on("timeout", () => {
            console.log("Redis timeout...")
        })
        this.redis.connect();
    }

    public async pull(){
        return await this.redis.blPop(this.key, 0)
    }

    public close() {
        this.redis.quit()
    }
}