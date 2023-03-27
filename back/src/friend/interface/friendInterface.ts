export interface friend {
  friendId: string;
  userId: string;
}

export interface friendDTO extends friend {
  friendName?: string;
  id: number;
}

export interface standByFriend {
  requesterId: string;
  respondentId: string;
}

export interface standByFriendDTO extends standByFriend {
  PK_standByFriend: number;
  relationship: number;
  createAt: Date;
  message?: string;
  respondentName?: string;
  requesterName?: string;
}
