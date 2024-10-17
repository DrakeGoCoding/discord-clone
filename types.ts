import type { Member, Profile, Server } from '@prisma/client';

export type MemberWithProfile = Member & {
  profile: Profile;
};

export type ServerWithMembersWithProfiles = Server & {
  members: MemberWithProfile[];
};
