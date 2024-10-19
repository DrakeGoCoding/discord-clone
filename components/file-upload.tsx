'use client';

import { FileIcon, Loader2, X } from 'lucide-react';
import Image from 'next/image';

import { UploadDropzone } from '@/lib/uploadthing';
import { getUrlFileType } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: 'messageFile' | 'serverImage';
}

type FileType = 'image' | 'other';

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileType, setFileType] = useState<FileType>('other');

  useEffect(() => {
    if (value) {
      setIsLoading(true);
      getUrlFileType(value)
        .then((type) => {
          setFileType(type?.includes('image') ? 'image' : 'other');
        })
        .finally(() => setIsLoading(false));
    }
  }, [value]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-500" />
        <p className="mt-2 text-sm font-medium">Loading...</p>
      </div>
    );
  }

  if (value && fileType === 'image') {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-full object-cover"
        />
        <button
          className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
          type="button"
          onClick={() => onChange('')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === 'other') {
    return (
      <div className="relative mt-2 flex items-center rounded-md bg-background/10 p-2">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 break-all text-sm text-indigo-500 hover:underline dark:text-indigo-400"
        >
          {value}
        </a>
        <button
          className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
          type="button"
          onClick={() => onChange('')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error) => {
        console.log(error);
      }}
    />
  );
};
