/* eslint-disable */
import BaseHeader from "./baseHeader";
import menu from "./menu";
import endpoints from "./endpoints";
import messages from "./messages";
import { bgColors, colors } from "./colors";
import chars from "./chars";
import pageTitles from "./pageTitles";
import AppEnums from "./appEnums";
import * as formatters from "./formatters";

const routes = {};
(function () {
  //prepare routes object from menu
  menu.forEach((mnu) => {
    let kv = mnu.name.toLowerCase();
    routes[kv] = kv;
  });
})();


export const handleLocalStorage = {
  get: (key) => {
    return localStorage.getItem(key) || undefined;
  },
  set: (key, val) => {
    return localStorage.setItem(key, val);
  },
  remove: (key) => {
    return localStorage.removeItem(key);
  },
};



export const config = {
  name: "RWAce",
  info: "We are (Dedicated . Strong . Technophile . Motivated) individuals",
  rightTitle: " Sector 8 D Block",
  contactline: `mail for RWA, ${chars.phone} +91-contact info`,
  cvLink: "",
  header: (method = "GET") => BaseHeader(method),
  enums: {
    localStorage: {
      name: "dprwace_name",
      isLogin: "isLogin",
      userid: "userid",
      isAdmin: "isAdmin",
      loginName: "loginName"
    },
    ...AppEnums,
  },
  menu,
  endpoints,
  messages,
  colors,
  bgColors,
  chars,
  pageTitles,
  routes,
  formatters,
  utils: {
    isLogin: () => window.location.hash.toLowerCase().indexOf("login") !== -1,
  },
};

export const mobileCheck = function () {
  let check = false;
  (function (a) {
    // eslint-disable-next-line
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

export const getLocation = (callback) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      let longlat = { long: pos.coords.longitude, lat: pos.coords.latitude };
      callback(longlat);
    });
  } else {
    callback({ error: "Geolocation is not supported by this browser." });
  }
};

export const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};
export const modal = function (selectorById) {
  const modalClass = "modal-opened";
  const wrap = () => {
    let thisModal = document.getElementById(selectorById);
    let modalClose = document.getElementById(selectorById + "-close");
    let modalWrapper = document.getElementById(selectorById + "-wrapper");
    return { thisModal, modalClose, modalWrapper };
  };

  const that = wrap();

  function openModel() {
    if (that.thisModal === null || that.thisModal === undefined) return;
    that.thisModal.onclick = function (e) {
      e.preventDefault();
      that.modalWrapper.classList.add(modalClass);
    };
  }

  function closeModel() {
    that.modalClose.onclick = function (e) {
      e.preventDefault();
      that.modalWrapper.classList.remove(modalClass);
    };
  }

  return {
    openModel,
    closeModel,
    initModel: function () {
      this.openModel();
      this.closeModel();
      return wrap();
    },
  };
};

export function TTS() {
  const synthesis =
    "speechSynthesis" in window ? window.speechSynthesis : undefined;
  let isSpeaking = false;

  function speechUtteranceChunker(utt, settings, callback) {
    if (!settings.isSpeaking || !isSpeaking) return;
    let newUtt;
    let txt =
      settings && settings.offset !== undefined
        ? utt.text.substring(settings.offset)
        : utt.text;
    if (utt.voice && utt.voice.voiceURI === "native") {
      // Not part of the spec
      newUtt = utt;
      newUtt.text = txt;
      newUtt.addEventListener("end", function () {
        if (speechUtteranceChunker.cancel) {
          speechUtteranceChunker.cancel = false;
        }
        if (callback !== undefined) {
          callback();
        }
      });
    } else {
      let chunkLength = (settings && settings.chunkLength) || 160;
      let pattRegex = new RegExp(
        "^[\\s\\S]{" +
          Math.floor(chunkLength / 2) +
          "," +
          chunkLength +
          "}[.!?,]{1}|^[\\s\\S]{1," +
          chunkLength +
          "}$|^[\\s\\S]{1," +
          chunkLength +
          "} "
      );
      let chunkArr = txt.match(pattRegex);

      if (chunkArr[0] === undefined || chunkArr[0].length <= 2) {
        //call once all text has been spoken...
        if (callback !== undefined) {
          callback();
        }
        return;
      }
      let chunk = chunkArr[0];
      newUtt = new window.SpeechSynthesisUtterance(chunk);
      for (let x in utt) {
        if (utt.hasOwnProperty(x) && x !== "text") {
          newUtt[x] = utt[x];
        }
      }
      newUtt.addEventListener("end", function () {
        if (speechUtteranceChunker.cancel) {
          speechUtteranceChunker.cancel = false;
          return;
        }
        settings.offset = settings.offset || 0;
        settings.offset += chunk.length - 1;
        speechUtteranceChunker(utt, settings, callback);
      });
    }

    if (settings.modifier) {
      settings.modifier(newUtt);
    }
    setTimeout(function () {
      if (!settings.isSpeaking || !isSpeaking) return;
      synthesis.speak(newUtt);
    }, 0);
  }

  let objtts = {};
  objtts = {
    speakOut: (text = "") => {
      if (text === "") return;
      isSpeaking = true;
      let utterance = new window.SpeechSynthesisUtterance(text);
      speechUtteranceChunker(
        utterance,
        {
          chunkLength: 120,
          isSpeaking,
        },
        () => {}
      );
      return objtts;
    },
    stopSpeaking: () => {
      isSpeaking = false;
      if (synthesis === undefined) {
        alert("no voice assistant present");
        return;
      }
      synthesis.cancel();
    },
  };
  return objtts;
}

export const checkNetworkConnection = (watch = false) => {
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  function updateConnectionStatus() {
    let arr = [];
    arr.push('<div class="flex col">');
    arr.push("<span>type: " + connection.type + "</span>");
    arr.push("<span>downlink: " + connection.downlink + " Mb/s" + "</span>");
    arr.push("<span>rtt: " + connection.rtt + " ms" + "</span>");
    arr.push(
      "<span>downlinkMax: " + connection.downlinkMax + " Mb/s" + "</span>"
    );
    arr.push("<span>effectiveType: " + connection.effectiveType + "</span>");
    arr.push("<span>saveData: " + connection.saveData + "</span>");
    arr.push("</div>");
    console.log(arr);
    return arr;
  }

  if (watch) connection.addEventListener("change", updateConnectionStatus);
  return updateConnectionStatus();
};

export const getRandomColor = (type = "bg") => {
  if (type === "bg" || type === "" || type === undefined) {
    let num = Math.floor(Math.random() * bgColors.length);
    return bgColors[num] || "#222";
  } else if (type === "fg") {
    let num = Math.floor(Math.random() * colors.length);
    return colors[num] || "#222";
  }
};
