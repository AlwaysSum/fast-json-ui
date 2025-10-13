<template>
  <div class="fj-carousel" :style="carouselStyle" @mouseenter="pause" @mouseleave="resume">
    <div class="fj-carousel-track" :style="trackStyle">
      <div class="fj-carousel-slide" v-for="(item, index) in getValueFromConfig(config.children) || []" :key="index">
        <fast-json-widget :config="item" :data="data" :methods="methods" />
      </div>
    </div>
    <button v-if="getValueFromConfig(config.showArrows)" class="fj-carousel-arrow prev" @click="prev">‹</button>
    <button v-if="getValueFromConfig(config.showArrows)" class="fj-carousel-arrow next" @click="next">›</button>
    <div v-if="getValueFromConfig(config.showIndicators)" class="fj-carousel-indicators">
      <span v-for="(_, i) in slideCount" :key="i" :class="['indicator', { active: i === current }]" @click="go(i)"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref, onMounted, onBeforeUnmount, watch, type CSSProperties } from 'vue';
import * as FastJsonUI from '../../../utils/fast-json-ui';

const props = defineProps({
  config: { type: Object, required: true },
  data: { type: Object, default: () => ({}) },
  methods: { type: Object, default: () => ({}) },
});

const getValueFromConfig = (value: any): any => {
  return FastJsonUI.getValueFromConfig(value, props.data, props.methods);
};

const current = ref(0);
const timer = ref<number | null>(null);

const slides = computed<any[]>(() => getValueFromConfig(props.config.children) || []);
const slideCount = computed(() => slides.value.length);

const autoplay = computed(() => !!getValueFromConfig(props.config.autoplay));
const interval = computed(() => Number(getValueFromConfig(props.config.interval) || 3000));
const loop = computed(() => getValueFromConfig(props.config.loop) !== false);

const carouselStyle = computed<CSSProperties>(() => ({
  ...FastJsonUI.computeStyle(props.config) as CSSProperties,
  position: 'relative',
  overflow: 'hidden',
}));

const trackStyle = computed<CSSProperties>(() => ({
  display: 'flex',
  width: '100%',
  transform: `translateX(-${current.value * 100}%)`,
  transition: 'transform 0.4s ease',
}));

function go(i: number) {
  if (slideCount.value === 0) return;
  const max = slideCount.value - 1;
  if (i < 0) current.value = loop.value ? max : 0; else if (i > max) current.value = loop.value ? 0 : max; else current.value = i;
}
function next() { go(current.value + 1); }
function prev() { go(current.value - 1); }

function startAutoplay() {
  if (!autoplay.value || slideCount.value <= 1) return;
  stopAutoplay();
  timer.value = window.setInterval(() => { next(); }, interval.value);
}
function stopAutoplay() { if (timer.value) { clearInterval(timer.value); timer.value = null; } }
function pause() { stopAutoplay(); }
function resume() { startAutoplay(); }

onMounted(() => { startAutoplay(); });
onBeforeUnmount(() => { stopAutoplay(); });
watch([autoplay, interval, slideCount], () => startAutoplay());
</script>

<style scoped>
.fj-carousel {
  width: 100%;
}
.fj-carousel-track { width: 100%; }
.fj-carousel-slide { width: 100%; flex: 0 0 100%; }
.fj-carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.35);
  color: #fff;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
}
.fj-carousel-arrow.prev { left: 8px; }
.fj-carousel-arrow.next { right: 8px; }
.fj-carousel-indicators {
  position: absolute;
  left: 0; right: 0; bottom: 8px;
  display: flex;
  justify-content: center;
  gap: 6px;
}
.indicator {
  width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.6);
}
.indicator.active { background: #fff; }
</style>