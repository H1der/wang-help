import {Image, Text, View} from "@tarojs/components";
import './index.scss'

function Match(props) {
  return (
    <View className='match'>
      <View className='match-item playing' data-index='6'>
        <View className='bo'>Bo3</View>
        <View className='left-wrap'><Text className='time'>17:00</Text> <Text className='date'><Text>01-20</Text>
          <Text>深圳</Text></Text></View>
        <View className='mid-wrap'>
          <View className='left-team'>
            <View className='team'><Image className='team-logo'
              src='https://img.scoregg.com/z/554377/p/2110/2713390040488_100X100.png'
            /><Text className='team-name'>DH</Text>
            </View>
          </View>
          <View className='score-wrap'>
            <View className='score-l'>
              <View className='top-bg' />
              <View className='bottom-bg' />
              <Text className='score t-win'>1</Text></View>
            <View className='score-r'>
              <View className='top-bg' />
              <View className='bottom-bg' />
              <Text className='score'>0</Text></View>
          </View>
          <View className='right-team'>
            <View className='team'><Text className='team-name'>AR</Text><Image className='team-logo'
              src='https://img.scoregg.com/z/2373870/p/201/0815410720999_100X100.png'
            /></View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default Match;
