---
title: 'New Features for this Blog'
date: 2019-12-29
tags:
  - Blog
slug: blog-new-features
---

2019 has been a year of gatsby updates for this site. So, I wanted to end this year with the same
spirit. And, I am hoping this is going to be the begining of maturity of the looks and features of
this blog. In the upcoming year, I plan to focus mainly on content, specifically related to
medicine, AI and proramming.

<!-- more -->

{% callout "tip" %}

**TL;DR**

Updates to this blog UI:

- Using [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer) to enable custom
  code blocks with copy to clipboard button
- Medium-like highlight text to share
- [goatcounter](https://www.goatcounter.com/) for analytics

{% endcallout %}

Here is a list of all the new features that I have lately added to this:

- updated codeblocks with copy and language indicator
- Medium-like highlight to share text feature
- Simplify navigation bar links
- Update footer to include social links
- Use postlist for similar posts
- Add substack subscription
- Add [goatcounter](https://www.goatcounter.com/) for analytics
- CSS updates for blokquote, TLDR, Update components etc.
- fix edit on github links

In the following, I want to highlight some of these in little more detail:

### Updated codeblocks component

One of the biggest updates that I made here has been in code blocks. Till now, I have been using
the
[gatsby-remark-prismjs](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-prismjs)
plugin. However, for mdx files, the recommended way is to use the
[prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer) library, as this
also supports more advanced features like use of live code blocks via
[react-live](https://github.com/FormidableLabs/react-live). This approach additionally provides a
lot of freedom to any user-defined features like copy to clipboard, language indicator etc.

I have followed following gatsby themes to create a `Code` component that can have features like
copy to clipboard, language indicator etc:
[gatsby-theme-minimal-blog](https://www.gatsbyjs.org/packages/@lekoarts/gatsby-theme-minimal-blog/),
and [gatsby-theme-novela](https://github.com/narative/gatsby-theme-novela).

Here is a partial peek at my final solution:

```js
const Copy = ({ toCopy }) => {
  const [hasCopied, setHasCopied] = useState(false);

  function copyToClipboardOnClick() {
    if (hasCopied) return;

    copyToClipboard(toCopy);
    setHasCopied(true);

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }

  return (
    <CopyButton onClick={copyToClipboardOnClick} data-a11y='false'>
      {hasCopied ? (
        <>
          Copied <CopiedIcon fill='#6f7177' />
        </>
      ) : (
        <>
          Copy <CopyIcon fill='#6f7177' />
        </>
      )}
    </CopyButton>
  );
};

const Code = ({ codeString, className: blockClassName, metastring = ``, ...props }) => {
  if (props['react-live']) {
    return <LazyLiveProvider code={codeString} noInline={false} theme={theme} />;
  }

  const [language, { title = `` }] = getParams(blockClassName);
  const shouldHighlightLine = calculateLinesToHighlight(metastring);

  return (
    <LazyHighlight {...defaultProps} code={codeString} language={language} theme={theme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <React.Fragment>
          {title && (
            <div className='code-title'>
              <div>{title}</div>
            </div>
          )}
          <div className='gatsby-highlight' data-language={language}>
            <pre className={className} style={style}>
              <Copy toCopy={codeString} />
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line, key: i });
                if (shouldHighlightLine(i)) {
                  lineProps.className = `${lineProps.className} line-highlight`;
                }
                return (
                  <div {...lineProps}>
                    {line.map((token, key) => (
                      <span {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                );
              })}
            </pre>
          </div>
        </React.Fragment>
      )}
    </LazyHighlight>
  );
};

export default Code;
```

Notice, how I have highlighted the filename of the component and the interesting sections of the
code.

The first highlighted section implements the copy to clipboard function. The second section is the
actual implementation of the Code component.

Finally to complete the implementation, two more changes are needed:

- Add `pre` and `code` components to MDXProvider in the post template file, and
- Add relevant css

If you are interested in details of the implementation for your own sites, please take a closer
look at the details of the css at
[./src/styles/components/prism.scss](https://github.com/sadanand-singh/reckoning.dev/blob/master/src/styles/components/prism.scss).

You can see my [github repository](https://github.com/sadanand-singh/reckoning.dev) for complete
details of the implementation.

Finally, this implementation also supports live coding via the react-live library.

### Medium-like highlight to share text

A cool feature in [Medium](https://medium.com/) is the highlight menu that pops up when you select
some text. This menu contains buttons that allow you to perform certain actions on the selected
text like highlight and share.

<figure>
  <img
    src="https://res.cloudinary.com/sadanandsingh/image/upload/v1579064368/medium-share_ancyk2.gif"
    alt="share"
  />
  <figcaption>
    Picture Courtesy:
    <a href="https://maxart2501.github.io/share-this/" target="_blank">
      https://maxart2501.github.io
    </a>
  </figcaption>
</figure>

You can have a look at my
[implementation here](https://github.com/sadanand-singh/reckoning.dev/blob/master/src/components/HighlightShare/HighlightShare.js).

And of course, you can see it in action if you try to select and highlight some text. I only
provide options for facebook, twitter and LinkedIn sharing though.

### Add goatcounter for analytics

[goatcounter.com](https://www.goatcounter.com/) is an open source, privacy aware, extremely light
web analytics service that doesn't need a GDPR notice. To me this sounded like a perfect
replacement for google analytics.

The setup is extremely simple - you sign-up and get a script to include on your pages. The problem
that I faced was how to include bare bones Javascript code in a react component.

{% signup "By the way..." %}
I'm starting an email list for people interested in AI development and programming in general.
If you enjoy that kind of stuff, you can join here and I'll notify you whenever I publish a new post.
No strings attached, unsubscribe anytime.
{% endsignup %}

I ended up using `ScriptTag` from the
[react-script-tag](https://www.npmjs.com/package/react-script-tag) library. This just required me
to save the javascript code in a separate file in static folder and include that using `ScriptTag`
in the layout file. You can have a peek at my implementation in more detail
[here](https://github.com/sadanand-singh/reckoning.dev/blob/master/src/layout/index.js).

And of course, you can see my [public dashboard right here](https://reckoningdev.goatcounter.com/).

### Add substack subscription

I have always wanted to provide a timely update about any new posts and updates to my regular
followers. I first tried [mailchimp](https://mailchimp.com/), however, never felt satisfied with
it. Looking for alternatives brought me to [substack](https://substack.com/). I found this to be a
modern solution that fit my needs. Now, you can see a link to my subscription to all pages,
including one right below.

This was all the major changes that I made to the codebase. Other than these major changes, there
are also many small changes to make the code cleaner and more generic.

Here is hoping to bring to an end to any further updates to the looks of this blog. Please look
forward to content updates on major topics like medicine, deep learning and programming. Do not
forget to subscribe to my newsletter below!
