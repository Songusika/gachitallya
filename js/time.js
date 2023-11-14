function getCurrentKorTime() {
  let systemTime = new Date();
  systemTime.setHours(systemTime.getHours() + 9);

  return systemTime;
}

function getMaxDateTime(currentKorTime) {
  const limitDate = 2;

  let maxDateTime = currentKorTime;
  maxDateTime.setDate(currentKorTime.getDate() + limitDate);

  return maxDateTime.toISOString().substring(0, 16);
}

function getMinDateTime(currentKorTime) {
  const limitMin = 3;

  let maxDateTime = currentKorTime;
  maxDateTime.setHours(currentKorTime.getHours() + limitMin);

  return maxDateTime.toISOString().substring(0, 16);
}

function initTimeTag() {
  const maxTime = "23:59";
  let timeElement = document.getElementById("time");
  let currentKorTime = getCurrentKorTime();
  let currentKorTimeStr = currentKorTime.toISOString().substring(0, 16);

  timeElement.value = getMinDateTime(currentKorTime);
  timeElement.min = getMinDateTime(currentKorTime);
  timeElement.max = getMaxDateTime(currentKorTime);
}
