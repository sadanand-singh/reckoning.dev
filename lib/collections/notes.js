module.exports = (coll) => {
  const notes = coll.getFilteredByGlob(['src/notes/*.md']);
  return notes.reverse();
};
