export const dateToString = (date: Date): string =>
  `${date.getFullYear()}-${
    date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
