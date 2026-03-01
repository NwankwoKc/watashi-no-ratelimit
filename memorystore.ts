import { Client } from "./type"
import { error } from "./type"

/**
 * Memorystore holds info on ip address expiry date.
 * @param limit {Option} holds the default number of hits
 * @param store {Option} holds the ip address and the details of the clients
 * 
 */

class Memorystore {

    limit:number
    store:Map<number,Client>

    constructor(limit:number){
        this.store = new Map<number,Client>
        this.limit = limit
    }
    /**
     * @private add increases the hit count for a single ip or if expired resets
     * First checks if the @param ip is in the Map 
     * if not create a new key and 
     * @param ip the ip address of the current instance of the class
     */
    private add(ip:number,ws:number) {
        let check = this.store.has(ip)
        if (!check){
            const client:Client = {
                hitcount:1,
                end:this.convertend(ws)
            }
            this.store.set(ip,client)
        } else {
            let client = this.store.get(ip)

            if(client && !this.isAhead(client.end)) this.reset(ip,ws)
            if(client?.hitcount == this.limit)return //supposed to be a promisified error;
            if (client?.hitcount) client.hitcount++
        }
    }

    /**
     * @private Reset the hit count back to zero 
     * @param ip the ip address of the current instance of the class
     */
    private reset(ip:number,ws:number){
        const client = this.store.get(ip);
        if (!client) return //supposed to be a promisified error;
        const end = this.convertend(ws)
        client.hitcount = 0;
        client.end = end;
    }
    /**
     *@private convertend method to add the seconds to current date and time 
     * @param ws seconds used to signify the duration of the limit until it resets
     * @returns Date for expiring 
     * 
     */
    private convertend(ws:number):Date{
        const dt = new Date()
        const result = new Date(dt);
        result.setSeconds(result.getSeconds() + ws);
        return result;
    }
    /**
     * @private isAhead checks if the previous date is ahead of the current date and returns true if so
     * @param date previous converted date
     * @returns boolean
     */
    private isAhead(date: Date): boolean {
        return date.getTime() > new Date().getTime();
    }
}