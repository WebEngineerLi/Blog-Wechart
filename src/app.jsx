import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import 'taro-ui/dist/style/index.scss'
import { Provider } from '@tarojs/redux'

import Index from './pages/index1/index';
import Blog from './pages/Blog/index';
import Cv from './pages/Cv/index';
import Messages from './pages/Messages/index';

// import Index from './pages/index1/index'

import configStore from './store'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {

  config = {
    pages: [
      'pages/blog/index',
      'pages/cv/index',
      'pages/messages/index',
      'pages/detail/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'LMY - 博客小站',
      // navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: '#138fff',
      // 1e5243
    },
    tabBar: {
      color: "#666",
      selectedColor: "#1296db",
      backgroundColor: "#fafafa",
      borderStyle: 'black',
      list: [{
        pagePath: "pages/cv/index",
        text: "简介",
        iconPath: './images/cv.png',
        selectedIconPath: './images/cvSelected.png'
      }, {
        pagePath: "pages/blog/index",
        text: "博客",
        iconPath: './images/blog.png',
        selectedIconPath: './images/blogSelected.png'
      }, {
        pagePath: "pages/messages/index",
        text: "留言",
        iconPath: './images/message.png',
        selectedIconPath: './images/messageSelected.png'
      }]
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
        <Blog />
        <Cv />
        <Messages />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
