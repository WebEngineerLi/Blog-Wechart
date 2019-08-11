import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtForm, AtTextarea, AtButton, AtLoadMore } from 'taro-ui'
import { connect } from '@tarojs/redux'
import moment from 'moment';
// import LoginModal from '../../components/LoginModal';
import { actions, selectors } from '../../model/message';
import { getCookie } from '../../utils/cookie';
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
    dispatch(actions.register(params))
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
    this.showLogin = this.showLogin.bind(this)
    this.getUserInfo = this.getUserInfo.bind(this)
    this.mapColor = {}
  }

  componentDidMount() {
    this.props.getMessageList();
  }

  generateColor(user) {
    if (!this.mapColor[user]) {
      return randomColor();
    } else {
      return this.mapColor[user];
    }
  }

  state = {
    value: '',
    visible: false,
  }

  handleReplay() {

  }

  handleDelete() {

  }

  handleChange(value) {
    console.log('value:', value);
  }

  handleSubmit() {

  }

  getUserInfo() {
    Taro.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN',
      success: (res) => {
        console.log('res:', res);
        const { userInfo } = res;
        const params = {
          name: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          password: '123456',
          weburl: '',
          email: '',
        }
        this.props.register(params)
      },
      fail: (err) => {
        console.log('err:', err);
      }
    })
  }

  showLogin() {
    const jthis = this;
    Taro.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success: () => {
              jthis.getUserInfo();
              // console.log('res1:', res1);
              // // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              // // wx.startRecord()
            }
          })
        } else {
          jthis.getUserInfo();
        }
      }
    })
    // Taro.authorize({
    //   scope: 
    // })
    // Taro.getUserInfo({
    //   withCredentials: true,
    //   lang: 'zh_CN',
    //   success: (res) => {
    //     // console.log('res:', res);
    //   },
    //   fail: (err) => {
    //     console.log('err:', err);
    //   }
    // })
    // this.setState({ visible: true })
    // Taro.login({
    //   success:(res) => {
    //     const callback = (res) => {
    //       console.log('res:', res);
    //       // Taro.getUserInfo({
    //       //   withCredentials: true,
    //       //   lang: 'zh_CN',
    //       //   success: (res) => {
    //       //     console.log('res:', res);
    //       //   },
    //       //   fail: (err) => {
    //       //     console.log('err:', err);
    //       //   }
    //       // })
    //     }
    //     if (res.code) {
    //       this.props.login({
    //         appid: 'wx635a7f9ecdca174c',
    //         secret: 'a8fbd59cdaabc61081236251d811a450',
    //         jsCode: res.code
    //       }, callback)
    //     }
    //   }
    }

  loadMore() {
    const { pagination: { current, pageSize, total } } = this.props;
    let newPageSize = pageSize + 10;
    if (newPageSize > total ) {
      newPageSize = total;
    }
    console.log('newPageSize:', newPageSize);
    
    this.props.dump({ status: 'loading', pagination: { current, pageSize: newPageSize } })
    this.props.getMessageList();
  }

  renderChildren(messageList, id = '') {
    const { pagination: { total } } = this.props;
    if (messageList.length === 0) {
      return null;
    }
    // const user = getCookie('user');
    const user = '';
    return messageList.map((item, index) => {
      const floor = total - index;
      if (id) {
        item.id = id;
      }
      const avatar = (
        <View style={{ background: this.generateColor(item.user) }} className="avatar">
          <View>{item.user[0]}</View>
        </View>
      );
      const action = ( 
        <View className="actions">
            <View onClick={() => { this.handleReplay(item) }}>回复</View>
            {item.user === user ? <View style={{ marginLeft: '15px' }} onClick={() => { this.handleDelete(item) }}>删除</View> : <View></View>}
        </View>
      );
      return (
        <View className="comment">
          {/* <View className="floor">第{floor}楼</View> */}
          <View>
            <Comment
              author={item.user}
              dateTime={item.createdTime}
              content={item.content}
              renderActions={action}
              renderAvatars={
                <View style={{ background: this.generateColor(item.user) }} className="avatar">
                  <View>{item.user[0]}</View>
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
    // const user = getCookie('user');
    const user = '';
    return messageList.map((item, index) => {
      const floor = total - index;
      if (id) {
        item.id = id;
      }
      const avatar = (
        <View style={{ background: this.generateColor(item.user) }} className="avatar">
          <View>{item.user}</View>
        </View>
      );
      const action = ( 
        <View className="actions">
            <View onClick={() => { this.handleReplay(item) }}>回复</View>
            {item.user === user ? <View style={{ marginLeft: '15px' }} onClick={() => { this.handleDelete(item) }}>删除</View> : <View></View>}
        </View>
      );
      return (
        <View className="comment">
          <View className="floor">第{floor}楼</View>
          <View>
            <Comment
              author={item.user}
              dateTime={item.createdTime}
              content={item.content}
              renderActions={action}
              renderAvatars={
                <View style={{ background: this.generateColor(item.user) }} className="avatar">
                  <View>{item.user[0]}</View>
                </View>
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
    const arr = [1,2,3,4,5,6];
    return arr.map(item => (
      <View>{item}</View>
    ))
  }

  render() {
    const { value, visible } = this.state;
    const { messageList, status } = this.props;
    console.log('status:', status);
    
    return (
      <View className="wrap">
        <Header />
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
              <View className="login-tip">请您先登录</View>
              <View className="login-btn" onClick={this.showLogin}>登录</View>
            </View>
            <AtButton size="small" className="submit-message" type="primary">提交留言</AtButton>
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