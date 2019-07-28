import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTimeline } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { actions, selectors } from '../../model/blog';

// import { add, minus, asyncAdd } from '../../actions/counter'

import './index.less'

const mapStateToProps = (state) => ({
  blogList: selectors.getBlogList(state)
})

const mapDispatchToProps = (dispatch) => ({
  onBlogList() {
    dispatch(actions.listBlog())
  }
})

@connect(mapStateToProps, mapDispatchToProps)
class Blog extends Component {

  state = {
    current: 1,
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  componentDidMount() {
    this.props.onBlogList(); 
  }

  render () {
    const { blogList } = this.props;
    return (
      <View className='index'>
        {/* 博客 */}
        <AtTimeline
          items={blogList}
        >
        </AtTimeline>
      </View>
    )
  }
}

export default Blog
  