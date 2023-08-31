import { authRepository } from "../auth/authRepository";

async function loginIdCheck(userId: string) {
  console.log("loginIdCheck : ", userId);
  if (!userId) {
    return null;
  }
  const userData = await authRepository.findByLoginId(String(userId));
  console.log(userData);
  console.log(userData?.name);
  return userData;
}

export { loginIdCheck };
