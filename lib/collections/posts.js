const isProduction = process.env.NODE_ENV === 'production';
module.exports = (coll) => {
  const posts = coll
      .getFilteredByGlob(['src/posts/*.md'])
      .filter((item) => item.data.permalink !== false)
      .filter((item) => !(item.data.draft && isProduction))
      .reverse();

  function relatedPost(post) {
    if (post.data.thumb) {
      th = post.data.thumb;
    }
    else {
      th = false;
    }
    if (post.data.description){
      desc = post.data.description;
    }
    else {
      desc = false;
    }
    return {
      title: post.data.title,
      url: post.url,
      tags: post.data.tags,
      date: post.date,
      thumb: th,
      draft: post.data.draft,
      description: desc,
    };
  }

  return posts.map((a) => {
    let related = [];
    posts.forEach((b) => {
      if (a.url !== b.url) {
        const alpha = [...a.data.tags].sort();
        const beta = [...b.data.tags].sort();

        const matches = alpha.filter((keyword) => {
          return beta.includes(keyword);
        });

        const score = matches.length;
        const interval = Math.abs(b.date - a.date);
        related.push(Object.assign(relatedPost(b), { score, interval }));
      }
    });
    a.data.related = related
      .sort((a1, b1) => b1.score - a1.score || a1.interval - b1.interval)
      .slice(0, 3);
    return a;
  });
};
