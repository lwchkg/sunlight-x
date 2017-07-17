// Do not pass sunlight-all-min.js to babel. It is broken after compilation.
// import assert from 'power-assert';
import {jsdom} from 'jsdom';
import {Sunlight} from '../src/sunlight.js';
const highlighter = new Sunlight.Highlighter();

describe('API tests', function() {
  it('highlights code', function() {
    const code = 'console.log("test")\nconsole.log("test")';
    const language = 'javascript';

    const document = jsdom('', {});

    const preElement = document.createElement('div');
    // Note: setting innerText does not work in jsdoc 9.4.2
    preElement.appendChild(document.createTextNode(code));
    preElement.setAttribute('class', `sunlight-highlight-${language}`);

    const dummyElement = document.createElement('div');
    dummyElement.appendChild(preElement);
    highlighter.highlightNode(preElement);
  });
});
