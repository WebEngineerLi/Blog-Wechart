import Taro, { Component } from '@tarojs/taro';
import React from 'react';
import { View } from '@tarojs/components'
import { AtTimeline } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { actions, selectors } from '../../model/blog';
import Header from '../../components/Header';
import moment from 'moment';
import Img from '../../images/logo.png'
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
    list: []
  }

  componentWillReceiveProps (nextProps) {
    // if (this.props.blogList.length !== nextProps.blogList.length) {
    //   const list = nextProps.blogList.map(item => ({
    //     title: moment(item.blogCreateTime).format('YYYY-MM-DD'),
    //     content: [item.blogTitle],
    //     blogId: item.BlogId,
    //     icon: 'check-circle'
    //   }))
    //   this.setState({ list })
    // }
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  componentDidMount() {
    this.props.onBlogList(); 
  }

  onClick = () => {
    console.log('1111');
  }

  renderTimeline() {
    const { blogList = [] } = this.props;
    console.log('blogList:', blogList);
    if (blogList && blogList.length === 0) {
      return null;
    }
    
    return blogList.map(item => {
      return (
        <View key={item.blogId} className="timeline-item">
          <View className="item-left"></View>
          <View className="item-right">
            <View className="date">{moment(item.blogCreateTime).format('YYYY-MM-DD')}</View>
            <View className="title">{item.blogTitle}</View>
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
        {/* <AtTimeline
          onClick={this.onClick}
          items={list}
        >
        </AtTimeline> */}
        {this.renderTimeline()}
      </View>
    )
  }
}

export default Blog
  