export type DeleteSessionRepository = (token: string) => Promise<void>;

export type DeleteSessionInteractor = (token: string) => Promise<void>;

export const makeDeleteSessionInteractor =
  (dependencies: {
    deleteSession: DeleteSessionRepository;
  }): DeleteSessionInteractor =>
  async (token) => {
    await dependencies.deleteSession(token);
  };
