import { authRepository } from "../auth/authRepository";

async function loginIdCheck(userId: string) {
  console.log("loginIdCheck : ", userId);
  if (!userId) {
    return null;
  }
  const userData = await authRepository.findByLoginId(String(userId));
  return userData;
}

export { loginIdCheck };
