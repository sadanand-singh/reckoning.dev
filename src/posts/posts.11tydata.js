module.exports = {
  layout: 'post',
  title: 'Untitled',
  eleventyComputed: {
    sitemap: {
      'changefreq': 'weekly',
      'priority': 0.75,
      'ignore': false,
    },
    permalink: (data) => {
      if (data.slug) {
        return `${data.slug}/index.html`;
        }
        else {
          return `${data.page.fileSlug}/index.html`
        }
    },
    thumb: (data) => {
      if (data.thumb) {
        if (data.thumb.search(/^https?:\/\//) !== -1) {
          return data.thumb;
        }
        return `/assets/img/${data.thumb}`;
      } else {
        return false;
      }
    }
  }
};
