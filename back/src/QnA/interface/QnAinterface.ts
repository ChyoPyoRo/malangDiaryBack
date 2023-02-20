export interface diaryAnswer {
  id: number;
  userId: number;
  questionNumber: number;
  createAt: Date;
  updateAt: Date;
  content: string;
}

export interface diaryQuestion {
  id: number;
  question: string;
}

export interface page {
  page: number;
}

export interface pagenation extends page {
  startDate: Date;
  endDate: Date;
}
