<script setup lang="ts">
import { infoType } from "./type";
import { useRouter } from "vue-router";
import { reactive } from "vue";
import { getLogin } from "@/api/user";
import { storageSession } from "@/utils/storage";
import { warnMessage, successMessage } from "@/utils/message";
import info, { ContextProps } from "./components/default/index.vue";

const router = useRouter();
const contextInfo: ContextProps = reactive({
  userName: "admin",
  passWord: "123456",
});
const toPage = (info: Object): void => {
  storageSession.setItem("userInfo", info);
  router.push("/");
};
// 登录
const onLogin = async () => {
  let { userName, passWord } = contextInfo;
  let { code, info,data, accessToken }: infoType = await getLogin({
    username: userName,
    password: passWord,
  });
  if(code==200){
    const userInfo:any = data;
    userInfo.accessToken = accessToken;
    successMessage(info)
    toPage(userInfo)
  }else{
    warnMessage(info);
  }
};

</script>

<template>
  <div class="login">
    <info
      :ruleForm="contextInfo"
      @on-behavior="onLogin"
    />
  </div>
</template>
