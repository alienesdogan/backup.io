$(() => {
  let myChart;
  let isFullScreen = false;
  // Screen constant
  let noSleep = new NoSleep();

  // Event bindings
  // Fullscreen
  $(".main").on("click", () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
    isFullScreen = !isFullScreen;
  });

  // Disable help page
  $(".p0").on("click", () => {
    $(".page").hide();
    $(".p1").show();
    noSleep.enable();
  });

  // Show help page
  $(".top-left").on("click", () => {
    $(".page").hide();
    $(".p0").show();
  });

  // Toggle study time/planned countdown
  $(".top-right").on("click", () => {
    isShowPlan = !isShowPlan;
  });

  // Toggle clock
  $(".top-center").on("click", () => {
    isClock = !isClock;
    showNowTime();
  });

  // Play button
  $(".play").on("click", () => {
    if (!isPlay && isRest) {
      res_time = t_study;
      isRest = false;
    }

    if (!isPlay) {
      $(".play").html(icon_stop);
    }

    if (isPlay) {
      $(".play").html(icon_play);
    }

    isPlay = !isPlay;
  });

  // Reset time
  $(".reset").on("click", () => {
    if (isRest) {
      res_time = t_rest;
    } else {
      res_time = t_study;
    }
    showRestTime();
  });

  // Settings
  $(".setting").on("click", () => {
    $(".page").hide();
    $(".p2").show();
  });

  // Set study/break time
  $(".p2 .option")
    .eq(0)
    .on("click", () => {
      $(".page").hide();
      $(".p3").show();
    });

  // Set planned countdown
  $(".p2 .option")
    .eq(1)
    .on("click", () => {
      $(".page").hide();
      $(".p4").show();
    });

  // View study history
  $(".p2 .option")
    .eq(2)
    .on("click", () => {
      $(".page").hide();
      $(".p5").show();
      myChart = showEcharts();
    });

  // Clear local data
  $(".p2 .option")
    .eq(3)
    .on("click", () => {
      window.localStorage.clear();
      localData = [];
      alert("Cleared local data!");
    });

  // Go back
  $(".p2 .option")
    .eq(4)
    .on("click", () => {
      $(".page").hide();
      $(".p1").show();
    });

  // Page 3: Set study/break time
  $(".p3-bottom button")
    .eq(0)
    .on("click", () => {
      t_study = $(".p3 input").eq(0).val() * 60;
      t_rest = $(".p3 input").eq(1).val() * 60;

      if (isRest) {
        res_time = t_rest;
      } else {
        res_time = t_study;
      }

      showRestTime();
      saveSetting();
    });

  $(".p3-bottom button")
    .eq(1)
    .on("click", () => {
      $(".page").hide();
      $(".p2").show();
    });

  // Page 4: Set planned countdown
  $(".p4-bottom button")
    .eq(0)
    .on("click", () => {
      plan_name = $(".p4 input").eq(0).val();
      plan_time = $(".p4 input").eq(1).val() + " " + "08:00:00";

      if (isShowPlan) {
        showPlan();
      }

      saveSetting();
    });

  $(".p4-bottom button")
    .eq(1)
    .on("click", () => {
      $(".page").hide();
      $(".p2").show();
    });

  // Page 5: Go back
  $(".p5").on("click", () => {
    $(".page").hide();
    $(".p2").show();
    myChart.clear();
  });

  // Initialization, set timers
  loadLocalData();
  setInterval(() => {
    showTopBar();

    // If countdown is zero
    if (!res_time) {
      isRest = !isRest;

      if (isRest) {
        $(".top-left").html(icon_rest + "Resting");
        res_time = t_rest;
      } else {
        $(".top-left").html(icon_study + "Studying");
        res_time = t_study;
      }
    }

    // If playing
    if (isPlay && !isClock) {
      if (!isRest) {
        $(".top-left").html(icon_study + "Studying");
        study_time++;
      }

      res_time--;
      saveStudyTime();
      showRestTime();
    }
  }, 1000);
});
