let isDestSchool = true;

let destinationSchool = true;
function clearContents() {
  document.getElementById("contents").value = "";
}

function switchDestination() {
  isDestSchool = !isDestSchool;
  changeDestination();
}

function changeDestination() {
  let tmp = document.getElementById("exitArea").value;
  document.getElementById("exitArea").value =
    document.getElementById("rideArea").value;
  document.getElementById("rideArea").value = tmp;

  let tmp2 = document.getElementById("exitAreaBtn").disabled;
  document.getElementById("exitAreaBtn").disabled =
    document.getElementById("rideAreaBtn").disabled;
  document.getElementById("rideAreaBtn").disabled = tmp2;

  if (!isDestSchool) {
    document.getElementById("destMsg").innerHTML = "집에 가보자고~!";
    return;
  }
  document.getElementById("destMsg").innerHTML = "학교 가보자고~";
}
