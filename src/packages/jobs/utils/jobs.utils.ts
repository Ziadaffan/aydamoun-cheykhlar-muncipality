export const isDeadlinePassed = (deadline: Date | null) => {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
};
