<!--
 * @Author: Mr·bi
 * @Date: 2022-09-19 09:40:59
 * @explain: 
 * @LastEditTime: 2022-09-20 19:07:50
-->
<script setup >
import { ref, onMounted, reactive } from "vue";
// 基础字段
const count = 72; // 总卡片数
const cardTypeList = [1, 2, 3, 4, 5, 6];
const buttonList = [
  { label: "清理", id: 1 },
  { label: "回退", id: 2 },
  { label: "洗牌", id: 3 },
];
const skinList = [
  { label: "王者荣耀峡谷", id: 1, type: "wz" },
  { label: "海绵宝宝海洋世界", id: 2, type: "hm" },
  { label: "英雄联盟Penta Kill", id: 3, type: "yx" },
];
// 响应式
let cardList = ref([]); // 主体格子列表
let storageBox = ref([]); // 羊圈格子列表
let clearList = ref([]);  // 清理到主体的列表
let headTitle = ref("");  // 头部标题
let skinType = ref("");   // 一键换肤类型
const isShowMask = ref(false); // 弹出层
const gameState = ref("");  // 

// 生成多张卡片
function createCard() {
  let arr = [];
  for (let i = 1; i <= count; i++) {
    let num = i / 12;
    let index = Number.isInteger(num) && num != 0 ? num - 1 : Math.trunc(num);
    let card = {
      type: cardTypeList[index],
      isShow: false,
      id: i,
      top:
        (Math.floor(Math.random() * 6) + 1) * 50 -
        Math.floor(Math.random() * 50),
      left:
        (Math.floor(Math.random() * 6) + 1) * 50 -
        Math.floor(Math.random() * 50),
    };
    arr.push(card);
  }
  return arr;
}
function refreshCard(arr) {
  let temp = [...arr];
  for (let index = 0; index < temp.length; index++) {
    temp[index].isShow = false;
    (temp[index].top =
      (Math.floor(Math.random() * 6) + 1) * 50 -
      Math.floor(Math.random() * 50)),
      (temp[index].left =
        (Math.floor(Math.random() * 6) + 1) * 50 -
        Math.floor(Math.random() * 50));
  }
  return temp;
}

function isShowCard(arr) {
  let temp = arr.concat();
  for (let i = 0; i < temp.length; i++) {
    var _iItem = temp[i];
    for (let j = i + 1; j < temp.length; j++) {
      var _jItem = temp[j];
      let top = Math.abs(_iItem.top - _jItem.top);
      let left = Math.abs(_iItem.left - _jItem.left);
      if (top < 50 && left < 50) {
        break;
      }
      if (j === temp.length - 1) {
        temp[i].isShow = true;
      }
    }
  }
  temp[temp.length - 1].isShow = true;
  return temp;
}
// 打乱顺序
function randomList(arr) {
  const temp = arr.concat();
  for (let i = 0; i < temp.length; i++) {
    const idx = Math.floor(Math.random() * (temp.length - i)) + i;
    const tmp = temp[idx];
    temp[idx] = temp[i];
    temp[i] = tmp;
  }
  return temp;
}
function initCard() {
  cardList.value = isShowCard(randomList(createCard()));
  storageBox.value = [];
  clearList.value = [];
  isShowMask.value = false;
  gameState.value = "";
}
function onChange(v) {
  // console.log(v);
  if (!v.isShow) return;
  // 在上面删除这一条
  cardList.value.forEach((element, index) => {
    if (element.id === v.id) {
      cardList.value.splice(index, 1);
    }
  });
  if (cardList.value.length > 0) {
    isShowCard(cardList.value);
  }

  // 在羊圈添加它
  storageBox.value.push(v);
  // 执行一下事件
  updateStorageBox();
}
// 设置
function setEvent() {
  console.log(11);
  isShowMask.value = true;
  gameState.value = "set";
}
function onEvent(v) {
  clearList.value.forEach((element, index) => {
    if (element.id === v.id) {
      clearList.value.splice(index, 1);
    }
  });
  // 在羊圈添加它
  storageBox.value.push(v);
  // 执行一下事件
  updateStorageBox();
}
function updateStorageBox() {
  for (let i = 0; i < storageBox.value.length; i++) {
    var count = 0;
    for (let c = i; c < storageBox.value.length; c++) {
      if (storageBox.value[i].type === storageBox.value[c].type) {
        count++;
      }
      if (count === 3) {
        var index = storageBox.value[i].type;
        storageBox.value = storageBox.value.filter(
          (item) => item.type != index
        );
      }
    }
  }
  updateStatus();
}
function updateStatus() {
  if (storageBox.value.length === 7) {
    isShowMask.value = true;
    gameState.value = "error";
    return;
  }
  if (
    !cardList.value.length &&
    !storageBox.value.length &&
    !clearList.value.length
  ) {
    isShowMask.value = true;
    gameState.value = "succee";
  }
}
function onTool(v) {
  if (v === 1) {
    //  清场
    clearList.value.push(...storageBox.value);
    storageBox.value.length = 0;
  }
  if (v === 3) {
    // 洗牌
    cardList.value = isShowCard(randomList(refreshCard(cardList.value)));
  }
}
function againGame() {
  initCard();
}
function skinEvent(v) {
  skinType.value = v.type;
  isShowMask.value = false;
  skinList.forEach((element) => {
    if (element.type === v.type) {
      headTitle.value = element.label;
    }
  });

  initCard();
}
onMounted(() => {
  skinType.value = "wz";
  headTitle.value = "王者荣耀峡谷";
  initCard();
});
</script>

