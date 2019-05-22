import test from 'ava';
import routing from './routing';
import express from 'express';
import koa from 'koa';
import request from 'supertest';
import { fake } from 'sinon';

const frameworks = [ 'express', 'koa' ];

test('Routing :: should have framework methods', t => {
  frameworks.forEach(framework =>
    t.true(typeof routing[framework] === 'function', `routing#${framework} exists`));
});

test('Routing :: framework methods should require app argument', t => {
  frameworks.forEach(framework =>
    t.throws(routing[framework], 'Routing requires an app instance passed as the first argument'));
});

[
  [ 'express', express ],
  [ 'koa', koa ]
].forEach(([ name, constructor ]) => {
  test(`Routing :: ${name} smoke test`, async (t) => {
    const mod = routing[name],
          fakeFn = fake();

    let app = mod(name === 'koa' ? new constructor() : constructor(), {
      framework: name,
      statusUrl: '/__status__'
    }, (arg) => {
      fakeFn(arg);
      return { status: 'ok' };
    });

    let response = await request(name === 'koa' ? app.listen() : app)
    .get('/__status__/');

    t.is(response.status, 200);
    t.is(response.body.status, 'ok');
    t.is(fakeFn.callCount, 1);
  });
});
