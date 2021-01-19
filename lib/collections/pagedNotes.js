const siteData = require('../../src/_data/site');

module.exports = (coll) => {
  const allNotes = require('./notes')(coll);

  const maxNotesPerPage = siteData.notesPerPage;
  const numberOfPages = Math.ceil(allNotes.length / maxNotesPerPage);
  const pagedNotes = [];

  for (let pageNum = 1; pageNum <= numberOfPages; pageNum++) {
    const sliceFrom = (pageNum - 1) * maxNotesPerPage;
    const sliceTo = sliceFrom + maxNotesPerPage;

    pagedNotes.push({
      number: pageNum,
      notes: allNotes.slice(sliceFrom, sliceTo),
      first: pageNum === 1,
      last: pageNum === numberOfPages
    });
  }

  return pagedNotes;
};
