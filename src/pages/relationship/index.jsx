import React from 'react';
import {Label, Radio, RadioGroup, View} from "@tarojs/components";
import {AtButton} from "taro-ui";
import relationship from 'relationship.js'

import './index.scss'


function Relationship() {
  // const [chain, setChain] = React.useState('')
  const [relation, setRelation] = React.useState([])
  const [mySex, setMySex] = React.useState(1)
  const [selectSex, setSelectSex] = React.useState(mySex)
  const [mode, setMode] = React.useState(false)


  function handleKeyboardClick(key) {
    if (key.call === 'CLR') {
      setRelation([]);
    } else if (key.call === 'DEL') {
      setRelation(relation.slice(0, -1))
    } else if (relation.length === 0) {
      setRelation([key.call])
      setSelectSex(key.sex)
    } else if (relation.length > 0) {
      setRelation([...relation, '的' + key.call])
      setSelectSex(key.sex)
    }
    // setChain(relationship({text:relation.join(''),sex:1}))
  }

  //
  // function handleRadioGroupChange(event) {
  //   const {detail:{value}} = event
  //   setSelectSex(value)
  // }


  const keys = [{call: '爸爸', sex: 1,},
    {call: '妈妈', sex: 0,},
    {call: 'DEL', sex: 2,},
    {call: 'CLR', sex: 2,},
    {call: '老公', sex: 1,},
    {call: '老婆', sex: 0,},
    {call: '儿子', sex: 1,},
    {call: '女儿', sex: 0,},
    {call: '哥哥', sex: 1,},
    {call: '弟弟', sex: 1,},
    {call: '姐姐', sex: 0,},
    {call: '妹妹', sex: 0,},]

  return (
    <View className='container'>
      <View className='condition'>
        <RadioGroup className='condition-group'>
          <Label className='radio-list__label'>
            我的性别：
            <Radio className='radio-list__radio' color='#FADC9C' value='1' onClick={() => setSelectSex(1)} checked={mySex === 1}>男姓</Radio>
          </Label>
          <Label className='radio-list__label'>
            <Radio className='radio-list__radio' color='#FADC9C' value='0' onClick={() => setSelectSex(0)} checked={mySex === 0}>女姓</Radio>
          </Label>
        </RadioGroup>
        <RadioGroup className='condition-group'>
          <Label className='radio-list__label'>
            称呼方式：
            <Radio className='radio-list__radio' color='#FADC9C' value='true' onClick={() => setMode(false)} checked={mode === false}>我称呼对方</Radio>
          </Label>
          <Label className='radio-list__label'>
            <Radio className='radio-list__radio' color='#FADC9C' value='false' onClick={() => setMode(true)} checked={mode === true}>对方称呼我</Radio>
          </Label>
        </RadioGroup>
      </View>
      <view className='text-chain'>{relationship({text: relation.join(''), sex: mySex,reverse:mode}).join(',')}</view>
      <view className='text-relation'>{relation}</view>
      <View className='at-row at-row--wrap keyboard'>
        {keys.map(key => {
          return <View key={key.call + key.sex} className='at-col at-col-3 keyboard-key'>
            <AtButton className='keyboard-btn'
              disabled={(key.call === '老婆' && selectSex === 0 ) || (key.call === '老公' && selectSex === 1 )}
              onClick={() => handleKeyboardClick(key)}
            >{key.call}</AtButton>
          </View>
        })}
      </View>
    </View>
  );
}

export default Relationship;
