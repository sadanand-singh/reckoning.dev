---
title: 'Switching to Hugo from Nikola'
date: 2017-06-23
tags:
  - Blog
slug: 'nikola-to-hugo'
thumb: hugo.jpg
---

I have been using [Nikola] to build this Blog. Its a great static site build system that is based
on Python. However, It has some crazy amount of dependencies (to have reasonable looking site). It
uses [restructured text (rst)][rst] as the primary language for content creation.

Personally, I use
markdown for almost every thing else - taking notes, making diary, code documentation etc.
Furthermore, given Nikola tries to support almost everything in a static site builder, lately its
is becoming more and more bloated.

Case in point, recently it got support for [shortcodes] and although that did enable me to write
posts in Markdown, but it is so difficult to develop them (It does not help to have almost no
documentation/guide for their development). They are heavily tied to the [plugin] system with light
support for template based shortcodes.

[nikola]: https://getnikola.com
[rst]: https://docutils.sourceforge.net/rst.html
[shortcodes]: https://getnikola.com/handbook.html#shortcodes
[plugin]: https://plugins.getnikola.com

I really have nothing against [Nikola]. However, I did not feel at home - I wanted a light system
that focused on markdown and had all the flexibilities that I wanted. My research soon brought me
to [Hugo][hugo].

[hugo]: https://gohugo.io

## Hugo - the blazing fast site generator

[Hugo][hugo] is a light weight, fast and modern static website engine written in [go]. It literally
takes just milliseconds to build your entire site. For the given lightness, it is highly flexible
as well. You can organize your content however you want with any URL structure, group your content
using your own indexes and categories and define your own _metadata_ in any format: `YAML`, `TOML`
or `JSON`. I was impressed! Keep in my mind, `python` is still my primary language of programming
for scripting and machine learning. And, I have almost no programming experience with `go`.

[go]: https://golang.org

I chose `YAML` for all the configuration as well as _metadata_. In my next step to make this move,
I had to choose the theme for my blog. If you have been following me, I have been using several
flavors of [bootswatch] themes. So my first goal was implement my heavily modified version of
[bootswatch] theme in Hugo.

[bootswatch]: https://bootswatch.com

## Bootswatch Theme

Developing a theme from scratch (_Well, the implementation from scratch, as I all I am trying to do
is mimic/improvise my current theme from Nikola_) turned out to be a great adventure and learning
exercise. It helped me understand the Hugo architecture in great detail. It did help to have some
good [documentation] written for developers, not users! Although, Hugo's documentation can surely
help itself with some cleaning and some fresher looks!

Hugo uses [go templates] with many extra functions and set of variables provided by Hugo. I
personally feel Hugo's template-ing system to be more flexible and easier than [mako] - the one
used by default by Nikola.

[go templates]: https://golang.org/pkg/text/template/
[mako]: https://www.makotemplates.org
[documentation]: https://gohugo.io/overview/introduction/

