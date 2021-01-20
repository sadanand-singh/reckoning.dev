---
title: 'This Blog is Now Powered by GatsbyJS'
date: 2019-04-01
tags:
  - Blog
slug: hugo-to-gatsby
thumb: gatsby2.jpeg
---

I started this blog using [pelican](https://blog.getpelican.com/) in 2014. Since then, I moved to
[Nikola](https://getnikola.com/), and then to [Hugo](https://gohugo.io/). I covered my move from
Nikola to Hugo in [a post](/nikola-to-hugo) back in 2017. The main reason for these moves have been
my constant quest for learning something new and making this platform simple and aesthetically
pleasing.

Lately, I have been learning a lot about javascript and react in particular. Naturally,
my next question was, could I use react in my blog as well? And that brought me to -
[Gatsby](https://www.gatsbyjs.org/)!

I had quite a bit of fun with Hugo. I developed my own theme of Bootstrap4 from scratch with many
short codes like png (way to add png code in markdown), many component features from bootstrap etc.
The biggest advantage of Hugo was its lightning fast build process. However, since I was using
jquery, the website performed poorly when deployed.

After few weeks of trial and learning, I have been able to transfer all of my content from before
to Gatsby. You might observe this link to be much faster and aesthetically pleasing.

![](https://res.cloudinary.com/sadanandsingh/image/upload/v1555377338/Screen_Shot_2019-04-15_at_6.14.47_PM_hkrbyn.png)

There are hundreds of articles on how to get started with gatsby, best ones of their website
itself. Hence, I am not going to bore you with YAGT (Yet Another Guide/Tutorial). Here, I just want
to highlight the features that I really liked about Gatsby and how I went about transforming this
website.

## Why Gatsby?

Gatsby utilizes the power of code/data splitting, pre-loading, pre-caching, image optimization, and
all sorts of performance enhancements that would be difficult or impossible to do with straight
HTML. It runs on Node.js and, even better, uses [React](https://reactjs.org/)! I tested out a few
sites that run on Gatsby and yeah - they were fast. I was sold. Few things, I really liked:

- No page reloads - this site is now a SPA (single page app), and clicking on any internal page
  from within the website doesn't need to load a completely new resource
- Image optimization - all the images are automatically stripped of metadata, optimized, resized,
  lazy-loaded, and compressed
- Pre-fetch resources - Gatsby detects what links are available on a given page and loads that data
  into the cache
- Minification - code is minified, bundled, and served

> During my search for Gatsby powered blogs, I came across a blog by
> [Tania Rascia](https://www.taniarascia.com/migrating-from-wordpress-to-gatsby/). I just fell in
> love with her minimal and highly functional design. As you will see later, this blog is
> completely inspired by her work. I have added few features like inclusion of python notebooks,
> bokeh plots, inline Youtube content etc.

## Hugo, Am I going to miss you?

Short Answer - Nah! not really.

Before you get any wrong picture about Hugo, let me very clear, Hugo is really nice library.
Concepts are extremely simple. You can quickly build complex components to build really cool
websites. The documentation is well written and has a very friendly and active community. If you
are interested, you can still look at my
[Hugo code base on github](https://github.com/sadanand-singh/Blog).

My main concern was the underlying technology. I have rarely seen people using golang for any web
programming. Javascript, and in particular react is just omnipresent! Naturally, I wanted to use a
tool that just uses things that I use everywhere else. One of the biggest things highlighted by
Hugo is - how first it builds websites. I have no complaints about that, but what I do not
understand is, how is that even relevant if you build automatically (eg. using
[Netlify](https://www.netlify.com/)). I would rather use a tool that is fast during rendering than
the one that is fast only in building!

## The Process

Using, the [codebase of Tania's Blog](https://github.com/taniarascia/taniarascia.com/) as a
starting point, it was actually a pretty simple affair to convert. Some of the important steps
were:

- As I was already using YAML front-matter in my md files in Hugo, so it was justa matter of
  removing redundant ones.
- Completely got rid of Facebook, and Disqus related things. I just did not want any kind of
  tracking or ads on my blog.
- Add additional plugins and their configs in `gatsby-config.js` for things like latex equation
  rendering, embedded youtube video support etc.
- Update site config data in `data/SiteConfig.js`.
- Update all my pages and posts along with thumbnails and images.
- Update different react components for supporting additional features like bokeh plots, jupyter
  notebooks etc.

Finally, in order to point netlify to my new repo, I had to first delete my old website and create
a new one. Netlify is smart to automatically figure out what commands to use for building your
content. And voila!

One of the features of Tania's theme that I am really liking is toggled Dark mode. Overall, I am
having super fun. I plan to add features like search, web photo carousel etc. in very near future.
I can write more about this in the future if anyone has more specific questions about Gatsby, or
React. If you see anything broken about the new site, please let me know!
