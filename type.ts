
export type Options<T> = {

}

export type Client = {
    hitcount:number
    end:Date
}

export interface error extends Error {
    message:string
}