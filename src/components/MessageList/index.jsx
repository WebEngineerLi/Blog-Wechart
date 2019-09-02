import Taro, { Component } from '@tarojs/taro';

function MessageList(props) {
  const { pagination: { total = 0 } = {}, messages = [] } = props
  if (messages.length === 0) {
    return null;
  }
  const user = Taro.getStorageSync('user')
  
  return messages.map((item, index) => {
    const floor = total - index;
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
                <View onClick={() => { this.props.handleReplay(item) }}>回复</View>
                {item.user === user ? <View style={{ marginLeft: '15px' }} onClick={() => { this.props.handleDelete(item) }}>删除</View> : <View></View>}
              </View>
            }
            renderAvatars={
              <View style={{ background: this.props.generateColor(item.user) }} className="avatar">
                <View>{item.user[0]}</View>
              </View>
            }
          >
            {/* {item.children && item.children.length > 0 && this.props.renderChildren(item.children, item.id)} */}
          </Comment>
        </View>
      </View>
    )
  })
}
export default MessageList;