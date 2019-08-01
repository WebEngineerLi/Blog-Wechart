
import Taro, { Component } from '@tarojs/taro';
import HImg from '../images/logo.png'
import { View } from '@tarojs/components'
import 'animate.css';
import './index.less';

class Header extends Component {
  render() {
    return (
      <View className="header animated once slideInDown">
        <Image className="logo" src={HImg}/>
      </View>
    )
  }
}
export default Header;