// source.config.ts
import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
var docs = defineDocs({
  dir: "content/docs"
});
var source_config_default = defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      themes: {
        light: "github-light-default",
        dark: "vitesse-dark"
      }
    }
  }
});
export {
  source_config_default as default,
  docs
};
