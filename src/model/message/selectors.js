import { createSelector } from 'reselect';
import moment from 'moment';
import { View } from '@tarojs/components';
import NAMESPACE from './constants' ;

export const getState = (state) => {
  return state[NAMESPACE]
}

export const getMessageList = createSelector(
  getState,
  state => state.messageList
)

export const getPagination = createSelector(
  getState,
  state => state.pagination
)

export const getStatus = createSelector(
  getState,
  state => state.status
)