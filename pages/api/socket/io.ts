import type { Server as NetServer } from 'http';
import type { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';

import type { NextApiResponseServerIo } from '@/types';

export const config = {
  api: {
    bodyParser: false
  }
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as never;
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false
    });
    res.socket.server.io = io;
  }
};

export default ioHandler;
