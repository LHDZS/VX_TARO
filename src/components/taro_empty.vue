
<template>
    <view class="taro_empty">
        <image class="empty-image" src="https://img.yzcdn.cn/vant/custom-empty-image.png" alt=""></image>
        <view class="empty-text">{{ props.text || '暂无数据'}}</view>
    </view>
</template>
  
<script setup lang="ts">
// import { useCssModule } from 'vue'

// const redStyle = useCssModule()

const props = defineProps({
    text: String,
    userInfo: Object
});

</script>

<style module lang="less">
.taro_empty {
    width: 100%;
    height: 100%;
    min-height: 30vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    gap: 30rpx;
    .empty-image {
      width: 90rpx;
      height: 90rpx;
    }
    .empty-text {
      font-size: 24rpx;
      color: #999DB3;
    }
  }
</style>