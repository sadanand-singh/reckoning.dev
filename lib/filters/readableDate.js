const { DateTime } = require('luxon');

module.exports = (date, dateOnly=false) => {
  if (dateOnly === true){
    return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('dd-MM');
  }
  return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('d LLLL yyyy hh:mm a');
};
