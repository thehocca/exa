const redis = require("redis");
const { promisify } = require("util");
require('dotenv').config({path: './_env/apis.env'}).parsed;

class RedisTest {
    constructor() {
        if (!RedisTest.instance) {

            this.connectObject = {
                host: process.env.REDIS_Test_IP,
                port: process.env.REDIS_Test_PORT,
                auth_pass: process.env.REDIS_Test_PASS
            };

            this.client = redis.createClient(this.connectObject)

            this.client.hgetAsync = promisify(this.client.hget).bind(this.client);
            this.client.getAsync = promisify(this.client.get).bind(this.client);

            console.log("Starting to connect REDIS...")
            this.client
                .on('error', err => console.log('Redis Client Error', err))
                .on('connect', () => {
                    console.log("Test REDIS CONNECTION SUCCESS...")
                });

            this.subscriber = redis.createClient(this.connectObject);

            this.subscriber
                .on('error', err => console.log('Redis SUB Error', err))
                .on('connect', () => {
                    console.log("Test REDIS SUBSCRIBER CONNECTED...");
                });

            // --- ACTIONS kanalını dinle ---
            this.subscriber.subscribe("ACTIONS");

            this.subscriber.on("message", (channel, message) => {
                if (channel !== "ACTIONS") return;

                try {
                    const data = JSON.parse(message);

                    const detail = data.detail;
                    const userId = data.userId;


                    // Temizlenecek detaylar
                    const resetEvents = [
                        "UNCREDITED",
                        "CREDITED",
                    ];

                    if (resetEvents.includes(detail) && userId) {
                        console.log("🔥 ACTIONS RECEIVED:", detail, "user:", userId);
                        // Casino25 cached balance reset
                        try {
                            const { clientInstance } = require("../../services/client/index");
                            clientInstance.Users.delete(userId);
                            console.log("🧹 tempPlayerBalance reset for", userId);

                        } catch (err) {
                            console.log("Casino25 temp reset error:", err);
                        }

                        const message = JSON.stringify({
                            "id": userId,
                            "message": "Balance Update by Partner",
                            "msgid": 'balance_withdraw_deposit',
                            "exit": false
                        });

                        this.publishMessage('noBet', message);
                    }


                } catch (err) {
                    console.log("ACTIONS parse error:", err.message);
                }
            });
            RedisTest.instance = this;
        }

        return RedisTest.instance;
    }




    async publishMessage(topic,message){
        this.client.publish(topic,message)
    }

    async getUSER(userId){
        return await this.client.hgetAsync('online', userId+"");
    }

    async get(key) {
        return await this.client.get(key);
    }

    async set(key, value) {
        return await this.client.set(key, value);
    }

}

const redisTest = new RedisTest();
Object.freeze(redisTest);

module.exports = { redisTest };
