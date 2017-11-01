window.addEventListener("load", function (e){
  document.getElementById("dtmifybtn").addEventListener("click", sound, false);
  prepareOscillator();
},false);

var DTMF={0:[941, 1336],
1:[697, 1209], 2:[697, 1336], 3:[697, 1477],
4:[770, 1209], 5:[770, 1336], 6:[770, 1477],
7:[852, 1209], 8:[852, 1336], 9:[852, 1477]};

//1桁あたりのOnの長さ
var len_digit_beep=150;
//桁区切り
var len_digit_stop=150;
//文字区切り
var len_char_stop=90;
//音声ミックス先
var audioCtx, dest;

var number_only_mode = false;

function sound(){
  var text=document.getElementById("inputbox").value;
  var char_pos=0;
  number_only_mode=/^[0-9]+$/.test(text);
  var len_per_char;
  if (number_only_mode) {
    document.getElementById("curcharnumbox").style.visibility="hidden";
    len_per_char=(len_digit_beep+len_digit_stop)+len_char_stop;
  }else{
    document.getElementById("curcharnumbox").style.visibility="visible";
    len_per_char=(len_digit_beep+len_digit_stop)*5+len_char_stop;
  }

  var char;


  //これが1文字分
  var timer_c=setInterval(()=>{
    if(char_pos>=text.length){ //全文字長以上ならクリア
      clearInterval(timer_c);
    }else{
      //これが1けた分
      //dispLog("\""+text.charAt(char_pos)+"\": "+text.charCodeAt(char_pos).toString(10));
      char=text.charAt(char_pos);
      beep_single_char(char);
      if(char_pos>=1){
        show_before_char(text.charAt(char_pos-1));
      }
      if(char_pos<text.length){
        show_after_char(text.charAt(char_pos+1));
      }
      char_pos++;
    }
  }, len_per_char);
}

//char=>110110
function beep_single_char(char){
  var digit_pos=0;
  var char_digit=("0000"+char.charCodeAt(0).toString(10)).slice(-5);
  show_char(char.replace(/\s/,"　"),char_digit);
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
  document.getElementById("curchar").innerText=char;
  document.getElementById("curcharnumbox").innerText="("+char_num +")";
}
function show_before_char(char) {
  document.getElementById("beforechar").innerText=char;
}
function show_after_char(char) {
  document.getElementById("afterchar").innerText=char;
}

function show_freqs(freqs_text){
  document.getElementById("curfreqbox").innerText=freqs_text;
}

function dispLog(txt){
  document.getElementById("debug").innerText+=txt+"\n";
}