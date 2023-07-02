declare namespace Express {
  type Session = {
    token: string;
    userId: string;
  };
  export interface Request {
    session: Session;
  }
}