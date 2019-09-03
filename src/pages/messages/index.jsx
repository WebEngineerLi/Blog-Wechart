import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtForm, AtTextarea, AtButton, AtLoadMore, AtToast, AtMessage } from 'taro-ui'
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
    dispatch(actions.login(params, callback))
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
    console.log('item:', item);

    const { id, userInfo: { email } = {} } = item;
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    })
    this.setState({ parentId: id, replayEmail: email, value: `@${item.user.split('-')[0]}: ` })
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
    const user = Taro.getStorageSync('user');
    const { state: { value, parentId, replayEmail } } = this
    if (!value) {
      Taro.atMessage({
        'message': '请收入您的留言内容哦',
        'type': 'warning',
      })
      return;
    }
    const res = await this.props.postMessage({
      user,
      content: value,
      parentId,
      replayEmail
    });
    if (res) {
      this.setState({ value: '' })
    }
  }

  getUserInfo() {
    Taro.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN',
      success: async (res) => {
        const { userInfo } = res;
        const name = `${userInfo.nickName}-${res.signature}`;
        const uniq = await this.props.checkUniq({ name })
        if (!uniq) {
          const params = {
            name,
            avatar: userInfo.avatarUrl,
            password: '123456',
            weburl: '',
            email: '',
          }
          const res = await this.props.register(params)
          if (res) {
            Taro.atMessage({
              'message': '登录成功',
              'type': 'success',
            })
            Taro.setStorageSync('user', name)
            this.forceUpdate();
            return;
          }
        }
        Taro.atMessage({
          'message': '登录成功',
          'type': 'scuuess',
        })
        Taro.setStorage({
          key: 'user',
          data: name,
        })
        this.forceUpdate();
      },
      fail: (err) => {
        console.log('err:', err);
      }
    })
  }

  handleLogin() {
    const jthis = this;
    Taro.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success: () => {
              jthis.getUserInfo();
            }
          })
        } else {
          jthis.getUserInfo();
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
    const user = Taro.getStorageSync('user');
    return list.map((item, index) => {
      const child = _.cloneDeep(item);
      if (id) {
        child.id = id;
      }
      return (
        <View className="comment" key={item.id}>
          <View>
            <Comment
              author={child.user.split('-')[0]}
              dateTime={child.createdTime}
              content={child.content}
              renderActions={
                <View className="actions">
                  {/* <View onClick={() => {
                    this.handleReplay(child)
                  }}>回复</View> */}
                  {child.user === user ? <View style={{ marginLeft: '15px' }} onClick={() => { this.handleDelete(child) }}>删除</View> : <View></View>}
                </View>
              }
              renderAvatars={
                <View style={{ backgroundColor: this.generateColor(child.user) }} className="avatar">
                  <View>{child.user[0]}</View>
                </View>
              }
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
    const user = Taro.getStorageSync('user')
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
              author={item.user.split('-')[0]}
              dateTime={item.createdTime}
              content={item.content}
              renderActions={
                <View className="actions">
                  <View onClick={() => { this.handleReplay(item) }}>回复</View>
                  {item.user === user ? <View style={{ marginLeft: '15px' }} onClick={() => { this.handleDelete(item) }}>删除</View> : <View></View>}
                </View>
              }
              renderAvatars={
                <View style={{ background: this.generateColor(item.user) }} className="avatar">
                  <View>{item.user[0]}</View>
                </View>
              }
            >
              {item.children && item.children.length > 0 && this.renderChildren(item.children, item.id)}
              {/* {
                item.children && item.children.length > 0 ?
                 : <View></View>
              } */}
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
              <View className="login-tip">{user ? `欢迎 ${user.split('-')[0]}` : '请您先登录'}</View>
              <View className="login-btn" onClick={() => {
                if (user) {
                  Taro.clearStorageSync();
                  Taro.atMessage({
                    'message': '退出成功',
                    'type': 'success',
                  })
                  this.forceUpdate();
                } else {
                  this.handleLogin()
                }
              }}>{user ? '退出' : '登录'}</View>
            </View>
            <AtButton disabled={!user} onClick={() => this.handleSubmit()} size="small" className="submit-message" type="primary">提交留言</AtButton>
          </View>
        </AtForm>
        <View className="comment-wrap">
          {this.renderMessages(messageList)}
          {/* <MessageList
            messages={messageList}
            pagination={this.props.pagination}
            handleReplay={this.handleReplay}
            handleDelete={this.handleDelete}
            generateColor={this.generateColor}
          /> */}
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