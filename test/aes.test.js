import { expect } from '@open-wc/testing';
import { runAes } from '../src/aes.js';

const keyTerms = [
  'color',
  'size'
]

describe("Aes", () => {
  const aesObj1 = [
    "grade",
    "timeInContent"
  ];
  const aesObj2 = [
    "grade",
    "timeInContent",
    "courseId"
  ];
  aesObj2.color = "courseId";
  const aesObj3 = [
    "grade"
  ]
  aesObj3.color = "grade";
  const aesObj4 = [
    "grade",
    "courseId"
  ]
  aesObj4.color = "grade";
  aesObj4.size = "courseId";
  [
    [undefined, []],
    ["grade, timeInContent", aesObj1],
    ["grade, timeInContent, color(courseId)", aesObj2],
    ["color(grade)", aesObj3],
    ["color(grade), size(courseId)", aesObj4]
  ].forEach( ([string, result]) => {
    it(`Should parse the aes string ${string}`, () => {
      const host = {};
      host.aes = string;
      const newHost = runAes(host);

      expect(newHost.aes).to.eql(result);
      keyTerms.forEach(term => {
        expect(newHost.aes[term]).to.eql(result[term])
      })
    })
  })

})
