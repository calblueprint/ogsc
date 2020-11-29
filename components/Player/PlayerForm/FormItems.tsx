function getYears(): string[] {
  const date: Date = new Date();
  const year: number = date.getFullYear();
  const yearList: string[] = [];
  for (let x = 0; x < 10; x += 1) {
    const newYear = year - x;
    yearList.push(newYear.toString());
  }
  return yearList;
}

export const years = getYears();

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getDaysinMonth = (month: number): number => {
  return new Date(new Date().getFullYear(), month, 0).getDate();
};

export const getDays = (month: string): string[] => {
  let dayNum = 31;
  if (month !== "") {
    const monthNum = months.indexOf(month);
    dayNum = getDaysinMonth(monthNum + 1);
  }
  const days = Array.from({ length: dayNum }, (_, i) => (i + 1).toString());
  return days;
};

export function formatDate(text: string): string {
  const day = text.split(" ")[0];
  const month = text.split(" ")[1];
  const year = text.split(" ")[2];
  return `${month.substr(0, 3)} ${day}, ${year}`;
}

export function formatAbsence(text: string): string {
  const date = text.split(" - ")[0];
  const reason = text.split("-")[1];
  const comment = text.split("-")[2];
  const formatedText = `${formatDate(date)},${reason},${comment.substr(
    0,
    16
  )}...`;
  return formatedText;
}

export function formatText(text: string): string {
  const value = text.split("-")[0];
  const date = text.split("-")[1];
  const formatedText = `${value}-${date}`;
  return formatedText;
}

export function formatDA(text: string): string {
  const DA = text.split("-")[0];
  const date = text.split(" - ")[1];
  const formatedText = `${DA.substr(0, 27)}... - ${formatDate(date)}`;
  return formatedText;
}
