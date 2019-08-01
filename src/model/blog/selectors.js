import { createSelector } from 'reselect';
import moment from 'moment';
import { View } from '@tarojs/components';
import NAMESPACE from './constants' ;

export const getState = (state) => {
  return state[NAMESPACE]
}

export const getBlogList = createSelector(
  getState,
  state => {
    // const blogList = state.blogList.map(item => ({
    //   title: <View>{moment(item.blogCreateTime).format('YYYY-MM-DD')}</View>,
    //   content: [item.blogTitle],
    //   blogId: item.BlogId,
    //   icon: 'check-circle'
    // }))
    return state.blogList
  }
)