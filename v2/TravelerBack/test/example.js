//https://scotch.io/tutorials/nodejs-tests-mocking-http-requests
var test = require('unit.js');
//const lineController = require('../src/controllers/line-controller');
var http = require('http');
const getAllLines = require('./getBusyBusAPI').getAllLines;
describe('Learning by the example', function(){
  it('example variable', function(){
    // just for example of tested value
    var example = 'hello world';
    test
      .string(example)
        .startsWith('hello')
        .match(/[a-z]/)
      .given(example = 'you are welcome')
        .string(example)
          .endsWith('welcome')
          .contains('you')
      .when('"example" becomes an object', function(){
        example = {
          message: 'hello world',
          name: 'Nico',
          job: 'developper',
          from: 'France'
        };
      })
      .then('test the "example" object', function(){
        test
          .object(example)
            .hasValue('developper')
            .hasProperty('name')
            .hasProperty('from', 'France')
            .contains({message: 'hello world'})
        ;
      })
      .if(example = 'bad value')
        .error(function(){
          example.badMethod();
        })
    ;
  });

});