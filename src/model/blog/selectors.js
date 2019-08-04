import { createSelector } from 'reselect';
import moment from 'moment';
import { View } from '@tarojs/components';
import NAMESPACE from './constants' ;

export const getState = (state) => {
  return state[NAMESPACE]
}

export const getBlogList = createSelector(
  getState,
  state => state.blogList
)

export const getBlogDetail = createSelector(
  getState,
  state => state.blogDetail
)