import React from "react";
import {Avatar, Button, Cell} from "@nutui/nutui-react-taro";
import {Text, Textarea, View} from "@tarojs/components";
import './index.scss'


function Chat() {

  return (
    <View  className='container'>
      <View className='message-box'>
        <Cell className='my'>
          <Text className='message-text' selectable>小王你王你王你王你王你王你王你王你王你王你王你王你王你好</Text>
          <Avatar className='avatar' size='normal' icon='people' />
        </Cell>
        <Cell>
          <Avatar size='normal' icon='people' />
          <Text className='message-text' selectable>你好</Text>
        </Cell>
      </View>
      <Cell className='send-box' roundRadius={0}>

        {/*<div>自定义内容</div>*/}
        <Textarea className='send-input' autoHeight />
        <Button className='send-btn' size='small' type='primary'>发送</Button>
      </Cell>
    </View>

  );
}

export default Chat;
