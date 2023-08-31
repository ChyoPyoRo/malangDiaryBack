import { calendarRepository } from "./calendarRepository";

class calendarService {
  static async findDiaryInMonth(
    currentUserId: string,
    month: string,
    year: string
  ) {
    const monthNumber = Number(month);
    const yearNumber = Number(year);

    // console.log(new Date(yearNumber, monthNumber - 1, 1, 0, 0, 0));
    // console.log(new Date(yearNumber, monthNumber, 1, 0, 0, 0));
    //대한민국 표준시 더하기
    const startDate = new Date(yearNumber, monthNumber - 1, 1, 0, 0, 0);
    const lastDate = new Date(yearNumber, monthNumber, 1, 0, 0, 0);
    const result = await calendarRepository.findDiary(
      currentUserId,
      startDate,
      lastDate
    );
    //prisma에서는 datetime 밖에 사용할 수 없어서 time-zone에 따라서 시간 값을 바꿀수 없다
    //그래서 결과값에 따로 9시간을 더해주어야 한다
    //밑에서도 사용하므로 미들웨어로 빼야 함
    for (let i = 0; i < result.length; i++) {
      result[i].createAt.setHours(result[i].createAt.getHours() + 9);
      result[i].updateAt.setHours(result[i].updateAt.getHours() + 9);
    }
    //이렇게 읽어온 값들은
    return result;
  }

  static async findDiaryOnDate(
    currentUserId: string,
    month: string,
    year: string,
    date: string
  ) {
    const monthNumber = Number(month);
    const yearNumber = Number(year);
    const dateNumber = Number(date);
    const startTime = new Date(yearNumber, monthNumber - 1, dateNumber);
    const lastTime = new Date(yearNumber, monthNumber - 1, dateNumber + 1);
    // console.log("start Time : ", startTime, "last Time : ", lastTime);
    const result = await calendarRepository.findDiaryOnDate(
      currentUserId,
      startTime,
      lastTime
    );
    for (let i = 0; i < result.length; i++) {
      result[i].createAt.setHours(result[i].createAt.getHours() + 9);
      result[i].updateAt.setHours(result[i].updateAt.getHours() + 9);
    }
    //없을 경우에는 그냥 빈값으로 전달 하면 됨
    return result;
  }
}

export { calendarService };
