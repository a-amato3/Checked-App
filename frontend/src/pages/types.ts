export type SortDirection = 'asc' | 'desc' | null;
export type SortField = 'title' | 'notes' | null;

export const tagColors: { [key: string]: string } = {
  Low: "#DDDDDD",
  Medium: "#FFEEB4",
  High: "#FFB4DC",
  Urgent: "#FFEEB4",
  Noturgent: "#DDDDDD",
}; 
