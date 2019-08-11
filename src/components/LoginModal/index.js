
import Taro, { Component, useState } from '@tarojs/taro';
import { AtForm, AtActionSheet, AtActionSheetItem, AtInput, AtButton } from 'taro-ui';
import HImg from '../../images/logo.png'
import { View } from '@tarojs/components'
import 'animate.css';
import './index.less';

const LoginModal = (props) => {
  const { visible } = props;
  const [nickName, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('login');
  const renderLogin = () => {
    return (
      <AtForm
        style={{ position: 'static' }}
      >
        <AtInput
          name='nickName'
          title='昵称'
          type='text'
          placeholder='请输入昵称'
          value={nickName}
          onChange={(nickName) => { setPassword(nickName) }}
        />
        <AtInput
          name='password'
          title='密码'
          type='password'
          placeholder='请输入密码'
          value={password}
          onChange={(password) => { setPassword(password) }}
        />
        <View className="register" onClick={() => setStatus('register')}>暂无账号注册</View>
        <AtButton type='primary'>确定</AtButton>
        <AtButton>取消</AtButton>
      </AtForm>
    )
  }
  // const renderRegister = () => (

  // )
  return (
    <AtActionSheet isOpened={visible}>
      <View className="login-wrap">
        <View className="title">{`用户${status === 'login' ? '登录' : '注册'}`}</View>
        {{
          'login': renderLogin(),
          // 'register': renderRegister()
        }[status]}
      </View>
    </AtActionSheet>
    // <AtModal isOpened={visible}>
    //   <AtModalHeader>{`用户${status === 'login' ? '登录' : '注册'}`}</AtModalHeader>
    //   <AtModalContent>
    // <View className="form">
    //   <AtForm>
    //     <AtInput
    //       name='nickName'
    //       title='昵称'
    //       type='text'
    //       placeholder='请输入昵称'
    //       value={this.state.nickName}
    //       // onChange={this.handleChange.bind(this)}
    //     />
    //     <AtInput
    //       name='password'
    //       title='密码'
    //       type='password'
    //       placeholder='请输入密码'
    //       value={this.state.password}
    //       // onChange={this.handleChange.bind(this)}
    //     />
    //   </AtForm>
    // </View>
    //   </AtModalContent>
    //   <AtModalAction>
    //     <Button>取消</Button>
    //     <Button>确定</Button>
    //   </AtModalAction>
    // </AtModal>
  )
}
export default LoginModal;