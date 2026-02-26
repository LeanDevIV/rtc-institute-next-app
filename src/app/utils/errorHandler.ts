// utils/errorHandler.ts
import { ZodError } from 'zod';

export function formatZodErrors(error: ZodError) {
  const errors: Record<string, string> = {};
  
  error.issues.forEach((issue) => {
    const field = issue.path[0] as string;
    errors[field] = issue.message;
  });
  
  return errors;
}