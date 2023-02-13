import _ from 'lodash';
import printMe from './print.js';
import { debounce, throttle } from 'lodash-es'

function component() {
    const element = document.createElement('div');
    const btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = '点我进行打印!';
    btn.onclick = throttle(printMe,3000);

    element.appendChild(btn);

    return element;
}

document.body.appendChild(component());

// if (module.hot) {
//     module.hot.accept('./print.js', function() {
//       console.log('Accepting the updated printMe module!');
//       printMe();
//     })
// }