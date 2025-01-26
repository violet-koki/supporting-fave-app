<script lang="ts" setup>
import { ref } from 'vue'
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
const msg = ref<string>('Welcome to Fave-App')
const googleLogin = () => {
    const auth = getAuth();
    signInWithPopup(auth, new GoogleAuthProvider())
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log(getAuth().currentUser.uid)
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
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