const getSimilarityScore = function(tags, b) {
    const alpha = [...tags].sort();
    const beta = [...b.data.tags].sort();

    const matches = alpha.filter((keyword) => {
        return beta.includes(keyword);
    });

    return matches.length;
  };

module.exports = (posts, tags, date, url) => {
  return posts.filter((post) => {
    return getSimilarityScore(tags, post) > 0 && post.url !== url;
    }).sort((a,b) => {
      const score_a = getSimilarityScore(tags, a);
      const score_b = getSimilarityScore(tags, b);
      const interval_a = Math.abs(a.date - date);
      const interval_b = Math.abs(b.date - date);

      return score_b - score_a || interval_a - interval_b;
    })
    .slice(0, 3);
  };