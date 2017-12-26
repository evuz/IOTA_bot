export interface IChat {
  id: number;
  type: string;
  members: Map<number, boolean>;
  timezone?: number;
}
