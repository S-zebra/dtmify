window.addEventListener("load", function (e){
  document.getElementById("dtmifybtn").addEventListener("click", sound, false);
  prepareOscillator();
},false);

var DTMF={0:[941, 1336],
1:[697, 1209], 2:[697, 1336], 3:[697, 1477],
4:[770, 1209], 5:[770, 1336], 6:[770, 1477],
7:[852, 1209], 8:[852, 1336], 9:[852, 1477]};

//1桁あたりのOnの長さ
var len_digit_beep=80;
//桁区切り
var len_digit_stop=50;
//文字区切り
var len_char_stop=70;
//音声ミックス先
var audioCtx, dest;

var number_only_mode = false;

function sound(){
  var text=document.getElementById("inputbox").value;
  var char_pos=0;
  var len_per_char=(len_digit_beep+len_digit_stop)*text.charCodeAt(char_pos).toString(10).length+len_char_stop;
  var char;
  number_only_mode=/^[0-9]+$/.test(text);

  //これが1文字分
  var timer_c=setInterval(()=>{
    if(char_pos>=text.length){ //全文字長以上ならクリア
      clearInterval(timer_c);
    }else{
      //これが1けた分
      //dispLog("\""+text.charAt(char_pos)+"\": "+text.charCodeAt(char_pos).toString(10));
      char=text.charAt(char_pos);
      beep_single_char(char);
      char_pos++;
      show_char(char,char.charCodeAt(0).toString(10));
    }
  }, len_per_char);
}

//char=>110110
function beep_single_char(char){
  var digit_pos=0;
  var char_digit=char.charCodeAt(0).toString(10);

  if(number_only_mode){
    char_digit-=48;
    beep(DTMF[char_digit], len_digit_beep);
    show_freqs(char_digit+": ["+DTMF[char_digit]+"] Hz");
    return;
  }

  var curdigit=char_digit.charAt(digit_pos);
  var timer_d=setInterval(()=>{
    if(digit_pos>=char_digit.length){
      clearInterval(timer_d);
    }else{
      curdigit=char_digit.charAt(digit_pos);
      show_freqs(curdigit+": ["+DTMF[curdigit]+"] Hz");
      //dispLog("Oscillating "+curdigit+", "+DTMF[curdigit]+", digit_pos: "+digit_pos);
      beep(DTMF[curdigit], len_digit_beep);
      digit_pos++;
    }
  }, len_digit_beep+len_digit_stop);
}

function beep(freq, time){
  var coords=freq.length;
  for(var i=0;i<coords;i++){
    var osc=audioCtx.createOscillator();
    osc.type="sine";
    osc.frequency.value=freq[i];
    osc.connect(dest);
    osc.start();
    osc.stop(audioCtx.currentTime+(time/1000));
  }
  return osc;
}

function prepareOscillator(){
  audioCtx = new window.webkitAudioContext();
  dest = audioCtx.destination;
}

function show_char(char, char_num) {
  document.getElementById("curcharbox").innerText=char;
  document.getElementById("curcharnumbox").innerText="("+char_num +")";
}

function show_freqs(freqs_text){
  document.getElementById("curfreqbox").innerText=freqs_text;
}

function dispLog(txt){
  document.getElementById("debug").innerText+=txt+"\n";
}