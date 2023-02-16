import React from "react";
import {Avatar, Button, Cell, Step} from "@nutui/nutui-react-taro";
import {Text, Textarea, View} from "@tarojs/components";
import './index.scss'
import {myRequest} from "../../utils/request";
import {getOilChangeApi} from "../../utils/api";


function Chat() {
  const [messageList, setMessageList] = React.useState([{"author": "human", "content": ""}, {
    "author": "ai",
    "content": ""
  }]);
  const [message, setMessageAge] = React.useState('');

  async function sendBtnClick(message) {
    // let obj = {"author": "human", "content": message}
    // setMessageList((messageListPre)=>[...messageListPre,obj]);


    let res = await myRequest(`http://127.0.0.1:8000/chat/${message}`, {})
    // if (res.code === 200) {
    // let messageL = [{"author": "human", "content": message}, ]
    console.log(res)
    setMessageList([...messageList, {"author": "human", "content": message},{"author": "ai", "content": res.message}]);
    setMessageAge('')
    // } else {
    // }

  }

  return (
    <View className='container'>
      <View className='message-box'>
        {messageList.map((data, index) => {
          return data.author === "human" ? (data.content !== '' ? <Cell className='my'>
              <Text className='message-text' selectable>{data.content}</Text>
              <Avatar className='avatar' size='normal' icon='people'/>
            </Cell>
            : <></>) : (data.content !== '' ? <Cell>
            <Avatar size='normal' icon='people'/>
            <Text className='message-text' selectable>{data.content}</Text>
          </Cell> : <></>)
        })}

      </View>
      <Cell className='send-box' roundRadius={0}>

        {/*<div>自定义内容</div>*/}
        <Textarea className='send-input' showConfirmBar={false} controlled autoHeight value={message}
                  onInput={(event) => {
                    setMessageAge(event.detail.value)
                  }}
        />
        <Button className='send-btn' size='small' type='primary' onClick={() => sendBtnClick(message)}>发送</Button>
      </Cell>
    </View>

  );
}

export default Chat;
