export const dateToString = (date: Date): string =>
  `${date.getFullYear()}-${`0${date.getUTCMonth() + 1}`.slice(
    -2,
  )}-${`0${date.getUTCDate()}`.slice(-2)}`;

export const dateTimeToString = (date: Date): string =>
  `${dateToString(date)}T${`0${date.getUTCHours() + 1}`.slice(
    -2,
  )}:${`0${date.getUTCMinutes()}`.slice(-2)}`;
