import _ from 'lodash';
import './index';
import './index.css';
import './index.less';import MyImg from './assets/image/inline-background.png';
import csvData from './assets/datafile/test.csv';


const a = 'main.js';
console.log(a);
console.log('csv', csvData);

const b = _.join(['hello', 'webpack', '!!!'], '--');

function component() {
    const element = document.createElement('div');

    // lodash（目前通过一个 script 引入）对于执行这一行是必需的
    element.innerHTML = b;
    element.classList.add('hello');
    element.classList.add('webpack');

    // 添加图片
    const myImg = new Image();
    myImg.src = MyImg;
    myImg.width = 300;
    element.appendChild(myImg);

    return element;
}

document.body.appendChild(component());