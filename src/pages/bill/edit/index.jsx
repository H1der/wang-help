import React from 'react';
import {View} from "@tarojs/components";
import {Button, Divider, Field} from "@antmjs/vantui";
import Taro from "@tarojs/taro";
import './index.scss';

function Index() {
  const [value, setValue] = React.useState('')
  React.useEffect(() => {
    // 页面加载时执行
    const eventChannel = Taro.getCurrentInstance().page.getOpenerEventChannel();

    // 监听从父页面传递的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      setValue(`${data.date}\n--------------\n${data.data.map(item => `${item.name}：${item.num} x ${item.price} = ${item.total}`).join('\n')}\n--------------\n总计：${data.total}`)
      // 在这里处理接收到的数组数据
    });

    return () => {
      // 页面卸载时执行，可以在这里取消事件监听等清理工作
    };
  }, []);
  return (
    <View className='container'>
      <Divider contentPosition='center'>信息内容</Divider>
      <Field
        type='textarea'
        border
        value={value}
        onChange={(e) => setValue(e.detail)}
      />
      <Button type='primary' block style={{marginTop:'20px'}} onClick={()=>
        Taro.setClipboardData({
          data: value
        })
      }
      >
        复制
      </Button>
    </View>
  );
}

export default Index;
