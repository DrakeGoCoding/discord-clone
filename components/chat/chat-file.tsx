import { getUrlFileType } from '@/lib/utils';
import { FileIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ChatFileProps {
  url: string;
}

type FileType = 'image' | 'other';

export const ChatFile = ({ url }: ChatFileProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileType, setFileType] = useState<FileType>('other');

  useEffect(() => {
    if (url) {
      setIsLoading(true);
      getUrlFileType(url)
        .then((type) => {
          setFileType(type?.includes('image') ? 'image' : 'other');
        })
        .finally(() => setIsLoading(false));
    }
  }, [url]);

  if (isLoading) {
    return (
      <div className="flex flex-col py-3">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (fileType === 'image') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border bg-secondary"
      >
        <Image src={url} alt="File" fill className="object-cover" />
      </a>
    );
  }

  return (
    <div className="relative mt-2 flex items-center rounded-md bg-background/10 p-2">
      <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 break-all text-sm text-indigo-500 hover:underline dark:text-indigo-400"
      >
        PDF File
      </a>
    </div>
  );
};
