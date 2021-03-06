const assert = require('assertthat');

const Parser = require('jison').Parser;
const fs = require('fs');
const grammar = fs.readFileSync('./src/grammar.jison', 'utf8');
const treesWalker = require('../src/lib/treesWalker.js');
const variables = {};

variables.functions = {};

variables.list = {};
variables.parent = variables;

const inputOutputMap = {
  '1+2;': [3],
  '2-1;': [1],
  '2*2;': [4],
  '2/1;': [2],
  '2%1;': [0],
  '2+2 4-4;': [4, 0],
  'a=20;': [20],
  'a=20; b=40; a+b': [20, 40, 60],
  'a=20 b=a a+b;': [20, 20, 40],
  'a=30; b=a; a=40; b;': [30, 30, 40, 30],
  'true; false': [true, false],
  'a=2; b=4; a<b': [2, 4, true],
  'a=2; b=2; a<=b': [2, 2, true],
  'a=2; b=2; a>=b': [2, 2, true],
  'a=true; if(a) { a; }': [true, true]
};

const assertInput = function(input, output) {
  const trees = new Parser(grammar).parse(input);
  const result = treesWalker.walk(trees, variables);

  result.forEach((exprOutput, index) => {
    assert.that(exprOutput.value).is.equalTo(output[index]);
  });
};

describe('Integration Test', () => {
  it('should allow all Javascript expressions', () => {
    Object.keys(inputOutputMap).forEach((input) => {
      assertInput(input, inputOutputMap[input]);
    });
  });
});