import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import moment from 'moment';
import { connect } from '@tarojs/redux'
import { actions, selectors } from '../../model/blog';
import Header from '../../components/Header';
import WxParse from '../../components/wxParse/wxParse'
import './index.less';
import './markdown.less';

const mapStateToProps = (state) => ({
  blogDetail: selectors.getBlogDetail(state)
})

const mapDispatchToProps = (dispatch) => ({
  onBlogDetail(params, callback) {
    return dispatch(actions.blogDetail(params, callback))
  }
})

@connect(mapStateToProps, mapDispatchToProps)
class Detail extends Component {

  // app.js中配置项需要加上window，在子页面无需添加window
  config = {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'LMY - 博客详情',
    navigationBarBackgroundColor: '#138fff',
  }

  async componentDidMount() {
    const { params } = this.$router;
    const callback = (blogDetail) => {
      // const article = converter.makeHtml(blogDetail.blogContent || '');
      const article = blogDetail.blogContent;
      WxParse.wxParse('article', 'md', article, this.$scope, 5)
    }
    this.props.onBlogDetail(params, callback)
  }

  renderTags() {
    const { blogDetail: { blogTags = '' } } = this.props;
    const tags = blogTags.split(',');
    return tags.map(item => (
      <View
        className="tag"
        name={item}
        circle
        type="primary"
      >
        {item}
      </View>
    ))
  }

  render() {
    const { blogDetail } = this.props;
    return (
      <View className="wrap">
        <Header />
        <View className="content">
          <View className="title">{blogDetail.blogTitle}</View>
          <View className="desc">{blogDetail.blogDescription}</View>
          <View className="tag-group">
            {this.renderTags()}
          </View>
          <View className="time">{moment(blogDetail.blogCreateTime).format('YYYY-MM-DD HH:mm:ss')}</View>
          <ScrollView className="article">
            <import src='../../components/wxParse/wxParse.wxml' />
            <template is='wxParse' data='{{wxParseData:article.nodes}}'/>
          </ScrollView>
        </View>
      </View>
    )
  }
}

export default Detail;