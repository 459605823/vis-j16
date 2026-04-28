import {
  defineConfig,
  presetAttributify,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  presets: [presetWind4(), presetAttributify()],
  rules: [
    ['font-ali', {'font-family': 'ali-bold'}],
    ['font-shs', {'font-family': 'SHS'}],
    ['bg-fill', {'background-size': '100% 100%'}],
  ],
  shortcuts: {
    'center': 'flex items-center justify-center',
    'font-number': 'font-din font-bold',
  },
  transformers: [transformerVariantGroup(), transformerDirectives()],
});
