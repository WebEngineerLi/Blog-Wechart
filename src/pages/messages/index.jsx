import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtForm, AtTextarea, AtButton } from 'taro-ui'
import Header from '../../components/Header';
import './index.less';

class Messages extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  state = {
    value: ''
  }

  handleChange(value) {
    console.log('value:', value);
  }

  handleSubmit() {

  }

  handleReset() {

  }

  render() {
    const { value } = this.state;
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
              height={300}
              className="area"
            />
            <View className="header"></View>
          </View>
        </AtForm>
      </View>
    )
  }
}

export default Messages;