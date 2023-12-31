// Initialize variables and constants
const icon_play = "&#xe769;";
const icon_stop = "&#xe637;";
const icon_study = "&#xe61e;";
const icon_rest = "&#xe623;";
let t_study = 25 * 60;
let t_rest = 5 * 60;
let plan_name = "Exam";
let plan_time = "2023/09/09 08:00:00";
let isPlay = false;
let isRest = false;
let isShowPlan = false;
let isClock = false;
let localData = {};
let today = null;
let res_time = t_study;
let study_time = 0;

// Get today's date and return it
function getToday() {
  let t = new Date();
  let day = t.getDate();
  let month = t.getMonth() + 1;
  let year = t.getFullYear();
  let tmp =
    year + (month < 10 ? "0" + month : month) + (day < 10 ? "0" + day : day);
  return tmp;
}

// Update the today variable to the current date
function updateToday() {
  today = getToday();
}

// Load local storage data into the localData object
function loadLocalData() {
  updateToday();

  // If local data exists
  if (window.localStorage && window.localStorage.length) {
    for (let i = 0; i < window.localStorage.length; i++) {
      let date = window.localStorage.key(i);
      let data = window.localStorage.getItem(date);
      localData[date] = data;
    }
    console.log("Local data loaded: " + JSON.stringify(localData));

    // If there is data for today, add today's study time
    if (localData[today]) {
      study_time += localData[today];
    }

    if (localData["plan-name"]) {
      plan_name = localData["plan-name"];
      $(".p4 input").eq(0).val(plan_name);
    }

    if (localData["plan-time"]) {
      plan_time = localData["plan-time"];
      $(".p4 input").eq(1).val(plan_time.substr(0, 10));
    }

    if (localData["t_rest"]) {
      t_rest = localData["t_rest"];
      $(".p3 input")
        .eq(1)
        .val(t_rest / 60);
    }

    if (localData["t_study"]) {
      t_study = localData["t_study"];
      $(".p3 input")
        .eq(0)
        .val(t_study / 60);
      res_time = t_study;
      showRestTime();
    }
  } else {
    study_time = 0;
  }
}

// Calculate the remaining seconds into four digits to display
function calTime(t) {
  let min = Math.floor(t / 60);
  let sec = t % 60;
  return [Math.floor(min / 10), min % 10, Math.floor(sec / 10), sec % 10];
}

// Update the countdown timer display
function showRestTime() {
  let arr = calTime(res_time);
  $("#n1").text(arr[0]);
  if (arr[0] == 1) {
    $("#n1").css("transform", "translate(30%)");
  } else {
    $("#n1").css("transform", "none");
  }
  $("#n2").text(arr[1]);
  if (arr[1] == 1) {
    $("#n2").css("transform", "translate(30%)");
  } else {
    $("#n2").css("transform", "none");
  }
  $("#n4").text(arr[2]);
  if (arr[2] == 1) {
    $("#n4").css("transform", "translate(30%)");
  } else {
    $("#n4").css("transform", "none");
  }
  $("#n5").text(arr[3]);
  if (arr[3] == 1) {
    $("#n5").css("transform", "translate(30%)");
  } else {
    $("#n5").css("transform", "none");
  }
}

// Update the current time and battery level display
function showNowTime() {
  let t = new Date();
  let h = t.getHours();
  h = h < 10 ? "0" + h : h;
  let m = t.getMinutes();
  m = m < 10 ? "0" + m : m;
  let s = t.getSeconds();
  s = s < 10 ? "0" + s : s;

  if (navigator.getBattery) {
    navigator.getBattery().then((result) => {
      $(".now-time").text(
        h +
          ":" +
          m +
          ":" +
          s +
          "  Battery: " +
          parseInt(result.level * 100) +
          "%"
      );
    });
  } else {
    $(".now-time").text(h + ":" + m + ":" + s);
  }

  // Toggle clock mode
  if (isClock) {
    let arr = [
      h.toString()[0],
      h.toString()[1],
      m.toString()[0],
      m.toString()[1],
    ];
    $("#n1").text(arr[0]);
    $("#n2").text(arr[1]);
    $("#n4").text(arr[2]);
    $("#n5").text(arr[3]);

    if (arr[0] == 1) {
      $("#n1").css("transform", "translate(30%)");
    } else {
      $("#n1").css("transform", "none");
    }
    $("#n2").text(arr[1]);
    if (arr[1] == 1) {
      $("#n2").css("transform", "translate(30%)");
    } else {
      $("#n2").css("transform", "none");
    }
    $("#n4").text(arr[2]);
    if (arr[2] == 1) {
      $("#n4").css("transform", "translate(30%)");
    } else {
      $("#n4").css("transform", "none");
    }
    $("#n5").text(arr[3]);
    if (arr[3] == 1) {
      $("#n5").css("transform", "translate(30%)");
    } else {
      $("#n5").css("transform", "none");
    }
  } else {
    showRestTime();
  }
}

