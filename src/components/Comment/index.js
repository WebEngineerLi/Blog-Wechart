import Taro, { Component } from '@tarojs/taro';
import './index.less';
import moment from 'moment';

class Comment extends Component {

  render() {
    const { renderActions = '', author = '', content = '', dateTime = '', renderAvatars, children } = this.props;
    return (
      <View className="comment">
        <View className="left">
          {renderAvatars}
        </View>
        <View className="right">
          <View>
            <Text className="author" style={{ marginRight: '16px' }}>{author}</Text>
            <Text className="date">{moment(dateTime).fromNow()}</Text>
          </View>
          <View className="content">
            {content}
          </View>
          <View className="actions">{renderActions}</View>
          <View className="children">
            {children}
          </View>
        </View>
      </View>
    )
  }
}

export default Comment;