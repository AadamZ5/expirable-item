import { Expirable } from './index';
import { expect } from 'chai';
import 'mocha';

describe('Expirable string 33 milliseconds', () => {

    it('should return hello world', async () => {
        let e = new Expirable<string>("Hello world!", 33);
        const s = await e.expire;
        expect(s).to.equal('Hello world!');
    });
});