<script lang="ts" setup>
cosnt db = firebase.firestore()

const userRef = db.collection('user')
// ログインしているユーザーの情報を取得します。
const user = firebase.auth().currentUser()

const result = []
userRef.doc(user.uid).get()
    .then(doc => {
        if (doc.exists) {
            result.push({
                id: doc.id,
                ...doc.date() // doc.data()からデータのオブジェクトを取得できます。
            })
        } else {
            console.log('結果は空です')
        }
    })
    .catch(e => // エラーが発生したとき　)
</script>
<template></template>