I converted almost all of Mako theme from Nikola website to Hugo's format and architecture with
additions (copied features and code) from a nice theme called
[TranqilPeak](https://themes.gohugo.io/hugo-tranquilpeak-theme/). In particular, I liked their
fonts, search feature for taxonomies pages. Copying these features also meant I had to learn a bit
of `javascript` and `css`. You can find a working copy of my theme in the `src` branch of
[gihub repository](https://github.com/sadanand-singh/sadanand-singh.github.io) of my blog. I plan
to release this theme as a standalone theme in near future though.

## Shortcodes

Given I am using a [bootstrap] based theme, I like having a lot of its features available to me
when I am writing in Markdown. The powerful template based
[shortcodes in Hugo](https://gohugo.io/extras/shortcodes/) provide a great way to write custom HTML
code inside markdown. I feel Hugo shortcodes are so powerful, you could develop your own grammar of
markup language in it! :yum:

Some of my shortcodes are basically based on [bootstrap] classes like panel, label, emphasis,
highlighted text, and block quotes. I also liked the figure command provided by restructured text
in Nikola. Luckily, same features are available in Hugo using a default shortcode called `figure`.
Hugo also provides several other useful default shortcodes like `youtube`, `ref/relref` for
referencing other posts etc.

[bootstrap]: https://getbootstrap.com

I have also some additional shortcodes for code-blocks and math. I will be detailing about them in
a bit more detail in the next section. All of my shortcodes are available with the theme in the
same [github repo](https://github.com/sadanand-singh/sadanand-singh.github.io).

## Other Caveats and Fixes

While converting to Hugo was fun, there were some caveats. The issues I faced were mainly with home
page, site search, and `ipython` notebook posts.

### Home Page with Content and Post Lists

Getting home page to work was very simple. Hugo documentation page provides a very clear details
about order in which various templates are looked. For home page, you will need to provide a
template for `index.html`. Then Inside the `content` folder, you can put the _metadata_ and the
_content_ for the home page in a file named `_index.md`.

I also added following template code in the index.html template to get list of posts with machine
learning related tags.

### tipue Search

Hugo has support for several output formats, including HTML and JSON. For implementing
[tipue search](http://www.tipue.com/search/), we need to generate a JSON file with site content.
This can be done by adding following to the configuration file:

```html
# Output formats outputs: home: [ "HTML", "JSON"] page: [ "HTML"]
```

and, using the following `index.json` template.

Now, include the following `css` in the `<head>` of your pages:

```html
<link
  href="//cdnjs.cloudflare.com/ajax/libs/Tipue-Search/5.0.0/tipuesearch.css"
  rel="stylesheet"
  type="text/css"
/>
```

The following `modal` code is needed to display the search results, preferably at the end of the
**body** of the HTMLpage:

```html
<div id="search-resuts" class="modal fade" role="dialog" style="height: 80%;">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">×</button>
        <h4 class="modal-title">Search Results:</h4>
      </div>
      <div
        class="modal-body"
        id="tipue_search_content"
        style="max-height: 600px; overflow-y: auto;"
      ></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
```

Finally, the following `javascript` in the lower end of the **body** of HTML pages:

```html
<script>
  $(document).ready(function () {
    var url1 = 'https://cdnjs.cloudflare.com/ajax/libs/Tipue-Search/5.0.0/tipuesearch_set.js';
    var url2 = 'https://cdnjs.cloudflare.com/ajax/libs/Tipue-Search/5.0.0/tipuesearch.min.js';
    $.when(
      $.getScript(url1),
      $.getScript(url2),
      $.Deferred(function (deferred) {
        $(deferred.resolve);
      })
    ).done(function () {
      $('#tipue_search_input').tipuesearch({
        mode: 'json',
        contentLocation: '/index.json',
      });
      $('#tipue_search_input').keyup(function (e) {
        if (e.keyCode == 13) {
          $('#search-results').modal();
        }
      });
    });
  });
</script>
```

And, of course you will need a form/input for performing the search:

```html
<span class="navbar-form navbar-right">
  <input type="text" id="tipue_search_input" class="form-control" placeholder="Search" />
</span>
```

### Code Highlighting

Although, by default Hugo provides code highlighting using the [pygments](https://pygments.org), I
prefer to use client-side highlighting using [prism.js](https://prismjs.com). I also use the
following [plugins](https://prismjs.com/#plugins) of `prism.js` for line numbers, highlighting and
cleanup of white space:

- [Line Highlight](https://prismjs.com/plugins/line-highlight/)
- [Line Numbers](https://prismjs.com/plugins/line-numbers/)
- [Normalize Whitespace](https://prismjs.com/plugins/normalize-whitespace/)

Finally, I create a shortcode called _code-block_ to add relevant classes and variables around
`<code>` and `<pre>` tags so that prism could highlight code correctly.

### jupyter Notebooks as Posts

One of the advantages of using Nikola is that, it provides native support for writing Blog posts in
`jupyter` notebooks.

But, on some Google search, I found this neat
[solution](https://sharmamohit.com/post/jupyter-notebooks-in-blog/).

In summary, the setup is very simple - Use the linked
[jupyter.css](https://sharmamohit.com/css/jupyter.css) file in your template, then add this `css`
file to relevant pages. I do the this based on a _metadata_ variable `notebook: true` via the
following template code:

```markup
{{ if .Params.notebook }}
<link href="{{ $.Site.BaseURL }}css/jupyter.css" rel="stylesheet" type="text/css" />
{{ end }}
```

Then for any jupyter notebook, convert it to basic HTML using the following command:

```html
jupyter nbconvert --to html --template basic *source_file.ipynb*
```

Finally, create a markdown file for your post to put the contents of this HTML file. Works like
charm since markdown supports including raw HTML code!

### Latex Math Equations

I used [katex](https://github.com/Khan/KaTeX) for using math in markdown. I was having some issue
with the multi-line display math equations, so I created a shortcode called _tex_ to write HTML
code explicitly so that `katex` could handle that easily.

I added following code in the `<head>` of all of posts:

```html
{{ if .Params.hasMath }}
<link
  rel="stylesheet"
  href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css"
  integrity="sha384-wITovz90syo1dJWVh32uuETPVEtGigN07tkttEqPv+uR2SE/mbQcG7ATL28aI9H0"
  crossorigin="anonymous"
/>
{{ end }}
```

And the following script at the end of the `<body>` section:

```html
{{ if .Params.hasMath }}
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js"
  integrity="sha384-/y1Nn9+QQAipbNQWU65krzJralCnuOasHncUFXGkdwntGeSvQicrYkiUBwsgUqc1"
  crossorigin="anonymous"
></script>
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/contrib/auto-render.min.js"
  integrity="sha256-ExtbCSBuYA7kq1Pz362ibde9nnsHYPt6JxuxYeZbU+c="
  crossorigin="anonymous"
></script>
<script>
  renderMathInElement(document.body, {
    delimiters: [
      { left: '\\\\begin{equation*}', right: '\\\\end{equation*}', display: true },
      { left: '$$', right: '$$', display: true },
      { left: '\\\[', right: '\\\]', display: true },
      { left: '$', right: '$', display: false },
      { left: '\\\(', right: '\\\)', display: false },
    ],
  });
</script>
{{ end }}
```

Now, whenever, I need to add math equations in a post, enable the `hasMath: true` parameter in its
_metadata_.

So there you have it. I have my Blog now up and running with Hugo. Hope I will be more active here,
since it now takes only seconds to deploy once I have a post written. No excuses now! 😜
