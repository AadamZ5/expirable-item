import { Expirable } from './index';
import { expect } from 'chai';
import 'mocha';
import { resolve } from 'path';

describe('Expirable functionality', () => {

    it('should return hello world', async () => {
        let e = new Expirable<string>("Hello world!", 33);
        const s = await e.expire;
        expect(s).to.equal('Hello world!');
    });
    
    it('should expire immediately with expire_now()', () => {
        let ef = new Expirable<boolean>(true, 1000);
        ef.expire.then((b) => {
            expect(b).to.equal(true);
        });
        ef.expire_now();
    });

    it('should make a new promise when timer is reset after first expire', async () => {
        let e = new Expirable<string>("Stringy strings", 10);

        let s = await e.expire;
        e.set_expire_time(10);

        s = await e.expire; //You must await or "re-then" the expire promise, as a new one is created after the Expirable has initially expired.
        expect(s).to.equal("Stringy strings");
    })
});

describe('Expirable time-checks', () => {

    it('should not last longer than 579ms when set to 574ms', async () => {
        let timer: NodeJS.Timeout|undefined = undefined
        let tcpromise = new Promise<number>((res, rej) => {
            timer = setTimeout(resolve, 5000);
        });
        let start_date = new Date()
        let e = new Expirable<boolean>(true, 574);
        let r = await Promise.race([tcpromise, e.expire]);
        let end_date = new Date();
        expect(r).to.equal(true);
        expect(end_date.valueOf() - start_date.valueOf()).to.lessThan(579);
        if(timer){
            clearTimeout(timer);
        }
    });

    it('should not last longer than 505ms when timeout is modified to last 300ms + 200ms', async () => {
        let timer: NodeJS.Timeout|undefined = undefined
        let tcpromise = new Promise<number>((res, rej) => {
            timer = setTimeout(resolve, 5000);
        });
        let start_date = new Date()
        let e = new Expirable<boolean>(false, 1000);
        setTimeout(() => {
            e.data = true;
            e.expire_time = new Date(Date.now() + 300);
        }, 200);
        let r = await Promise.race([tcpromise, e.expire]);
        let end_date = new Date();
        expect(r).to.equal(true);
        expect(end_date.valueOf() - start_date.valueOf()).to.lessThan(505);
        if(timer){
            clearTimeout(timer);
        }
    });

    it('should not last longer than 55ms when timeout is modified to last 30ms + 20ms', async () => {
        let timer: NodeJS.Timeout|undefined = undefined
        let tcpromise = new Promise<number>((res, rej) => {
            timer = setTimeout(resolve, 5000);
        });
        let start_date = new Date()
        let e = new Expirable<boolean>(false, 1000);
        setTimeout(() => {
            e.data = true;
            e.set_expire_time(30);
        }, 20);
        let r = await Promise.race([tcpromise, e.expire]);
        let end_date = new Date();
        expect(r).to.equal(true);
        expect(end_date.valueOf() - start_date.valueOf()).to.lessThan(55);
        if(timer){
            clearTimeout(timer);
        }
    });
});

describe