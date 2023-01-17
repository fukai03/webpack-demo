import { cube } from './math.js';

function component() {
 const element = document.createElement('pre');

 element.innerHTML = [
   'Hello webpack!',
   '5 cubed is equal to ' + cube(5)
 ].join('\n\n');
 console.log(cube(3));

  return element;
}

document.body.appendChild(component());