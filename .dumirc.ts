import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  logo: false,
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'home',
  },
  alias: {
    'joystick-kit': path.join(__dirname, 'src'),
  },
});
