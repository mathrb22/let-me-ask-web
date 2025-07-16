export type GetRoomsResponse = Array<{
  id: string;
  name: string;
  description?: string;
  questionsCount: number;
  createdAt: string;
}>;
