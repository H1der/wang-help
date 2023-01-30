import {useEffect, useState} from 'react';
import { Text, View} from "@tarojs/components";
import {Dialog, Icon, Tag} from "@nutui/nutui-react-taro";
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
        <Icon name='del2' size='15' className='history-label-clear' onClick={() => setIsOpened(true)}></Icon>
        {/*<AtIcon value='trash' size='15' className='history-label-clear' onClick={() => setIsOpened(true)} />*/}
      </View>
      <View className='history-info'>
        {
          history.length > 0 ? history.map((item, index) => {
            return (

              <Tag className='history-tag' round color='#E9E9E9' textColor='#999999' key={index} onClick={() => {
                getSearchKeyword(item)
              }}
              >{item}</Tag>
            )
          }) : ''

        }
      </View>
      <Dialog
        title=''
        visible={isOpened}
        onOk={handleConfirm}
        onCancel={() => setIsOpened(false)}
      >
        <View className='modal-text'>确认删除搜索历史吗?</View>
      </Dialog>
    </View>
  ) : ''
}

export default SearchHistory;
