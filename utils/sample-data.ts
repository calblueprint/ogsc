export type User = {
  id: number;
  name: string;
};

/** Dummy user data. */
// eslint-disable-next-line import/prefer-default-export
export const sampleUserData: User[] = [
  { id: 101, name: "Alice" },
  { id: 102, name: "Bob" },
  { id: 103, name: "Caroline" },
  { id: 104, name: "Dave" },
];
