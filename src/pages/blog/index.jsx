import Taro, { Component } from '@tarojs/taro';
import React from 'react';
import { View } from '@tarojs/components'
import { AtIcon} from 'taro-ui'
import { connect } from '@tarojs/redux'
import { actions, selectors } from '../../model/blog';
import Header from '../../components/Header';
import moment from 'moment';
import Img from '../../images/logo.png'
import './index.less'

const mapStateToProps = (state) => ({
  blogList: selectors.getBlogList(state),
  blogDetail: selectors.getBlogDetail(state)
})

const mapDispatchToProps = (dispatch) => ({
  onBlogList() {
    dispatch(actions.listBlog())
  },
  onBlogDetail(params) {
    dispatch(actions.blogDetail(params))
  }
})

@connect(mapStateToProps, mapDispatchToProps)
class Blog extends Component {

  state = {
    current: 1,
    list: []
  }

  componentDidMount() {
    this.props.onBlogList(); 
  }

  onClick(blogId) {
    // this.props.onBlogDetail({ blogId })
    Taro.navigateTo({
      url: `/pages/detail/index?blogId=${blogId}`
    })
  }

  renderTimeline() {
    const { blogList = [] } = this.props;
    if (blogList && blogList.length === 0) {
      return null;
    }
    return blogList.map(item => {
      return (
        <View key={item.blogId} className="timeline-item" onClick={this.onClick.bind(this, item.blogId)}>
          <View className="item-left">
            <AtIcon className="star" size="19" value="check-circle" />
          </View>
          <View className="item-right">
            <View className="date">
              <View className="triangle"></View>
              <View className="time">{moment(item.blogCreateTime).format('YYYY-MM-DD')}</View>
            </View>
            <View className="title">{item.blogTitle}</View>
            <View className="desc">{item.blogDescription}</View>
          </View>
        </View>
      )
    })
  }
  
  render () {
    // const { list } = this.state;
    return (
      <View className='index'>
        <Header />
        <View className="timeline">博客时间轴</View>
        <View className="timeline-wrap">
          {this.renderTimeline()}
        </View>
      </View>
    )
  }
}

export default Blog
  