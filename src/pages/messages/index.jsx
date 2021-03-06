import Taro, { Component } from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import { AtForm, AtTextarea, AtButton, AtMessage, AtAvatar } from 'taro-ui'
import { connect } from '@tarojs/redux'
import MessageList from '../../components/MessageList';
import moment from 'moment';
import _ from 'lodash';
// import LoginModal from '../../components/LoginModal';
import { actions, selectors } from '../../model/message';
import Header from '../../components/Header';
import './index.less';
import Comment from '../../components/Comment';
import randomColor from '../../utils/randomColor';

const mapStateToProps = (state) => ({
  messageList: selectors.getMessageList(state),
  pagination: selectors.getPagination(state),
  status: selectors.getStatus(state)
})
const mapDispatchToProps = dispatch => ({
  dispatch,
  getMessageList(params) {
    dispatch(actions.getMessageList(params))
  },
  dump(params) {
    dispatch(actions.dump(params))
  },
  login(params, callback) {
    return dispatch(actions.login(params, callback))
  },
  register(params) {
    return dispatch(actions.register(params))
  },
  checkUniq(params, callback) {
    return dispatch(actions.checkUniq(params, callback))
  },
  postMessage(params) {
    return dispatch(actions.postMessage(params))
  },
  deleteMessage(params) {
    return dispatch(actions.deleteMessage(params))
  },
  isOpenIdExist(params) {
    return dispatch(actions.isOpenIdExist(params))
  },
  updateUser(params) {
    return dispatch(actions.updateUser(params))
  }
})
@connect(mapStateToProps, mapDispatchToProps)

class Messages extends Component {

