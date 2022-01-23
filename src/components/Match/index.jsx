import classNames from "classnames";
import {Image, Text, View} from "@tarojs/components";
import './index.scss'

function Match(props) {
  const {round} = props
  return (
    <View className='match' id={'match-' + round.matchID}>
      <View className={classNames({
        'match-item': true,
        'playing': round.status === '1',
        'end': round.status === '2'
      })}
      >
        <View className='bo'>Bo{round.game_count}</View>
        <View className='left-wrap'><Text className='time'>{round.match_time}</Text> <Text
          className='date'
        ><Text>{round.match_date.slice(5)}</Text>
          <Text>{round.homesite}</Text></Text></View>
        <View className='mid-wrap'>
          <View className='left-team'>
            <View className='team'><Image className='team-logo'
              src={round.team_image_thumb_a}
            /><Text className='team-name'>{round.team_short_name_a}</Text>
            </View>
          </View>
          <View className='score-wrap'>
            <View className='score-l'>
              <View className='top-bg' />
              <View className='bottom-bg' />
              <Text className={classNames({
                score: true,
                't-win': round.team_a_win > round.team_b_win
              })}
              >{round.status === '0' ? '-' : round.team_a_win}</Text></View>
            <View className='score-r'>
              <View className='top-bg' />
              <View className='bottom-bg' />
              <Text className={classNames({
                score: true,
                't-win': round.team_b_win > round.team_a_win
              })}
              >{round.status === '0' ? '-' : round.team_b_win}</Text></View>
          </View>
          <View className='right-team'>
            <View className='team'><Text className='team-name'>{round.team_short_name_b}</Text><Image
              className='team-logo'
              src={round.team_image_thumb_b}
            /></View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default Match;
