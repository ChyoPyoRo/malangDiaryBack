export interface friend {
  friendId: number;
  userId: number;
}

export interface friendDTO extends friend {
  friendName?: string;
  id: number;
}

export interface standByFriend {
  requester: number;
  respondent: number;
}

export interface standByFriendDTO extends standByFriend {
  relationship: number;
  createAt: Date;
  PK_standByFriend: number;
  message?: string;
  respondentName?: string;
  requesterName?: string;
}
