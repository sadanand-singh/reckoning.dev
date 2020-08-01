---
title: 'Updating GatsbyJS Looks: A New Home with A New Look'
date: 2019-09-02
tags:
  - Blog
slug: gatsby-theme-new
---

First of all, apologies for a sudden update of the domain name - from datasciencevision.com to the
new address [reckoning.dev](https://reckoning.dev)! I let the old address lease expire and opted
for a new (hopefully better!) home for this blog. The code base has also moved to a
[new repository](https://github.com/sadanand-singh/reckoning.dev).

<!-- more -->

Along with the updated address, you will also a find few big and many small changes in the looks of
the overall theme. When I had [moved to gatsbyJS](hugo-to-gatsby), the overall looks of this site
was very much a replica of [Tania Rascia's Blog](https://www.taniarascia.com/). In last few months,
I have been completely quite here. Although things were not visible in terms of posts, I have been
busy cleaning a lot of things in background, and learning a lot in the process. I have tried to
evolve the looks now to something which is starting to be different than the original blog. Feel
free to add any comments on twitter about any particular visual changes you do not like or would
like to see.

In this post, I am going to summarize the changes I have made. I will also briefly talk of concepts
that I have learnt lately. I will write about some of these topics in more depth later this week.

{% callout "tip" %}

**TL;DR**

Summary of what I have been up to in the last few months. Synopsis of backend code changes and
additional learnings about gatsbyJS, react and Javascript.

{% endcallout %}

## Summary of changes

- Using MDX files as source
- Remove most of third party services like disqus etc.
- Javascript cleanup
- New react components for visualizing code stats data
- React component for similar/related posts
- Additional components like photo grid, medium-like image zoom, tldr and update panels to be used
  directly in mdx files.

### MDX files

[MDX](https://www.gatsbyjs.org/packages/gatsby-plugin-mdx/) is markdown for the component era. It
lets you write JSX embedded inside markdown. It’s a great combination because it allows you to use
markdown’s often terse syntax (such as # heading) for the little things and JSX for more advanced
components. This was a high time I made a move to the future. With this change, now I can have all
the power of react directly in markdown files.

### Removal of third party services and Javascript/CSS cleanup

As promised, I have removed all kinds of invasive third party services. One particular service that
I never liked was disqus, as it introduces numerous ads. Even though I do not have any alternative
for posting comments directly on posts yet, I have decided to remove it. Hopefully, for the time
being all the discussions can happend on twitter itself. I plan to come up with a self hosted
solution in the near future.

I have also learnt a lot more about Javascript and CSS in this quite time. These learning have led
to a lot of cleanup of Javascript, JSX and CSS codes as well.

### Code::Stats visualizations

[Code::Stats](https://codestats.net/) is free stats tracking service for programmers. Users are
awarded with experience points for the amount of programming done. It tracks your usage per day,
hour, language etc. They provide some
[cool visualization](https://codestats.net/users/sadanand-singh) on their site. However, I wanted
to shared additional stats of my coding pattern directly on my website. In this attempt, I use my
usage data directly from their [RESTful API](https://codestats.net/api-docs). Developing this was
one of the best learning experiences of react and Javascript. You can check my final solution live
at [my Code:Stats page](/codestats).

{% signup "By the way..." %}
I'm starting an email list for people interested in AI development and programming in general.
If you enjoy that kind of stuff, you can join here and I'll notify you whenever I publish a new post.
No strings attached, unsubscribe anytime.
{% endsignup %}

### Additional react components

As, mentioned above, now I can use any react component directly in a markdown file. This was a high
time to go crazy about coming up with all kinds of useful components. To start, I was specially
interested in using [medium-like zoom](https://medium.com/design/image-zoom-on-medium-24d146fc0c20)
feature for images (specially for ones hosted on [cloudinary](https://cloudinary.com/)). I used the
[react-medium-image-zoom](https://github.com/rpearce/react-medium-image-zoom) package to create a
[ZoomImage](https://github.com/sadanand-singh/reckoning.dev/blob/master/src/components/ZoomImage.js)
component.

I have also created/used several other interesting components to make markdown content more
appealing and interactive. You can take a look at the photo gallery in action at
[My DL Setup](/mydlsetup/) post. A simple TLDR and Update component usage can be seen on the
[comet review](/track-dl-experiments/) post. I have also added a similar posts component that find
six posts that are most closely related to the current post. The logic is composed of assigning
weights based on the number of matched tags and categories. You can see the details of my
implementation at this site's
[repository](https://github.com/sadanand-singh/reckoning.dev/blob/master/src/components/SimilarPosts.js).
You can see "similar posts" in action right at the end of this post.

I will write about some of the these topics in further details in coming week(s). In the mean time,
you can go through my [repository](https://github.com/sadanand-singh/reckoning.dev) to have a look
at the details of my changes.
