export type DeleteSessionRepository = (token: string) => Promise<void>;

export type DeleteSessionInteractor = (token: string) => Promise<void>;

export const makeDeleteSessionInteractor =
  (dependencies: {
    deleteSessionRepository: DeleteSessionRepository;
  }): DeleteSessionInteractor =>
  async (token) => {
    await dependencies.deleteSessionRepository(token);
  };
