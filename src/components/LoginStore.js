// 取出 Pinia 裡的 defineStore 方法
import { defineStore } from 'pinia'

// useLoginStore 是自行定義 Pinia store 的函數，之後可以通過調用它來取得 store 實例
export const useLoginStore = defineStore({
    id: 'myStore',
    state: () => ({
        name: ''
    }),
    // actions 概念同 Vue 的 methods
    // 透過呼叫將 response 存到 state 中，所以 actions 可以用來更新 state 資料的方法
    actions: {
        updateName(newName) {
            this.name = newName;},
    },
})