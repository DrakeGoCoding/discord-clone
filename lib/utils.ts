import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getUrlFileType(url: string) {
  try {
    const response = await fetch(url);
    const type = response.headers.get('content-type');
    return type;
  } catch (error) {
    console.log(error);
    return null;
  }
}
