<template>
  <main class="confirm-email">
    <p class="message">You’ve created an account</p>
    <p class="message">Now you’re one step from expieriencing all advantages of our service.</p>
    <p class="email-info">Please, use link we send on your email to login.</p>
    <p class="no-email-text">I haven't got an email</p>
    <button class="resend-email">Resend link</button>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({ name: 'ConfirmEmail' })
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/auth/ConfirmEmail';
</style>
