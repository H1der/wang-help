import {Image, Swiper, SwiperItem} from "@tarojs/components";
import './index.scss'

function Banner() {
  return (
      <Swiper
        className='swiper-h'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        circular
      >
        <SwiperItem>
          <Image className='swiper-img' src='https://oss.2hider.com/wang-help/221911-164234275123ba.jpg' mode='aspectFill' />
        </SwiperItem>
      </Swiper>
  );
}

export default Banner;
