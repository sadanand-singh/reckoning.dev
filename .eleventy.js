const pluginTailwind = require('eleventy-plugin-tailwindcss');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const shortcodes = require('./lib/shortcodes/shortcodes.js')
const pairedshortcodes = require('./lib/shortcodes/paired_shortcodes.js')

/* Markdown Plugins */
let markdownIt = require("markdown-it");
let markdownItAnchor = require("markdown-it-anchor");
let markdownItEmoji = require("markdown-it-emoji");
let markdownItFootnote = require("markdown-it-footnote");
let markdownItContainer = require("markdown-it-container");
let markdownItTasks = require('markdown-it-task-lists')
let markdownItAttrs = require("markdown-it-attrs")

const anchorSlugify = (s) =>
  encodeURIComponent(
    String(s)
        .trim()
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, '')
        .replace(/\s+/g, '-')
  );

let options = {
  html: true,
  breaks: false,
  linkify: true,
  typographer: true
};
let opts = {
  permalink: true,
  permalinkSymbol: '',
  permalinkClass: 'heading-anchor',
  permalinkBefore: true,
  level: 2,
  slugify: anchorSlugify,
};

module.exports = (config) => {
  config.addPlugin(pluginTailwind, {
    src: 'src/assets/css/*'
  });

  config.addPlugin(syntaxHighlight);
  config.addPlugin(pluginRss);

  /**
   * Shortcodes
   * @link https://www.11ty.io/docs/shortcodes/
   */
  Object.keys(shortcodes).forEach((shortcodeName) => {
    config.addShortcode(shortcodeName, shortcodes[shortcodeName])
  })

  /**
   * Paired Shortcodes
   * @link https://www.11ty.dev/docs/languages/nunjucks/#paired-shortcode
   */
  Object.keys(pairedshortcodes).forEach((shortcodeName) => {
    config.addPairedShortcode(
      shortcodeName,
      pairedshortcodes[shortcodeName]
    )
  })

  config.setLibrary("md", markdownIt(options)
    .use(markdownItAnchor, opts)
    .use(markdownItEmoji)
    .use(markdownItFootnote)
    .use(markdownItContainer, 'callout')
    .use(markdownItContainer, 'callout-blue')
    .use(markdownItContainer, 'callout-pink')
    .use(markdownItContainer, 'callout-green')
    .use(markdownItContainer, 'warning')
    .use(markdownItTasks)
    .use(require('@iktakahiro/markdown-it-katex'), {
      "throwOnError" : false,
      "errorColor" : " #cc0000"
    })
    .use(markdownItAttrs, {
      includeLevel: [2,3],
      listType: "ol"
    })
  );

  config.setDataDeepMerge(true);

  config.addPassthroughCopy('src/assets/img/**/*');
  config.addPassthroughCopy({ 'src/posts/img/**/*': 'assets/img/' });

  config.addWatchTarget("src/assets/js/");

  config.addLayoutAlias('default', 'layouts/default.njk');
  config.addLayoutAlias('post', 'layouts/post.njk');
  config.addLayoutAlias('page', 'layouts/page.njk');

  config.addFilter('readableDate', require('./lib/filters/readableDate'));
  config.addFilter('minifyJs', require('./lib/filters/minifyJs'));
  config.addFilter('relatedPosts', require('./lib/filters/related'));
  config.addFilter('featuredPosts', require('./lib/filters/featured'));
  config.addNunjucksFilter('limit', (arr, limit) => arr.slice(0, limit));

  config.addTransform('minifyHtml', require('./lib/transforms/minifyHtml'));

  config.addCollection('posts', require('./lib/collections/posts'));
  config.addCollection('notes', require('./lib/collections/notes'));
  config.addCollection('tagList', require('./lib/collections/tagList'));
  config.addCollection('pagedPosts', require('./lib/collections/pagedPosts'));
  config.addCollection('pagedNotes', require('./lib/collections/pagedNotes'));
  config.addCollection('pagedPostsByTag', require('./lib/collections/pagedPostsByTag'));

  return {
    dir: {
      input: 'src',
      output: 'dist'
    },
    // pathPrefix: "/subfolder/",
    templateFormats: ['md', 'njk', 'html'],
    dataTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
};
