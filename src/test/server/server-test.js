/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
/* eslint-disable eol-last */
import { should } from 'chai';
import { describe, it, beforeEach } from 'mocha';

should();
let store;

describe('App State', () => {
  describe('Dog', () => {
    beforeEach(() => {
      store = {name :'Collie'};
    });
    describe('makeBark', () => {
      it('DESCRIPTION', () => {
        store.hasBarked().should.be.false;
        store.bark();
        store.hasBarked().should.be.true;
      });
    });
  });
});
