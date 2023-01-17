import { authRepository } from "../auth/authRepository";

async function nameCheck(userId: string) {
  console.log("nameCheck : ", userId);
  if (!userId) {
    return null;
  }
  const userData = await authRepository.findByUserId(userId);
  return userData;
}

export { nameCheck };
