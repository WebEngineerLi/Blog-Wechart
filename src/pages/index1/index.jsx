import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { AtButton, AtTabBar } from 'taro-ui';
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/counter'
// import Blog from './Blog/index';
// import Cv from './Cv/index';
// import Messages from './Messages/index';

import './index.less'


@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  }
}))
class Index extends Component {

    config = {
    navigationBarTitleText: '博客'
  }

  state = {
    current: 1,
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleClick(index) {
    const { current } = this.state;
    switch (index) {
      case 0:
        current !== index && Taro.switchTab({
          url: '/pages/cv/index'
        })
        break;

      case 1: 
        current !== index && Taro.switchTab({
          url: '/pages/blog/index'
        })
        break;

      case 2: 
        current !== index && Taro.switchTab({
          url: '/pages/messages/index'
        })
      break;
      default:
        break;
    }
  }

  render () {
    return (
      <View className='index'>
        {/* <Button className='add_btn' onClick={this.props.add}>加个锤子</Button>
        <Button className='dec_btn' onClick={this.props.dec}> -</Button>
        <Button className='dec_btn' onClick={this.props.asyncAdd}>async</Button>
        <AtButton type='primary'>这是什么按钮</AtButton>
        <View><Text>{this.props.counter.num}</Text></View>
        <View><Text>Hello, World</Text></View>  */}
        {/* <AtTabBar
          tabList={[
            { title: '简介' },
            { title: '博客' },
            { title: '留言' }
          ]}
          current={this.state.current}
          fixed
          onClick={this.handleClick.bind(this)}
        /> */}
      </View>
    )
  }
}

export default Index
  