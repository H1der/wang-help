import Taro from "@tarojs/taro";
import {Component} from 'react'
import './app.scss'

class App extends Component {



  componentDidMount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  componentDidCatchError() {
  }

  // this.props.children 是将要会渲染的页面
  render() {

    if (process.env.TARO_ENV !== 'alipay') {
      Taro.showShareMenu({
        withShareTicket: true,
        showShareItems: ['wechatFriends','qq'],
      })
    }
    return this.props.children
  }
}

export default App
