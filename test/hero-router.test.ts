import * as chai from 'chai';
import { suite, test } from 'mocha-typescript';
import chaiHttp = require('chai-http');

import { API } from './../src/API';
import { IHero } from './../src/structures/hero.interface';


@suite
class HeroRouter {
  API: Express.Application = API.bootstrap();

   static before(): void {
    chai.should();
    chai.use(chaiHttp);
  }

  @test('GET /heroes should respond with array and include Wolverine')
  GET_$heroes(): ChaiHttp.FinishedRequest {
    return chai.request(this.API).get('/heroes')
      .then((res: ChaiHttp.Response) => {
        res.should.be.json;
        res.status.should.equal(200);
        res.body.should.be.an('array').and.have.length(5);
        let Wolverine: IHero = res.body.find((hero: IHero) => hero.name === 'Wolverine');
        Wolverine.should.exist.and.have.all.keys([
          'id',
          'name',
          'aliases',
          'occupation',
          'gender',
          'height',
          'hair',
          'eyes',
          'powers',
        ]);
      });
  }

  @test('GET /heroes/:id should respond with a single hero')
  GET_$heroes$id(): ChaiHttp.FinishedRequest {
    return chai.request(this.API).get('/heroes/1')
      .then((res: ChaiHttp.Response) => {
        res.should.be.json;
        res.status.should.equal(200);
        res.body.should.be.an('Object');
        res.body.hero.name.should.equal('Luke Cage');
      });
  }
}
