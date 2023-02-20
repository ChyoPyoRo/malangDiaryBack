import { authRepository } from "../auth/authRepository";

async function nameCheck(userId: number) {
  console.log("nameCheck : ", userId);
  if (!userId) {
    return null;
  }
  const userData = await authRepository.findByUserId(Number(userId));
  return userData;
}

export { nameCheck };
