module.exports = (posts) => {
return posts.filter((post) => {
    return post.data.featured === true;
    });
};