const siteData = require('../../src/_data/site');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = (coll) => {
  const tagList = require('./tagList')(coll);

  const maxPostsPerPage = siteData.paginate;
  const pagedPosts = [];

  Object.keys(tagList).forEach((tagName) => {
    const taggedPosts = [...coll.getFilteredByTag(tagName).filter((item) => !(item.data.draft && isProduction))].reverse();
    const numberOfPages = Math.ceil(taggedPosts.length / maxPostsPerPage);

    for (let pageNum = 1; pageNum <= numberOfPages; pageNum++) {
      const sliceFrom = (pageNum - 1) * maxPostsPerPage;
      const sliceTo = sliceFrom + maxPostsPerPage;

      pagedPosts.push({
        tagName,
        number: pageNum,
        posts: taggedPosts.slice(sliceFrom, sliceTo),
        first: pageNum === 1,
        last: pageNum === numberOfPages
      });
    }
  });

  return pagedPosts;
};
