<template>
  <main class="homepage">
    <div class="homepage-header">
      <div class="text-content">
        <h1 class="heading">Brand yourself</h1>
        <p class="social-media">on social media</p>
        <p class="influencer-text">with influencers</p>
        <AppLink :to="{ name: 'Register' }" class="get-started-btn" responsive size="lg">Get Started</AppLink>
      </div>
      <picture>
        <source class="header-image" srcset="../assets/images/photo1.webp" media="(min-width: 768px)" />
        <source
          class="header-image"
          srcset="../assets/images/photo1(1).webp"
          media="(max-width: 768px)"
          type="image/webp"
        />
        <source
          class="header-image"
          srcset="../assets/images/photo1(1).png"
          media="(max-width: 768px)"
          type="image/png"
        />
        <source
          class="header-image"
          srcset="../assets/images/pexels-cottonbro-50537401.jpg"
          media="(max-width: 768px)"
          type="image/jpg"
        />
        <img
          class="header-image"
          src="../assets/images/homepage-head.png"
          :class="headerImageClasses"
          @load="onHeaderImageLoad"
        />
      </picture>
    </div>
    <div class="section-partnership">
      <div class="partnering-block">
        <p class="partnering-text">
          <span class="text-bold">Partnering with influencers is a </span>
          <span class="text-highlight">number one marketing strategy </span>
          <span class="text-bold">for many brands</span>
        </p>
        <p class="partnership-proposition-text">
          When influencers tell their fans and followers about how great your product is, there is a much higher chance
          that their audience will convert, simply because they need the product and trust the influencer.
        </p>
      </div>
      <div class="homepage-people-image-wrapper">
        <picture>
          <source class="header-image" srcset="../assets/images/photo2.webp" type="image/webp" />
          <img
            class="homepage-people-image"
            src="../assets/images/homepage-people.png"
            :class="secondImageClasses"
            @load="onSecondImageLoad"
          />
        </picture>
      </div>
    </div>

    <div class="statistic-section">
      <div class="statistic-block">
        <picture>
          <source class="header-image" srcset="../assets/images/photo3.webp" />
          <img
            class="statistic-image"
            src="../assets/images/homepage-person.png"
            :class="thirdImageClasses"
            @load="onThirdImageLoad"
          />
        </picture>
        <div>
          <p class="statistic-text">
            <span class="text-highlight">71.6% of Internet Users </span>
            <span class="text-bold">search for brand information on social platforms</span>
          </p>
          <p class="according-text">According to InfluencerMarketingHub</p>
        </div>
      </div>
    </div>

    <div class="tips">
      <picture>
        <source class="wave-bg" srcset="../assets/images/bg.webp" media="(min-width: 768px)" type="image/webp" />
        <source
          class="mobile-wave-bg"
          srcset="../assets/images/bg(2).webp"
          media="(max-width: 768px)"
          type="image/webp"
        />
        <source
          class="mobile-wave-bg"
          srcset="../assets/images/bg(3).png"
          media="(max-width: 768px)"
          type="image/png"
        />
        <img
          class="wave-bg-image"
          src="../assets/images/homepage-wave-bg.png"
          :class="waveImageClasses"
          @load="onWaveBgLoaded"
        />
      </picture>
      <div class="tips-content">
        <div class="tip tip-1">
          <div class="tip-background">
            <img class="tip-image" src="../assets/images/illustration1.svg" />
          </div>
          <p class="tip-text">Find popular social media users or bloggers whose vision aligns with your own</p>
        </div>

        <div class="tip tip-2">
          <div class="tip-background">
            <img class="tip-image" src="../assets/images/illustration2.svg" />
          </div>
          <p class="tip-text">Use high amount of trust that influencers have built up with their following</p>
        </div>

        <div class="tip tip-3">
          <div class="tip-background">
            <img class="tip-image" src="../assets/images/illustration3.svg" />
          </div>
          <p class="tip-text">Let the talent do what they do to build credibility and even drive sales</p>
        </div>
      </div>
    </div>

    <div class="homepage-footer">
      <div class="footer-section">
        <p class="goal-text">
          The most popular goal for influencer marketing campaigns is building awareness around a brand, product or
          service.
        </p>
        <p class="ready-start-text">Ready to start?</p>
        <div class="actions-container">
          <AppLink :to="{ name: 'Register' }" class="register-button" responsive>Register</AppLink>
          <AppLink :to="{ name: 'Login' }" class="login-button" responsive outlined>Login</AppLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import AppLink from '@/components/common/AppLink.vue'

export default defineComponent({
  name: 'Homepage',
  components: {
    AppLink,
  },
  setup() {
    const isHeaderImageLoaded = ref(false)
    const isSecondImageLoaded = ref(false)
    const isThirdImageLoaded = ref(false)
    const isWaveBgLoaded = ref(false)

    const onHeaderImageLoad = () => {
      isHeaderImageLoaded.value = true
    }

    const onSecondImageLoad = () => {
      isSecondImageLoaded.value = true
    }

    const onThirdImageLoad = () => {
      isThirdImageLoaded.value = true
    }

    const onWaveBgLoaded = () => {
      isWaveBgLoaded.value = true
    }

    const headerImageClasses = computed(() => (isHeaderImageLoaded.value ? '--loaded' : ''))
    const secondImageClasses = computed(() => (isSecondImageLoaded.value ? '--loaded' : ''))
    const thirdImageClasses = computed(() => (isThirdImageLoaded.value ? '--loaded' : ''))
    const waveImageClasses = computed(() => (isWaveBgLoaded.value ? '--loaded' : ''))

    return {
      onHeaderImageLoad,
      onSecondImageLoad,
      onThirdImageLoad,
      onWaveBgLoaded,
      headerImageClasses,
      secondImageClasses,
      thirdImageClasses,
      waveImageClasses,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/Homepage';
</style>
