import React, {useEffect} from 'react';
import {Label, Radio, RadioGroup, View} from "@tarojs/components";
import relationship from 'relationship.js'

import {Button, Col, Row} from "@antmjs/vantui";
import './index.scss'


function Relationship() {
  // const [chain, setChain] = React.useState('')
  // 关系列表
  const [relation, setRelation] = React.useState([])
  // 我的性别
  const [mySex, setMySex] = React.useState(1)
  // 当选选中者的性别
  const [selectSex, setSelectSex] = React.useState([])
  // 模式 我称呼对方还是对方称呼我
  const [mode, setMode] = React.useState(false)

  useEffect(() => {
    setSelectSex([mySex])
  }, [mySex])

  function handleKeyboardClick(key) {
    if (key.call === 'CLR') {
      // 清空关系数组和将选择者性别更改为我的性别
      setRelation([])
      setSelectSex([mySex])
    } else if (key.call === 'DEL') {
      // 删除关系数组和性别数组中的最后一位元素
      setRelation(relation.slice(0, -1))
      selectSex.length === 1 ? setSelectSex([mySex]) : setSelectSex(selectSex.slice(0, -1))

    } else if (relation.length === 0) {
      // 如果关系数组为空 直接设定选中者的称呼和性别
      setRelation([key.call])
      setSelectSex([key.sex])
    } else if (relation.length > 0) {
      // 如果关系数组不为空 在原数组后加入选中者的称呼和性别
      setRelation([...relation, '的' + key.call])
      setSelectSex([...selectSex, key.sex])
    }
  }

  const keys = [
    {call: '爸爸', sex: 1, type: 'default'},
    {call: '妈妈', sex: 0, type: 'default'},
    {call: 'DEL', sex: 2, type: 'secondary'},
    {call: 'CLR', sex: 2, type: 'secondary'},
    {call: '老公', sex: 1, type: 'default'},
    {call: '老婆', sex: 0, type: 'default'},
    {call: '儿子', sex: 1, type: 'default'},
    {call: '女儿', sex: 0, type: 'default'},
    {call: '哥哥', sex: 1, type: 'default'},
    {call: '弟弟', sex: 1, type: 'default'},
    {call: '姐姐', sex: 0, type: 'default'},
    {call: '妹妹', sex: 0, type: 'default'},
  ]


  return (
    <View className='container'>
      <View className='header'>
        <h1>亲戚关系计算器</h1>
        <p>快速计算亲戚间的称呼关系</p>
      </View>

      <View className='card'>
        <View className='condition'>
          <View className='card-title'>基本信息</View>
          <RadioGroup className='condition-group'>
            <Label className='radio-list__label'>
              <Radio className='radio-list__radio' color='#4facfe' value='1' onClick={() => setMySex(1)}
                checked={mySex === 1}
              >男</Radio>
            </Label>
            <Label className='radio-list__label'>
              <Radio className='radio-list__radio' color='#fa709a' value='0' onClick={() => setMySex(0)}
                checked={mySex === 0}
              >女</Radio>
            </Label>
          </RadioGroup>
          <RadioGroup className='condition-group'>
            <Label className='radio-list__label'>
              <Radio className='radio-list__radio' color='#4facfe' value='true' onClick={() => setMode(false)}
                checked={mode === false}
              >我称呼对方</Radio>
            </Label>
            <Label className='radio-list__label'>
              <Radio className='radio-list__radio' color='#fa709a' value='false' onClick={() => setMode(true)}
                checked={mode === true}
              >对方称呼我</Radio>
            </Label>
          </RadioGroup>
        </View>
      </View>

      <View className='card result-container'>
        <View className='card-title'>计算结果</View>
        <view className='text-chain'>{relationship({text: relation.join(''), sex: mySex, reverse: mode}).join('、')}</view>
        <view className='text-relation'>{relation.join('')}</view>
      </View>

      <View className='keyboard'>
        <View className='keyboard-title'>选择关系</View>
        <View className='keyboard-row'>
          <Row>
            {keys.map(key => {
              return <Col span='6' key={key.call + key.sex}>
                <View className='keyboard-key'>
                  {/*如果当前选中者的性别为女性,则老婆按钮为禁用状态.反之如果是男性则老公按钮为禁用*/}
                  <Button
                    block
                    className={`keyboard-btn ${key.type}`}
                    disabled={(key.call === '老婆' && selectSex[selectSex.length - 1] === 0) || (key.call === '老公' && selectSex[selectSex.length - 1] === 1)}
                    onClick={() => handleKeyboardClick(key)}
                  >{key.call}</Button>
                </View>
              </Col>
            })}
          </Row>
        </View>
      </View>
    </View>
  );
}

export default Relationship;
