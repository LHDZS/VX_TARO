
<template>
    <view class="taro_picker" >
        <picker @change="onChange" @Cancel="onCancel" :value="index" :range="array" :disabled="disabled">
          <view class="picker" :style="disabled ? 'color:#ccc' : ''" @tap="onTap">
            <view class="picker-text" :style="disabled ? 'color:#ccc' : ''">
              <view class="value" v-if="value || array[index || key]">{{ value || array[index || key] }}</view>
              <view v-else>请选择</view>
            </view>
            <AtIcon v-if="type" value='chevron-down' size='16' ></AtIcon>
            <AtIcon v-else value='chevron-up' size='16' ></AtIcon>
          </view>
        </picker>
    </view>
</template>
  
  <script setup>
  import { ref } from 'vue'

    const type = ref(true)

    const key = ref(null)

    const props = defineProps({
        disabled: {
          type: Boolean,
          default: false
        },
        text: String,
        value: {
          type: String,
          default: null
        },
        array: Array,
        index: {
          type: String,
          default: null
        }
    });

    const emit = defineEmits(['onChange']);

    const onTap = () => {
      if (props.disabled) return
      type.value = false
    }

    const onCancel = (e) => {
      type.value = true
    }

    // const emit = defineEmits(["onChange"])
    const onChange = (e) => {
      console.log(e)
      props.index = e.detail.value
      key.value = e.detail.value
      type.value = true
      emit('onChange', e.detail.value)
    }

    
    
  </script>