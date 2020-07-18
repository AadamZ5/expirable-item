/**
 * Denotes an expirable object. Useful for wrapping data that you must do something with after a certain amount of time.
 */
export class Expirable<T> {

    /**When the Expire object was created */
    created: Date;

    private _resolve?: (value: T | PromiseLike<T> | undefined) => void;
    private _reject?: (reason?: any) => void;

    private _expired: boolean = false;

    private _expire_time: Date | undefined;
    /**When the expire observable will trigger. This property is dynamically settable. */
    get expire_time(): Date | undefined { return this._expire_time; };
    set expire_time(date: Date | undefined) {

        if(this._internal_expire_promise){
            delete this._internal_expire_promise;
            this._internal_expire_promise = undefined;
        }

        this._expire_time = date;
        if (date != undefined) {
            this._internal_expire_promise = new Promise(async (resolve, reject) => {
                let date_diff: number = date.valueOf() - (new Date()).valueOf();
                setTimeout(resolve, date_diff);
            })
            this._internal_expire_promise.then((d) => {
                this._do_expire();
            })
        }
    };


    private _do_expire() {
        this._expired = true;
        if(this._resolve){
            this._resolve(this.data);
            this._resolve = undefined;
            this._reject = undefined;
        }else{
            throw "No promise populated! This shouldn't happen!"
        }
    }

    private _internal_expire_promise?: Promise<Date>;
    data: T;
    expire: Promise<T>;

    /**
     * Creates a never-expiring wrapper with data `data`
     * @param data The data to contain
     */
    constructor(data: T);
    /**
     * Creates an expiring object in `expire` with data `data`
     * @param expire Amount of time in milliseconds to wait before expiring **or** the date at which to expire
     * @param data The data to contain
     */
    constructor(data: T, expire?: number|Date, created?: Date);
    /**
     * Default constructor. Creates an expiring object.
     * @param data The data to contain
     * @param created The time the expiring object was created. Defaults to now.
     * @param expire Amount of time in milliseconds to wait before expiring **or** the date at which to expire
     */
    constructor(data: T, expire?: number|Date, created?: Date) {

        this._make_promise();
        this.created = created ? created : new Date();
        this.data = data;
        if (expire instanceof Date) {
            this.expire_time = expire;
        }
        else if (typeof(expire) == 'number' ) {
            this.expire_time = new Date(Date.now() + expire);
        }
        else {
            this.expire_time = undefined;
        }
    }

    private _make_promise(){
        this.expire = new Promise<T>((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        })
    }

    expire_now() {
        this._do_expire();
    }
}