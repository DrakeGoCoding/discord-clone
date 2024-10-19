import type { Member, Message, Profile, Server } from '@prisma/client';
import type { Server as NetServer, Socket } from 'net';
import type { NextApiResponse } from 'next';
import type { Server as SocketIOServer } from 'socket.io';

export type MemberWithProfile = Member & {
  profile: Profile;
};

export type ServerWithMembersWithProfiles = Server & {
  members: MemberWithProfile[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export type MessageWithMemberWithProfile = Message & {
  member: MemberWithProfile;
};
