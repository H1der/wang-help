import React from "react";
import {Button, Image, Text, View} from "@tarojs/components";
import {AtButton, AtIcon, AtModal, AtModalAction, AtModalHeader, AtTag} from "taro-ui";
import './TravelSearchResult.scss'

export function TravelSearchResult(props) {
  const [openModal, setOpenModal] = React.useState(false)
  const level = [
    '暂无',
    '低风险',
    '中风险',
    '高风险',
    '部分地区中风险',
    '部分地区高风险',
    '部分地区中、高风险',]
  const {info,type} = props
  return (<>
      <View className='info-city at-row'>
        <View className='at-col'>
          <AtIcon value={type?'arrow-up':'arrow-down'} size='30' color='#AAD0D9' />
          <Text className='city-text'>{type?'离开':'进入'}{info.city_name}</Text>
        </View>
        <AtTag className='city-level at-col' type='primary' circle>{level[info.risk_level]}</AtTag>
        <AtButton className='city-qrcode at-col' size='small' onClick={()=>setOpenModal(true)}>健康码</AtButton>
      </View>
      <Text className='at-article__p'>{type?info.out_desc:info.low_in_desc}</Text>
      <AtModal isOpened={openModal}>
        <AtModalHeader>{info.health_code_name}</AtModalHeader>
          <Image
            showMenuByLongpress
            mode='aspectFit'
            style='width: 280px;height: 150px;background: #fff;'
            src={info.health_code_picture}
          />
          {/*{info.health_code_picture}*/}
        <AtModalAction>
          <Button onClick={()=>setOpenModal(false)}>关闭</Button>
        </AtModalAction>
      </AtModal>
    </>

  );
}
