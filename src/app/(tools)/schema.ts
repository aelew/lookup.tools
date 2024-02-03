import { z } from 'zod';

export const formSchema = z.object({
  data: z.string().trim().min(1)
});
