export type compxDb = {
  id: number;
  user: string;
  host: string;
  name: string;
  port: number;
  driver: string;
  pass: string | null;
  userAccessible: boolean;
};
