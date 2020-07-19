
type PromiseResolveFn<T> = (value: T | PromiseLike<T> | undefined) => void;
type PromiseRejectFn = (reason?: any) => void;

class ExpireChanged extends Error{
    old_date?: Date;
    new_date?: Date;

    constructor(o?: Date, n?: Date){
        super("The expirable expire time was changed")
        this.old_date = o;
        this.new_date = n;
    }
}

/**
 * Denotes an expirable object. Useful for wrapping data that you must do something with after a certain amount of time.
 */
export class Expirable<T> {
    /**When the Expire object was created */
    created: Date;

    private _timeout?: NodeJS.Timeout = undefined;
    private _resolve?: PromiseResolveFn<T>;
    private _reject?: PromiseRejectFn;

    private _expired: boolean = false;
    get expired(): boolean {return this._expired;}

    private _expire_time: Date | undefined;
    /**When the expire observable will trigger. This property is dynamically settable. */
    get expire_time(): Date | undefined { return this._expire_time; };
    set expire_time(date: Date | undefined) {

        //If this object already expired and they decide to still set a new date, we should construct a new promise
        if(this._expired){
            this._make_promise();
            this._expired = false;
        }
        //Check for an existing timeout, and cancel it.
        if(this._timeout){
            clearTimeout(this._timeout);
            this._timeout = undefined;
        }
        //If no date, we wait forever, or the program terminates. Whichever happens first.
        if (date != undefined) {
            this._expire_time = date;
            this._wait(date);
        }
    };

    /**
     * Sets the expire time with a time delta or a specific date
     * @param time The time delta **or** the date to expire
     */
    public set_expire_time(time: Date | number | undefined){
        if (time instanceof Date) {
            this.expire_time = time;
        }
        else if (typeof(time) == 'number') {
            this.expire_time = new Date(Date.now() + time);
        }
        else {
            this.expire_time = undefined;
        }
    }

    private async _wait(date_future: Date) {

        let date_now = new Date();
        let date_diff = date_future.valueOf() - date_now.valueOf();
        this._timeout = setTimeout(() => {
            this._do_expire();
        }, date_diff);
    }


    private _do_expire() {
        if(this._expired){
            throw "This Expirable was already expired! Reset the expire_time property to reset this Expirable"
        }else{
            //
        }
        this._expired = true;
        if(this._resolve){
            this._resolve(this.data);
            this._resolve = undefined;
            this._reject = undefined;
            this._timeout = undefined;
        }else{
            if(this._reject){
                this._reject("No resolve function was populated! This shouldn't happen!");
            }else{
                throw "No promise populated! This shouldn't happen!"
            }
        }
    }

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
        this.set_expire_time(expire);
    }

    private _make_promise(){
        this.expire = new Promise<T>((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        })
    }

    expire_now() {
        this.expire_time = new Date();
    }
}