<template>
  <main
    :style="{
      background: `url(/src/assets/${skinType}.jpg) no-repeat 100% 100%`,
    }"
  >
    <header>{{ headTitle }}</header>
    <div class="set-img-box" @click="setEvent">
      <img src="/src/assets/set.png" alt="" class="set-class" />
    </div>
    <div class="content">
      <div class="card-box" v-if="cardList.length > 0">
        <div
          v-for="item in cardList"
          :key="item.id"
          :class="!item.isShow ? 'card shadow ' : 'card'"
          :style="{
            top: item.top + 'px',
            left: item.left + 'px',
          }"
          @click="onChange(item)"
        >
          <img :src="`/src/assets/${skinType}${item.type}.jpg`" alt="" />
        </div>
      </div>
    </div>
    <footer>
      <div class="clear-box">
        <div
          class="card"
          v-for="item in clearList"
          :key="item.id"
          @click="onEvent(item)"
        >
          <img :src="`/src/assets/${skinType}${item.type}.jpg`" alt="" />
        </div>
      </div>
      <div class="sheep-box">
        <div v-for="item in storageBox" :key="item.id" class="card">
          <img :src="`/src/assets/${skinType}${item.type}.jpg`" alt="" />
        </div>
      </div>
      <div class="tools-box">
        <div
          class="button"
          v-for="item in buttonList"
          :key="item.id"
          @click="onTool(item.id)"
        >
          {{ item.label }}
        </div>
      </div>
    </footer>
    <div class="mask-box" v-if="isShowMask">
      <div class="succee-box box" v-if="gameState === 'succee'">
        <div>
          <p>恭喜您！ 通关了。</p>
          <div class="button" @click="againGame">那必须的</div>
        </div>
      </div>
      <div class="error-box box" v-if="gameState === 'error'">
        <div>
          <p>又失败了，小垃圾。</p>
          <div class="button" @click="againGame">艹，再来。</div>
        </div>
      </div>
      <div class="set-box box" v-if="gameState === 'set'">
        <div>
          <p>一键换肤</p>
          <div
            class="button"
            @click="skinEvent(item)"
            v-for="item in skinList"
            :key="item.id"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
}
header {
  text-align: center;
  font-size: 26px;
  background-color: #000000;
  color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
}
.set-img-box {
  width: 35px;
  height: 35px;
  .set-class {
    width: 35px;
    height: 35px;
  }
}
.content {
  flex: 1;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  .card-box {
    position: relative;
    width: 100%;
    height: 400px;

    .card {
      width: 50px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 18px;
      font-weight: 700;
      border-radius: 4px;
      overflow: hidden;
      position: absolute;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
footer {
  .clear-box {
    margin: 0 auto;
    width: 300px;
    height: 50px;
    margin-bottom: 20px;
    .card {
      width: 50px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 28px;
      font-weight: 700;
      border: 1px solid #cccccc;
      float: left;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .sheep-box {
    margin: 0 auto;
    width: 355px;
    height: 52px;
    border: 2px solid gray;
    .card {
      width: 50px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 28px;
      font-weight: 700;
      border: 1px solid #cccccc;
      float: left;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .tools-box {
    width: 350px;
    height: 50px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .button {
      width: 70px;
      height: 40px;
      border-radius: 8px;
      background-color: #000000;
      color: #fff;
      line-height: 40px;
      text-align: center;
      font-weight: 600;
      font-size: 18px;
    }
  }
}
.shadow {
  filter: brightness(40%);
}
.mask-box {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 10;
  background: #ffffff;
  background: rgba(23, 27, 31, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  .box {
    width: 280px;
    height: 280px;
    border-radius: 15px;
    padding: 20px;
    text-align: center;
  }
  .succee-box {
    background-color: #48bb78;
    div {
      width: 100%;
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      border-radius: 5px;
      p {
        font-size: 25px;
        color: #48bb78;
      }
      .button {
        width: 100px;
        height: 50px;
        border-radius: 5px;
        background-color: #2182ea;
        color: #fff;
        line-height: 40px;
        text-align: center;
        font-size: 18px;
      }
    }
  }
  .error-box {
    background-color: #ff7974;
    div {
      width: 100%;
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      border-radius: 5px;
      p {
        font-size: 25px;
        color: ff7974;
      }
      .button {
        width: 100px;
        height: 50px;
        border-radius: 5px;
        background-color: #2182ea;
        color: #fff;
        line-height: 40px;
        text-align: center;
        font-size: 18px;
      }
    }
  }
  .set-box {
    background-color: #000000;
    div {
      width: 100%;
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      border-radius: 5px;
      p {
        font-size: 25px;
        color: ff7974;
        color: #2182ea;
      }
      .button {
        width: 150px;
        height: 50px;
        border-radius: 5px;
        background-color: #2182ea;
        color: #fff;
        line-height: 40px;
        text-align: center;
        font-size: 16px;
      }
    }
  }
}
</style>
