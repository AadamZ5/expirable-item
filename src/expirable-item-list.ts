import { Expirable } from "./expirable-item";

class ExpirableItemList<T> implements AsyncGenerator<T>{

    private _items: Expirable<T>[];

    constructor(){
    }

    next(): Promise<IteratorResult<T, any>>{
        throw new Error("Method not implemented.");
    }
    return(value: any): Promise<IteratorResult<T, any>> {
        throw new Error("Method not implemented.");
    }
    throw(e: any): Promise<IteratorResult<T, any>> {
        throw new Error("Method not implemented.");
    }
    [Symbol.asyncIterator](): AsyncGenerator<T, any, unknown> {
        throw new Error("Method not implemented.");
    }

}