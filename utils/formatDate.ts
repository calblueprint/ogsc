export default function formatDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDay() + 1}/${date.getFullYear()}`;
}
