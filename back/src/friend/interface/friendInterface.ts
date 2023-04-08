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
  sended: boolean; // schema에서는 boolean으로 했는데 그 값이 제대로
}
