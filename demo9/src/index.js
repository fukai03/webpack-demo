import _ from 'lodash';


function component() {
   const element = document.createElement('div');
  const button = document.createElement('button');
  const br = document.createElement('br');

  button.innerHTML = 'Click me and look at the console!';
   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.appendChild(br);
  element.appendChild(button);

  // 懒加载
//   button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
//     const print = module.default;

//     print();
//   });

//    return element;
//  }
  // prefetch
  button.onclick = e => import(/* webpackPrefetch: true */ './print').then(module => {
    const print = module.default;

    print();
  });

   return element;
 }

document.body.appendChild(component());