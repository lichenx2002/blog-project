export interface BulletinBoardProps {
  id?: number;
  name: string;
  email: string;
  gender: '小哥哥' | '小姐姐';
  content: string;
  createdAt?: string;
  updatedAt?: string;
  status?: 'pending' | 'approved' | 'rejected';
  reply?: string;
  replyTime?: string;
}

export interface BulletinBoardResponse {
  total: number;
  current: number;
  size: number;
  records: BulletinBoardProps[];
}