  config = {
    backgroundTextStyle: 'light',
    navigationBarTitleText: 'LMY - 博客留言',
  }
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleReplay = this.handleReplay.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.getUserInfo = this.getUserInfo.bind(this)
    this.mapColor = {}
  }

  state = {
    value: '',
    visible: false,
    parentId: '',
    email: '',
    id: ''
  }

  componentDidMount() {
    this.props.getMessageList();
  }

  generateColor(user) {
    if (!this.mapColor[user]) {
      const color = randomColor();
      this.mapColor[user] = color
      return color;
    } else {
      return this.mapColor[user];
    }
  }

  handleReplay(item) {
    const { id, userInfo: { email } = {} } = item;
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    })
    this.setState({ parentId: id, replayEmail: email, value: `@${item.userInfo.name}: ` })
  }

  async handleDelete(item) {
    const res = await this.props.deleteMessage({ id: item.id })
    if (res) {
      Taro.atMessage({
        message: '删除成功',
        type: 'success'
      })
    }
  }

  handleChange(node) {
    this.setState({ value: node.detail.value })
  }

  async handleSubmit() {
    const userId = Taro.getStorageSync('userId');
    const { state: { value, parentId, replayEmail } } = this
    if (!value) {
      Taro.atMessage({
        'message': '请收入您的留言内容哦',
        'type': 'warning',
      })
      return;
    }
    const res = await this.props.postMessage({
      userId,
      content: value,
      parentId,
      replayEmail
    });
    if (res) {
      this.setState({ value: '' })
    }
  }

  async getUserInfo(res) {
    const { code } = await Taro.login();
    const loginRes = await this.props.login({
      appid: 'wx635a7f9ecdca174c',
      secret: '5844906e1aa9b5cb11cebf655cf9428f',
      jsCode: code
    })
    // 获取用户唯一标识
    const { data: { data: { openid } = {}, success } } = loginRes;
    if (success) {
      const { detail: { userInfo } } = res;
      const name = userInfo.nickName;
      const uniq = await this.props.isOpenIdExist({ id: openid })
      const params = {
        name,
        avatar: userInfo.avatarUrl,
        password: '123456',
        weburl: '',
        email: '',
        id: openid
      }
      let rst = ''
      if (!uniq) {
        rst = await this.props.register(params)
      } else {
        rst = await this.props.updateUser(params)
      }
      if (rst) {
        Taro.atMessage({
          'message': '登录成功',
          'type': 'success',
        })
        Taro.setStorageSync('user', name)
        Taro.setStorageSync('userId', openid)
        this.forceUpdate();
        return;
      }
      this.forceUpdate();
    } else {
      Taro.atMessage({
        'message': '登录失败',
        'type': 'fail',
      })
    }
  }

  handleLogin(e) { 
    const { detail: { userInfo, signature } } = e;
    const info = {
      detail: {
        userInfo: {
          ...userInfo,
          signature
        }
      }
    }
    const jthis = this;
    Taro.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          // 未授权 可以直接使用用户信息
          jthis.getUserInfo(info);
        } else {
          Taro.getUserInfo({
            success: (r) => {
              const { userInfo, signature } = r;
              jthis.getUserInfo({ detail: { userInfo: { ...userInfo, signature } } })
            }
          })
        }
      }
    })
  }

  loadMore() {
    const { pagination: { current, pageSize, total } } = this.props;
    let newPageSize = pageSize + 10;
    if (newPageSize > total) {
      newPageSize = total;
    }
    this.props.dump({ status: 'loading', pagination: { current, pageSize: newPageSize } })
    this.props.getMessageList();
  }

  renderChildren(messageList, id = '') {
    if (messageList.length === 0) {
      return null;
    }
    const list = _.cloneDeep(messageList);
    const userId = Taro.getStorageSync('userId');
    return list.map((item, index) => {
      const child = _.cloneDeep(item);
      if (id) {
        child.id = id;
      }
      return (
        <View className="comment" key={item.id}>
          <View>
            <Comment
              author={child.userInfo.name}
              dateTime={child.createdTime}
              content={child.content}
              renderActions={
                <View className="actions">
                  {child.userInfo && child.userInfo.userId === userId ? <View style={{ marginLeft: '15px' }} onClick={() => { this.handleDelete(item) }}>删除</View> : <View></View>}
                </View>
              }
              renderAvatars={
                child.userInfo && child.userInfo.avatar ? 
                  <AtAvatar className="avatar-img" circle size="small" image={child.userInfo.avatar}></AtAvatar>
                :
                <AtAvatar style={{ backgroundColor: this.generateColor(child.userId) }} className="avatar-img" circle size="small" text={item.userInfo.name[0]}></AtAvatar>
              }
              // renderAvatars={
              //   // child.userInfo && child.userInfo.avatar ? 
              //   // // <AtAvatar circle size="small" image={child.userInfo.avatar}></AtAvatar>
              //   // <Text>111</Text>
              //   // :
              //   <View style={{ background: this.generateColor(child.user) }} className="avatar">
              //     <View>{child.user[0]}</View>
              //   </View>
              // }
            >
            </Comment>
          </View>
        </View>
      )
    })
  }

  renderMessages(messageList, id = '') {
    const { pagination: { total } } = this.props;
    if (messageList.length === 0) {
      return null;
    }
    const userId = Taro.getStorageSync('userId')
    return messageList.map((item, index) => {
      const floor = total - index;
      if (id) {
        item.id = id;
      }
      return (
        <View className="comment" key={item.id}>
          <View className="floor">第{floor}楼</View>
          <View>
            <Comment
              author={item.userInfo.name}
              dateTime={item.createdTime}
              content={item.content}
              renderActions={
                <View className="actions">
                  <View onClick={() => { this.handleReplay(item) }}>回复</View>
                  {item.userInfo && item.userInfo.userId === userId ? <View style={{ marginLeft: '15px' }} onClick={() => { this.handleDelete(item) }}>删除</View> : <View></View>}
                </View>
              } 
              renderAvatars={
                item.userInfo && item.userInfo.avatar ? 
                  <AtAvatar className="avatar-img" circle size="small" image={item.userInfo.avatar}></AtAvatar>
                :
                // <View style={{ background: this.generateColor(item.user) }} className="avatar">
                //   <View>{item.user[0]}</View>
                // </View>
                <AtAvatar style={{ backgroundColor: this.generateColor(item.userId) }} className="avatar-img" circle size="small" text={item.userInfo.name}></AtAvatar>
              }
            >
              {item.children && item.children.length > 0 && this.renderChildren(item.children, item.id)}
            </Comment>
          </View>
        </View>
      )
    })
  }

  renderList() {
    const arr = [1, 2, 3, 4, 5, 6];
    return arr.map(item => (
      <View>{item}</View>
    ))
  }

  render() {
    const { value, visible } = this.state;
    const { messageList, status } = this.props;
    const user = Taro.getStorageSync('user') || '';
    return (
      <View className="wrap">
        <Header />
        <AtMessage />
        <AtForm
          onSubmit={this.handleSubmit}
          onReset={this.handleReset}
          style={{ position: 'static' }}
        >
          <View className="textarea">
            <AtTextarea
              value={value}
              onChange={this.handleChange}
              height={250}
              className="area"
              placeholder="说点话吧"
            />
            <View className="header">
              <View className="login-tip">{user ? `欢迎 ${user}` : '请您先登录'}</View>
              {
                !user ?
                <Button className="login-btn" id='login-btn' openType="getUserInfo" lang="zh_CN"  onGetUserInfo={this.handleLogin}>登录</Button>
                :
                <View onClick={() => {
                  Taro.clearStorageSync();
                  Taro.atMessage({
                    'message': '退出成功',
                    'type': 'success',
                  })
                  this.forceUpdate();
                }}>退出</View>
              }
            </View>
            <AtButton disabled={!user} onClick={() => this.handleSubmit()} size="small" className="submit-message" type="primary">提交留言</AtButton>
          </View>
        </AtForm>
        <View className="comment-wrap">
          {this.renderMessages(messageList)}
        </View>
        {{
          'loading': <View className="text">加载中</View>,
          'more': <AtButton onClick={this.loadMore}>加载更多</AtButton>,
          'noMore': <View className="text">没有更多了</View>
        }[status]}
        {visible &&
          <LoginModal
            visible={visible}
          />
        }
      </View>
    )
  }
}

export default Messages;