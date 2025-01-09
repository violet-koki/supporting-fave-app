<script lang="ts">
import { ref } from 'vue'
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
const msg = ref<string>('Welcome to Fave-App')
const googleLogin = () => {
    const auth = getAuth();
    signInWithRedirect(auth, new GoogleAuthProvider())
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