const pluginTailwind = require('eleventy-plugin-tailwindcss');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

/* Markdown Plugins */
let markdownIt = require("markdown-it");
let markdownItAnchor = require("markdown-it-anchor");
let markdownItEmoji = require("markdown-it-emoji");
let markdownItFootnote = require("markdown-it-footnote");
let markdownItContainer = require("markdown-it-container");
let markdownLinkifyImages = require('markdown-it-linkify-images')
let markdownToc = require('markdown-it-table-of-contents')
let markdownItTasks = require('markdown-it-task-lists')
let markdownItAttrs = require("markdown-it-attrs")
let markdownItCenterText = require("markdown-it-center-text")
let options = {
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
};
let opts = {
  permalink: true,
  permalinkClass: "direct-link",
  permalinkSymbol: ""
};

module.exports = (config) => {
  config.addPlugin(pluginTailwind, {
    src: 'src/assets/css/*'
  });

  config.addPlugin(syntaxHighlight);

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

  config.addFilter('readableDate', require('./lib/filters/readableDate'));
  config.addFilter('minifyJs', require('./lib/filters/minifyJs'));

  config.addTransform('minifyHtml', require('./lib/transforms/minifyHtml'));

  config.addCollection('posts', require('./lib/collections/posts'));
  config.addCollection('tagList', require('./lib/collections/tagList'));
  config.addCollection('pagedPosts', require('./lib/collections/pagedPosts'));
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
