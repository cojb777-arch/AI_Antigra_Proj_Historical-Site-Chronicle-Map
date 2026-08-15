import { defineConfig } from 'vite';

export default defineConfig({
  // 相対パスに指定することで、Cloudflare Pages (ルート配下) でも GitHub Pages (サブディレクトリ配下) でも共通で正常動作します
  base: './',
});
