import {useState} from "react";
import Taro from "@tarojs/taro";
import {Button, Text, View} from "@tarojs/components";
import {AtAvatar, AtButton, AtModal, AtModalAction, AtModalContent, AtModalHeader} from "taro-ui";
import './index.scss'

function Index() {
  const [isOpened,setIsOpened] = useState(false)

  async function handleSiteCopy() {
     await Taro.setClipboardData({
      data: 'https://github.com/H1der/wang-help',
    })
  }

  return (
    <View className='container'>
      <View className='avatar'>
        <AtAvatar circle size='large' image='https://oss.2hider.com/wang-help/play_store_512.png' />
        <View>

          <Text className='avatar-text'>基于 Taro 和 React 编写的工具类小程序</Text>
        </View>
      </View>
      {/*<AtList>*/}
      <View className='btn-list'>
        <AtButton><View
          className='at-icon at-icon-tags'
        /> 前端技术栈：Javascript,React,Taro</AtButton>
        <AtButton><View
          className='at-icon at-icon-tags'
        /> 后端技术栈：Java,Spring Boot,Mysql</AtButton>
        <AtButton><View
          className='at-icon at-icon-message'
        /> 开发者：Hider</AtButton>
        <AtButton onClick={handleSiteCopy}><View
          className='at-icon at-icon-home'
        /> 开源地址：点击复制</AtButton>
        <AtButton onClick={()=>setIsOpened(true)}><View
          className='at-icon at-icon-list'
        /> 更新记录</AtButton>
        <AtButton openType='share'><View
          className='at-icon at-icon-share'
        /> 分享小程序</AtButton>
        <AtButton openType='contact'><View
          className='at-icon at-icon-user'
        /> 联系客服</AtButton>
        <AtButton openType='feedback'><View
          className='at-icon at-icon-mail'
        /> 建议反馈</AtButton>
      </View>
      <AtModal isOpened={isOpened} onClose={()=>setIsOpened(false)}>
        <AtModalHeader>小王帮帮更新记录</AtModalHeader>
        <AtModalContent>
          <View>2022/3/9：修复证件照换底色照片长宽比失调</View>
          <View>2022/1/30：下架出行查询功能</View>
          <View>2022/1/27：新增了证件照换底色的功能</View>
          <View>2022/1/23：新增了LPL联赛赛程信息功能</View>
          <View>2022/1/14：新增了油价查询</View>
          <View>2022/1/13：新增了出行防疫政策查询</View>
          <View>2022/1/13：修复了亲戚计算器中DEL删除到最后一项选中性别的问题</View>
          <View>2022/1/11：新增了亲戚关系计算器</View>
          <View>2022/1/11：新增了垃圾分类查询</View>
          <View>2022/1/10：新增快递查询功能</View>
        </AtModalContent>
        <AtModalAction> <Button onClick={()=>setIsOpened(false)}>关闭</Button> </AtModalAction>
      </AtModal>
    </View>
  );
}

export default Index;
