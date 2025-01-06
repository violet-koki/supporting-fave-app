<script lang="ts">
import { ref } from 'vue'
const msg = ref<string>('Welcome to Fave-App')
const googleLogin = () => {
    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
}

</script>
<template>
    <div id="login-view">
        <h1>
            {{ msg }}
        </h1>
        <button @click="googleLogin">Googleアカウントでログイン</button>
    </div>
</template>