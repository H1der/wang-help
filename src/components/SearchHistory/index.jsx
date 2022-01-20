import {useEffect, useState} from 'react';
import {Button, Text, View} from "@tarojs/components";
import {AtIcon, AtModal, AtModalAction, AtTag} from "taro-ui";
import {getHistoryStorage, removeHistoryStorage} from "../../utils/storage";
import './index.scss'

function SearchHistory(props) {
  const {keyName, getSearchKeyword} = props
  const [history, setHistory] = useState([])
  const [isOpened, setIsOpened] = useState(false)
  useEffect(() => {
    setHistory(getHistoryStorage(keyName))
  }, [keyName])

  // 确认删除搜索历史
  function handleConfirm() {
    removeHistoryStorage(keyName)
    setHistory(getHistoryStorage(keyName))
    setIsOpened(false)

  }

  return history.length !== 0 ? (
    <View>
      <View className='history-label'>
        <Text className='history-label-text'>历史搜索</Text>
        <AtIcon value='trash' size='15' className='history-label-clear' onClick={() => setIsOpened(true)} />
      </View>
      <View className='history-info'>
        {
          history.length > 0 ? history.map((item, index) => {
            return (<AtTag className='history-tag' key={index} circle color='grey' onClick={() => {
              getSearchKeyword(item)
            }}
            >{item}</AtTag>)
          }) : ''

        }
      </View>
      <AtModal isOpened={isOpened}>
        <View className='modal-text'>确认删除搜索历史吗?</View>
        <AtModalAction> <Button onClick={() => setIsOpened(false)}>取消</Button> <Button
          onClick={handleConfirm}
        >确定</Button> </AtModalAction>
      </AtModal>
    </View>
  ) : ''
}

export default SearchHistory;