// Update the planned countdown display
function showPlan() {
  let t = new Date();
  let t0 = new Date(plan_time);
  let ss = t0.getTime() - t.getTime();
  let r_plan_days = parseInt(ss / 1000 / 60 / 60 / 24);
  let r_plan_hours = parseInt((ss / 1000 / 60 / 60) % 24);
  $(".top-right").text(
    "Time until " +
      plan_name +
      ": " +
      r_plan_days +
      " days " +
      r_plan_hours +
      " hours"
  );
}

// Save study time data
function saveStudyTime() {
  console.log("Saving data");
  if (getToday() !== today) {
    study_time = 0;
    updateToday();
  }
  localData[today] = study_time.toFixed(2);
  window.localStorage.setItem(today, study_time);
}

// Update today's study time display
function showStudyTime() {
  $(".top-right").text(
    "Today's study time: " +
      String(Math.floor(study_time / 60)) +
      " minutes " +
      String(study_time % 60) +
      " seconds"
  );
}

// Update the top bar
function showTopBar() {
  showNowTime();
  if (isShowPlan) {
    showPlan();
  } else {
    showStudyTime();
  }
}

// Save settings data
function saveSetting() {
  localData["plan-name"] = plan_name;
  localData["plan-time"] = plan_name;
  localData["t_study"] = t_study;
  localData["t_rest"] = t_rest;
  window.localStorage.setItem("plan-name", plan_name);
  window.localStorage.setItem("plan-time", plan_time);
  window.localStorage.setItem("t_study", t_study);
  window.localStorage.setItem("t_rest", t_rest);
}

// Display the chart
function showEcharts() {
  let myChart = echarts.init(document.getElementById("echarts"));
  let dateArr = [];
  let timeArr = [];
  let re = /^20[0-9]{2}/;

  for (let i in localData) {
    if (re.test(i)) {
      timeArr.push((localData[i] / 60).toFixed(2));

      // Process the original data
      let re1 = /^0/;
      if (re1.test(i.substr(4, 4))) {
        dateArr.push(i[5] + "/" + i[6] + i[7]);
      }
    }
  }

  // Handle data filling with 0
  if (dateArr.length < 4) {
    let n = 4 - dateArr.length;
    if (dateArr.length == 0) {
      let t = new Date();
      t = t.getMonth() + 1 + "/" + t.getDate();
      dateArr.push(t);
      timeArr.push(0);
    }
    for (let j = 0; j < n; j++) {
      let t = new Date();
      t = t.setDate(t.getDate() + j + 1);
      t = new Date(t);
      dateArr.push(t.getMonth() + 1 + "/" + t.getDate());
      timeArr.push(0);
    }
  }

  let option = {
    title: {
      text: "Study Records",
      subtext: "Click anywhere to go back",
      subtextStyle: {
        align: "right",
      },
      left: "center",
      icon: "none",
      textStyle: {
        fontSize: 26,
      },
    },

    xAxis: {
      data: dateArr,
      name: "Date",
    },
    yAxis: {
      name: "Study Time/Minutes",
      max: function (value) {
        return value.max < 30 ? 30 : value.max;
      },
    },
    series: [
      {
        name: "Time (min)",
        type: "bar",
        data: timeArr,
        barMaxWidth: "40%",
        itemStyle: {
          color: "#555",
          normal: {
            label: {
              show: true,
              position: "top",
              formatter: "{c} minutes",
            },
          },
        },
      },
    ],
  };

  myChart.setOption(option);
  return myChart;
}
