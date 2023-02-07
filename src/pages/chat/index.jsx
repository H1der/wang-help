import React from "react";
import {Button, Cell} from "@nutui/nutui-react-taro";
import {Textarea, View} from "@tarojs/components";
import './index.scss'


function Chat() {

  return (
    <View  className='container'>
      <View className='message-box'></View>
      <Cell className='send-box'>

        {/*<div>自定义内容</div>*/}
        <Textarea style='background:#fff;width:100%;min-height:20px;padding:0 30rpx;' autoHeight />
        <Button size='small' type='success'>发送</Button>
      </Cell>
    </View>

  );
}

export default Chat;
