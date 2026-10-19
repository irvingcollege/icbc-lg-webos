(function (root) {
  "use strict";
  var video, hls, events = {}, generation = 0, attempt = 0,
    paused = false, active = false, failed = false, attached = false,
    watchdog = null;
  function clearWatchdog() {
    clearTimeout(watchdog);
    watchdog = null;
  }
  function emit(name, value) {
    if (events[name]) events[name](value);
  }
  function valid(token) {
    return active && !failed && token === generation;
  }
  function fail(token, message) {
    if (!valid(token)) return;
    failed = true;
    clearWatchdog();
    video.pause();
    emit("error", message);
  }
  function watch(token) {
    if (!valid(token) || paused || watchdog !== null) return;
    watchdog = setTimeout(function () {
      fail(token, "The stream did not respond. Check your connection and select Retry.");
    }, 20000);
  }
  function start(token) {
    if (!valid(token) || paused || !attached) return;
    var request = ++attempt;
    watch(token);
    try {
      var result = video.play();
      // Some older TV engines return undefined instead of a Promise.
      if (result && typeof result.catch === "function") result.catch(function () {
        if (request === attempt && !paused)
          fail(token, "Playback could not start. Select Retry to try again.");
      });
    } catch (e) {
      fail(token, "Playback could not start. Select Retry to try again.");
    }
  }
  function dispose() {
    generation++;
    attempt++;
    active = false;
    clearWatchdog();
    if (video) {
      video.onplaying = video.onpause = video.onerror = video.onended =
        video.onwaiting = video.onstalled = video.ontimeupdate = null;
    }
    if (hls) {
      hls.destroy();
      hls = null;
    }
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    paused = failed = attached = false;
  }
  root.ICBCPlatform = {
    init: function (el, callbacks) {
      video = el;
      events = callbacks;
      // LG delivers remote keys directly; no Samsung registration or SDK.
    },
    open: function (url) {
      dispose();
      active = true;
      var token = generation;
      video.style.display = "block";
      video.onplaying = function () {
        if (!valid(token)) return;
        if (paused) { video.pause(); return; }
        clearWatchdog();
        emit("ready");
        emit("paused", false);
      };
      video.onpause = function () {
        // Ignore a queued pause event if Play has already resumed the element.
        if (!valid(token) || !video.paused) return;
        paused = true;
        attempt++;
        clearWatchdog();
        emit("paused", true);
      };
      video.onerror = function () {
        fail(token, "Unable to play this video. The stream may be offline or unavailable. Select Retry.");
      };
      video.onended = function () {
        if (!valid(token)) return;
        clearWatchdog();
        emit("ended");
      };
      video.onwaiting = video.onstalled = function () {
        if (!valid(token) || paused) return;
        emit("buffering");
        watch(token);
      };
      var lastTime = -1;
      video.ontimeupdate = function () {
        if (!valid(token)) return;
        if (video.currentTime !== lastTime) {
          clearWatchdog();
          lastTime = video.currentTime;
          if (!paused) watch(token);
        }
        emit("time", { current: video.currentTime, duration: video.duration });
      };
      emit("buffering");
      watch(token);
      if (/\.m3u8(?:\?|$)/i.test(url) &&
          !video.canPlayType("application/vnd.apple.mpegurl") &&
          !video.canPlayType("application/x-mpegURL")) {
        function attach() {
          if (!valid(token)) return;
          if (!root.Hls || !root.Hls.isSupported()) {
            fail(token, "HLS playback is unavailable on this device.");
            return;
          }
          try {
            hls = new root.Hls();
            hls.on(root.Hls.Events.MANIFEST_PARSED, function () {
              if (!valid(token)) return;
              attached = true;
              start(token);
            });
            hls.on(root.Hls.Events.ERROR, function (event, data) {
              if (data.fatal)
                fail(token, "The live stream is offline or could not be loaded. Select Retry.");
            });
            hls.loadSource(url);
            hls.attachMedia(video);
          } catch (e) {
            fail(token, "HLS playback could not start. Select Retry.");
          }
        }
        if (root.Hls) attach();
        else {
          var script = document.createElement("script");
          script.src = "assets/vendor/hls.min.js";
          script.onload = attach;
          script.onerror = function () {
            fail(token, "Browser HLS support could not load. Select Retry.");
          };
          document.head.appendChild(script);
        }
      } else {
        attached = true;
        video.src = url;
        start(token);
      }
    },
    toggle: function () {
      if (paused) this.resume();
      else this.pause();
    },
    pause: function () {
      if (!active || failed) return;
      paused = true;
      attempt++;
      clearWatchdog();
      video.pause();
      emit("paused", true);
    },
    resume: function () {
      if (!active || failed) return;
      paused = false;
      emit("paused", false);
      watch(generation);
      start(generation);
    },
    seek: function (seconds) {
      if (!active || failed) return;
      try {
        if (Number.isFinite(video.duration) && video.duration > 0)
          video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
      } catch (e) {
        emit("error", "Seeking is unavailable for this stream.");
      }
    },
    close: dispose,
    exit: function () {
      dispose();
      if (root.PalmSystem || root.webOSSystem || /Web0S|webOS/i.test(root.navigator.userAgent))
        root.close();
      else emit("exitUnavailable");
    }
  };
})(window);
