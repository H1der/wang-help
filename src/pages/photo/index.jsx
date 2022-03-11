import Taro from "@tarojs/taro";
import {useEffect, useState} from 'react';
import {Canvas, Radio, RadioGroup, Text, View} from "@tarojs/components";
import {AtButton, AtIcon, AtNoticebar} from "taro-ui";
import './index.scss'
import {myRequest} from "../../utils/request";
import api from "../../utils/api";

function Index() {

  const [files, setFiles] = useState('')
  const [rate, setRate] = useState('')
  const [foreground, setForeground] = useState('')
  const [color, setColor] = useState('#fe0000')
  // 原始图片格式
  const [imgType, setImgType] = useState('png')
  // 目标图片宽度
  const [targetW, setTargetW] = useState(464)
  // 目标图片高度
  const [targetH, setTargetH] = useState(580)
  useEffect(() => {
    const d = Taro.getSystemInfoSync()
    const rateNum = (d.windowWidth / 750).toFixed(2)
    // console.log(rateNum)
    setRate(rateNum)

  }, [])

  useEffect(() => {
    if (files !== '') {
      drawContent(files, color)
    }
  }, [files])

  // 照片选择
  function photoChose() {
    setForeground('')
    return Taro.chooseImage({
      count: 1, // 默认9
      success: function (res) {
        // console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        setFiles(res.tempFilePaths[0]);
        // const base64 = Taro.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
      }
    })
  }



  // 画布画图
  function drawContent(file, colorValue) {
    const ctx = Taro.createCanvasContext('myCanvas')
    Taro.getImageInfo({
      src: file,
      success: (info) => {
        // console.log('getImageInfo=>res', info)
        setImgType(info.type)
        //目标尺寸
        if (info.width > 464 || info.height > 580) {
          console.log('11111111')
            setTargetH(580)
            setTargetW(Math.round(580 * (info.width / info.height)))

        }
        // 背景颜色
        ctx.fillStyle = colorValue
        ctx.fillRect(0, 0, (targetW - 1) * rate, targetH * rate)
        ctx.save()

        // 图片
        ctx.drawImage(file, 0, 0, targetW * rate, targetH * rate)
        return ctx.draw()
      }
    })

  }

  //将base64图片转网络图片
  function base64ToFile(code) {
    /*code是指图片base64格式数据*/
    //声明文件系统
    const fs = Taro.getFileSystemManager();
    //随机定义路径名称
    let times = new Date().getTime();
    let filePath = wx.env.USER_DATA_PATH + '/' + times + '.' + imgType;

    //将base64图片写入
    fs.writeFile({
      filePath,
      data: code,
      encoding: 'base64',
      success: () => {
        //写入成功了的话，新的图片路径就能用了
        drawContent(filePath, color)
        setForeground(filePath)
      }
    });
  }

  async function changeColor() {
    if (files === '') {
      return Taro.showToast({
        title: '请先选择照片!',
        icon: 'error',
        duration: 1000
      })
    }
    if (foreground === '') {
      await handlePhoto()
    } else {
      drawContent(foreground, color)
    }
  }

  // 发送网路请求使用ai处理图片
  async function handlePhoto() {

    await Taro.showLoading({
      title: 'Loading...',
    })

    let res = await myRequest(api.getBodySeg(), {image: Taro.getFileSystemManager().readFileSync(files, "base64")}, 'POST');
    // console.log(res)
    if (res.code === 200) {
      base64ToFile(res.data.foreground)
      // console.log(foreground)
      // drawContent(foreground)
      await Taro.hideLoading();
    } else {
      await Taro.showToast({
        title: '内部网络错误',
        icon: 'error',
        duration: 1000
      })
    }
  }

  function savePhotoSystem() {
    return Taro.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success() {
            Taro.showToast({
              title: '保存成功!'
            })
          },
          fail() {
            Taro.showToast({
              title: '保存失败!',
              icon: 'close',
              duration: 2000
            })
          }
        })
        console.log(res.tempFilePath)
      }
    })
  }

  // 保存到相册
  async function onClickSaveImage() {
    await Taro.getSetting({
      success(res) {
        // 如果没有授权过，则要获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          Taro.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              savePhotoSystem()
            },
            fail() { // 用户拒绝
              Taro.showToast({
                title: '用户拒绝,保存失败！',
                icon: 'close',
                duration: 2000
              })
            }
          })
        } else { // 如果已经授权过，可以直接保存
          savePhotoSystem()
        }
      }
    })
  }

  return (
    <View className='container'>
      <AtNoticebar icon='alert-circle'>本程序不会记录您的照片隐私.</AtNoticebar>
      <View className='photo-border' onClick={photoChose}>
        {files.length === 0 ? (<view className='photo-upload'>
          <AtIcon value='upload' size='150' color='#999999' className='upload-icon' />
          <Text className='text'>点击上传图片</Text>
        </view>) : (<View class='border1'>
          <Canvas canvasId='myCanvas' className='photo-canvas'
            style={{width: `${targetW * rate}px`, height: `${targetH * rate}px`}}
          />
          <Text class='text'>点击图片重新上传</Text>
        </View>)}

      </View>
      <RadioGroup className='color-group'>
        <Radio className='radio-red' color='#fe0000' value='red' onClick={() => setColor('#fe0000')}
          checked={color === '#fe0000'}
        >红色</Radio>
        <Radio className='radio-blue' color='#428eda' value='blue' onClick={() => setColor('#428eda')}
          checked={color === '#428eda'}
        >蓝色</Radio>
        <Radio className='radio-white' value='white' onClick={() => setColor('#fff')}
          checked={color === '#fff'}
        >白色</Radio>
        <Radio className='radio-gray' color='#9e9e9e' value='gray' onClick={() => setColor('#9e9e9e')}
          checked={color === '#9e9e9e'}
        >灰色</Radio>
      </RadioGroup>

      <View className='btn-group at-row'>
        <AtButton className='change-color at-col' onClick={changeColor}>转换底色</AtButton>
        <AtButton className='down-photo at-col' onClick={onClickSaveImage}>下载照片</AtButton>
      </View>

    </View>
  );
}

export default Index;
