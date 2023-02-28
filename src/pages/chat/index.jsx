import React from "react";
import {Image, Button, Cell} from "@antmjs/vantui";
import {ScrollView, Text, Textarea, View} from "@tarojs/components";
import './index.scss'
import {myRequest} from "../../utils/request";


function Chat() {
  const [messageList, setMessageList] = React.useState([{"author": "human", "content": ""}, {
    "author": "ai",
    "content": ""
  }]);
  const [message, setMessageAge] = React.useState('');
  const [loading, setLoading] = React.useState(false)

  async function sendBtnClick(messageData) {
    // let obj = {"author": "human", "content": message}
    // setMessageList((messageListPre)=>[...messageListPre,obj]);
    setMessageList([...messageList, {"author": "human", "content": messageData}]);


    setMessageAge('')
    setLoading(true);
    let res = await myRequest(`https://wang-chat.2hider.com/chat/${messageData}`, {})
    if (res.code === 200) {
      setMessageList((data) => [...data, {"author": "ai", "content": res.message}]);
      setLoading(false)
    }

  }

  return (
    <View className='container'>
      <View className='message-box'>
        <ScrollView
          scrollY
          className='list'
          // scrollIntoView={viewId}
          enableBackToTop
          scrollWithAnimation
        >
          {messageList.map((data) => {
            return data.author === "human" ? (data.content !== '' ? <Cell className='my'>
                <Text className='message-text' selectable>{data.content}</Text>
                <Image round className='avatar' width='38px'
                  height='38px' src='https://oss.2hider.com/wang-help/ava-human.png'
                />
              </Cell>
              : <></>) : (data.content !== '' ? <Cell>
              <Image round width='38px'
                height='38px' src='https://oss.2hider.com/wang-help/ava-ai.png'
              />
              <Text className='message-text' selectable>{data.content}</Text>
            </Cell> : <></>)
          })}
        </ScrollView>
      </View>

      <Cell className='send-box' roundRadius={0}>

        {/*<div>自定义内容</div>*/}
        <Textarea className='send-input' showConfirmBar={false} controlled autoHeight value={message}
          onInput={(event) => {
                    setMessageAge(event.detail.value)
                  }}
        />
        <Button className='send-btn' loading={loading} size='small' type='primary'
          onClick={() => sendBtnClick(message)}
        >发送</Button>
      </Cell>
    </View>

  );
}

export default Chat;
