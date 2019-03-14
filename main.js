/*
 * when a sharp is selected as root, root shows in legend but not third or fifth
 */


const notes = {
  '0': 'A',
  '1': {
    sharp: 'A♯',
    flat: 'B♭'
  },
  '2': 'B',
  '3': 'C',
  '4': {
    sharp: 'C♯',
    flat: 'D♭'
  },
  '5': 'D',
  '6': {
    sharp: 'D♯',
    flat: 'E♭'
  },
  '7': 'E',
  '8': 'F',
  '9': {
    sharp: 'F♯',
    flat: 'G♭'
  },
  '10': 'G',
  '11': {
    sharp: 'G♯',
    flat: 'A♭'
  }
};

const scales = {
  'Major Scale': [0, 2, 4, 5, 7, 9, 11],
  'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
  'Melodic Minor (Ascending)': [0, 2, 3, 5, 7, 9, 11],
  'Melodic Minor (Descending)': [0, 2, 3, 5, 7, 8, 10],
  'Diminished Half Whole': [0, 1, 3, 4, 6, 7, 9, 10],
  'Diminished Whole Half': [0, 2, 3, 5, 6, 8, 9, 11],
  'Chromatic Scale': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  'Whole Tone': [0, 2, 4, 6, 8, 10],
  'Octatonic (H-W)': [0, 1, 3, 4, 6, 7, 9, 10],
  'Octatonic (W-H)': [0, 2, 3, 5, 6, 8, 9, 11],
  Ionian: [0, 2, 4, 5, 7, 9, 11],
  Dorian: [0, 2, 3, 5, 7, 9, 10],
  Phrygian: [0, 1, 3, 5, 7, 8, 10],
  Lydian: [0, 2, 4, 6, 7, 9, 11],
  Mixolydian: [0, 2, 4, 5, 7, 9, 10],
  Aeolian: [0, 2, 3, 5, 7, 8, 10],
  Locrian: [0, 1, 3, 5, 6, 8, 10],
  Superlocrian: [0, 1, 3, 4, 6, 8, 10],
  Ultralocrian: [0, 1, 3, 4, 6, 8, 9],
  Iwato: [0, 1, 5, 6, 10],
  'Mixo-Blues': [0, 3, 4, 5, 6, 7, 10],
  Altered: [0, 1, 3, 4, 6, 7, 8, 10],
  Augmented: [0, 3, 4, 6, 8, 11],
  Balinese: [0, 1, 3, 7, 8],
  Byzantine: [0, 1, 4, 5, 7, 8, 11],
  Chinese: [0, 4, 6, 7, 11],
  'Chinese Mongolian': [0, 2, 4, 7, 9]
};

// from 6th string; all notes in relation to 6th string open at index 0
const tunings = {
  Standard: [0, 5, 10, 3, 7, 0],
  Open: [0, 4, 7, 0, 4, 7],
  Drop: [0, 7, 0, 5, 9, 2],
  'Double Drop': [0, 7, 0, 5, 9, 0],
  'Drop Perfect Fourth': [0, 10, 3, 8, 0, 5]
}

// return array holding chromatic scale with A at index 0
function aChromatic() {
  const arr = Object.keys(notes).map(val => notes[val]);
  for(let i = 0; i < arr.length; i++) {
    // combine sharp/flat sub-objects into one single array index
    if(typeof arr[i] === 'object') {
      arr[i] = notes[i]['sharp'] + '/' + notes[i]['flat'];
    }
  }
  return arr;
}

// return array holding chromatic scale with note other than A at index 0
function xChromatic(x) {
  const chrom = aChromatic(),  // A-G# array
        regexSharp = /[A-G]#|[A-G]♯|[A-G]\s*sharp/ig,
        regexFlat = /[A-G]b|[A-G]♭|[A-G]\s*flat/ig;
  let startNoteIndex,  // note that should be index 0 in new array
      fromStartNote;  // array starting from X-X♭
  function sharpOrFlat(sign, EWorSW) {
    if(x[1] !== sign) x = x[0] + sign;
    for(let i = 0; i < chrom.length; i++) {
      if(EWorSW) x = chrom[i];  // EWorSW == endsWith or startsWith
    }
  }
  if(regexSharp.test(x)) sharpOrFlat('♯', chrom[i].startsWith(x));
  if(regexFlat.test(x)) sharpOrFlat('♭', chrom[i].endsWith(x));
  startNoteIndex = chrom.indexOf(x),
  // reorder array s.t. X is at index 0
  fromStartNote = chrom.slice(startNoteIndex).concat(chrom.slice(0, startNoteIndex));
  return fromStartNote;
}

// map chromatic scale across 24-fret string, starting from open tone
function chromToString(open) {
  let frets = [];
  function populateString(chr) {
    let p = 0;
    for(let i = 0; i < 25; i++) {
      frets.push(chr[p]);
      p == 11 ? p = 0 : p++;  // loop scale after 11th index
    }
  }
  open === 'A' ? populateString(aChromatic()) : populateString(xChromatic(open));
  return frets;
}

// convert numeric representation of scale to letter representation
function letterScale(root, scale) {
  let scaleNums;  // create array of selected scale
  const arr = [];  // empty array to hold letter representations of scale
  scales.hasOwnProperty(scale) ? scaleNums = scales[scale] : scaleNums = scale;
  for(let i = 0; i < scaleNums.length; i++) {
    arr.push(xChromatic(root)[scaleNums[i]]);
  }
  return arr;
}

// map scale across 24-fret string, starting from open tone or next applicable one
function fullStringScale(open, root, scale) {
  let scaleFrets = [];
  for(let i = 0; i < 25; i++) {
    if(letterScale(root, scale).includes(chromToString(open)[i])) {
      scaleFrets.push(i);
    }
  }
  return scaleFrets;
}

// populate tuning preset dropdown from tunings object
(function popTuningPresetDd() {
  let tuningNames = Object.keys(tunings);
  (function() {
    for(let i = 0; i < tuningNames.length; i++) {
      let opt = document.createElement("option");
      let textnode = document.createTextNode(tuningNames[i]);
      opt.setAttribute("id", tuningNames[i]);
      opt.appendChild(textnode);
      document.getElementById("preset-dd").appendChild(opt);
    }
  })();
})();

// populate dropdown
function popDd(arr, ddId) {
  for(let i = 0; i < arr.length; i++) {
    let opt = document.createElement("option");
    let textnode = document.createTextNode(arr[i]);
    opt.setAttribute("id", 'note' + i);
    opt.appendChild(textnode);
    document.getElementById(ddId).appendChild(opt);
    reorderStrDefaults(opt, ddId, i);
  }
}

// common tunings as defaults for different numbers of string dropdowns
function reorderStrDefaults(e, id, x) {
  const numStr = document.getElementById("strings").getElementsByTagName('select').length;
  if(id == 'key-dd' && x == 3) e.setAttribute('selected', 'selected');  // set key default to C
  // C# F# B E A D G B E -- guitar; 8-string std with added bass C#
  function nineStringDdDefaults() {
    if((id == 'string-9') && x == 4) e.setAttribute('selected', 'selected');
    eightStringDdDefaults();
  }
  // F# B E A D G B E -- guitar; 7-string std with added bass F#
  function eightStringDdDefaults() {
    if((id == 'string-8') && x == 9) e.setAttribute('selected', 'selected');
    sevenStringDdDefaults();
  }
  // B E A D G B E -- guitar; E std w added bass B
  function sevenStringDdDefaults() {
    if((id == 'string-7') && x == 2) e.setAttribute('selected', 'selected');
    sixStringDdDefaults();
  }
  // E A D G B E -- guitar; E standard
  function sixStringDdDefaults() {
    if((id == 'string-6') && x == 7) e.setAttribute('selected', 'selected');
    if((id == 'string-5') && x == 0) e.setAttribute('selected', 'selected');
    if((id == 'string-4') && x == 5) e.setAttribute('selected', 'selected');
    if((id == 'string-3') && x == 10) e.setAttribute('selected', 'selected');
    if((id == 'string-2') && x == 2) e.setAttribute('selected', 'selected');
    if((id == 'string-1') && x == 7) e.setAttribute('selected', 'selected');
  }
  // B E A D G -- bass; E std with added bass B
  function fiveStringDdDefaults() {
    if((id == 'string-5') && x == 2) e.setAttribute('selected', 'selected');
    fourStringDdDefaults();
  }
  function fourStringDdDefaults() {
    if((id == 'string-4') && x == 7) e.setAttribute('selected', 'selected');
    if((id == 'string-3') && x == 0) e.setAttribute('selected', 'selected');
    if((id == 'string-2') && x == 5) e.setAttribute('selected', 'selected');
    if((id == 'string-1') && x == 10) e.setAttribute('selected', 'selected');
  }
  if(numStr === 9) nineStringDdDefaults();
  if(numStr === 8) eightStringDdDefaults();
  if(numStr === 7) sevenStringDdDefaults();
  if(numStr === 6) sixStringDdDefaults();
  if(numStr === 5) fiveStringDdDefaults();
  if(numStr === 4) fourStringDdDefaults();
}

function generateDiagram() {
  const box = document.getElementById("scale-container");
  const numStrings = document.getElementById("strings").getElementsByTagName('select').length;
  let strBox, str;
  let n = 1;
  function clearOldDiag(dPath) {
    while(document.querySelector(dPath))
      document.querySelector(dPath).remove();
  }
  clearOldDiag("#scale-container > .str_box");  // clear diagram
  clearOldDiag("#scale-tab > p");  // clear poopingGuy
  while(n <= numStrings) {
    strBox = document.createElement('div');
    str = document.createElement('div');
    strBox.setAttribute("class","str_box");
    str.setAttribute("class", "str");
    strBox.setAttribute("id","str_box" + n);
    str.setAttribute("id","str" + n);
    strBox.appendChild(str);
    box.appendChild(strBox);
    if(n < numStrings) {
      let t = 0, fret;
      while(t <= 25) {
        fret = document.createElement('div');
        fret.setAttribute("class", "fret");
        fret.setAttribute("id", "fret" + t);
        fret.style.left = (t * 4) + "%";
        if(t === 0) fret.style.background = "grey";
        strBox.appendChild(fret);
        ++t;
      }
    }
    ++n;
  }
  for(i = numStrings; i > 0; i--) {
    mapDots(i);
  }
}

function mapDots(x) {
  const setDdOp = (dd) => document.getElementById(dd).options[document.getElementById(dd).selectedIndex].value;  // setDropdownOption
  const stringKey = setDdOp("string-" + x), keyDd = setDdOp("key-dd"), scaleDd = setDdOp("scale-dd");
  const stringScale = fullStringScale(stringKey, keyDd, scaleDd);
  const third = letterScale(keyDd, scaleDd)[2], fifth = letterScale(keyDd, scaleDd)[4];
  function muhfugginDots(b, fretIndex) {  // muhfugginDots(strBox, fretNumber)
    let dot = document.createElement('div');
    // noteIndex loops 0-11
    let noteIndex = fretIndex < 12 ? fretIndex : fretIndex >= 12 && fretIndex < 24 ? fretIndex - 12 : fretIndex - 24;
    // letter representation of noteIndex
    let currentNote = xChromatic(stringKey)[noteIndex];
    dot.setAttribute("class", "dot");
    // ...id="{string-number}_{open-note}_{fret-number}_{note}"...
    dot.setAttribute("id", x + "_" + stringKey + "_" + fretIndex + "_" + currentNote);
    if(currentNote == keyDd) dot.style.background = "black";  // color root note black
    if(currentNote == third) dot.style.background = "white";  // color third white
    if(currentNote == fifth) dot.style.background = "hsl(195, 72%, 84%)";  // color fifth light blue
    dot.style.left = 1.62 + (4 * fretIndex) + "%";  // open fret 1.62% fm left; every successive note, add 4
    b.appendChild(dot);
  }
  for(let i = 0; i < stringScale.length; i++) {
    muhfugginDots(document.getElementById("str_box" + x), stringScale[i]);
  }
}

// img appears in scale container after 3min idle with nothing in container
function poopingGuy() {
  const pooper =
    "\n░░░░░░░░░░░█▀▀░░█░░░░░░\n░░░░░░▄▀▀▀▀░░░░░█▄▄░░░░\n░░░░░░█░█░░░░░░░░░░▐░░░\n░░░░░░▐▐░░░░░░░░░▄░▐░░░\n░░░░▄▀░░░░░░░░▐░▄▄▀░░░░\n░░▄▀░░░▐░░░░░█▄▀░▐░░░░░\n░░█░░░▐░░░░░░░░▄░█░░░░░\n░░░█▄░░▀▄░░░░▄▀▐░█░░░░░\n░░░█▐▀▀▀░▀▀▀▀░░▐░█░░░░░\n░░▐█▐▄░░▀░░░░░░▐░█▄▄░░░\n░░░▀▀▄░░░░░░░░▄▐▄▄▄▀░░░\n░░░░░░░░░░░░░░░░░░░░░░░",
    scaleTabDiv = document.getElementById("scale-tab"),
    p = document.createElement('p'),
    pText = document.createTextNode(pooper);
    p.appendChild(pText);
    setTimeout(function() {
      // if no p or div element within #scale-tab, insert this one instead
      if(!(document.querySelector("#scale-tab > p") || document.querySelector("#scale-container > div"))) scaleTabDiv.appendChild(p);
    }, 180000);
}

// populate all the string dropdowns ("string-1"-"string-6"; A-G#)
function popStrDds() {
  for(let n = 1; n <= document.getElementById("strings").getElementsByTagName('select').length; n++) {
    popDd(aChromatic(), "string-" + n);
  }
}

// reinit str dd opts to empty st when popStrDds() runs in either of following 2 fxns, existing dds won't have repeats of chrom scale
function reinitStrDd() {
  for(let n = 1; n <= document.getElementById("strings").getElementsByTagName('select').length; n++) {
    document.getElementById("string-" + n).options.length = 0;
  }
}

function removeString() {
  let strNum = document.getElementById("strings").getElementsByTagName('select').length;
  let lowString = document.getElementById("string-" + strNum);
  lowString.remove();
  reinitStrDd();
  popStrDds();
}

function addString() {
  let strNum = document.getElementById("strings").getElementsByTagName('select').length;
  let n2s = strNum.toString();  // numToStr
  const n2sEW = n => n2s.endsWith(n);
  const suCon = /[4-9|0]/.test(n2s[n2s.length - 1]) || strNum == 11 || strNum == 12 || strNum == 13;  // suffixConditional; these #s get 'th' after them
  let newNode = document.createElement('select');
  let referenceNode = document.querySelector('#strings select');
  newNode.setAttribute('id', 'string-' + ++strNum);
  let numSuffix = suCon ? 'th' : n2sEW(1) ? 'st' : n2sEW(2) ? 'nd' : n2sEW(3) ? 'rd' : '';
  newNode.setAttribute('title', strNum + numSuffix + ' String');
  referenceNode.parentNode.insertBefore(newNode, referenceNode);
  reinitStrDd();
  popStrDds();
}

// change text in legend from "root", "third", "fifth" to their corresponding notes when hovered over
function showNote(legendDiv) {
  let dotLabel = legendDiv.getElementsByClassName("dot-label")[0];
  const origText = dotLabel.innerHTML;
  const setDdOp = (dd) => document.getElementById(dd).options[document.getElementById(dd).selectedIndex].value;  // setDropdownOption
  const scAr = n => xChromatic(letterScale(setDdOp("key-dd"), setDdOp("scale-dd"))[n])[0];  // scaleArray
  let noteDd = dotLabel.innerHTML == "root" ? setDdOp("key-dd") : dotLabel.innerHTML == "third" ? scAr(2) : scAr(4);
  dotLabel.innerHTML = noteDd;
  legendDiv.onmouseout = logMouseOut;
  function logMouseOut() {
    dotLabel.innerHTML = origText;
  }
}

function adjustAllStrings(st) {
  let allStr = document.getElementById("strings").getElementsByTagName('select');
  let strNum = allStr.length;
  let curStr, selId, sLen;  // currentString, selectedId, selectedLength
  for(let i = 0; i < strNum; i++) {
    curStr = allStr[i], selId = curStr.options[curStr.selectedIndex].id, sLen = selId.length;
    curStr.selectedIndex = (selId == 'note' + (st == - 1 ? 0 : 11) ? (st == - 1 ? 11 : 0) : parseInt((sLen > 5 ? selId.substring(sLen - 2) : selId[sLen - 1])) + st);
  }
}

function raiseAllStringsHalfStep() {
  adjustAllStrings(1);
}

function lowerAllStringsHalfStep() {
  adjustAllStrings(-1);
}

function presetTunings() {
  let selId, selSuffix;
  const allStr = document.getElementById("strings").getElementsByTagName('select');  // all string dropdowns
  const bsid = allStr[0].options[allStr[0].selectedIndex].id;  // bassStringId
  const bsSuffix = parseInt(bsid.length > 5 ? bsid.substring(bsid.length - 2) : bsid[bsid.length - 1]);  // bassStringSuffix
  const strNum = allStr.length;
  const preDd = document.getElementById("preset-dd");
  const tuningPreset = preDd[preDd.selectedIndex].value;
  const presetArray = tunings[tuningPreset];  // [0, 5, 10, 3, 7, 0]
  // if bass string is "A" leave array as is, else adjust array in relation to bass string
  const adjustedArray = bsSuffix == 0 ? presetArray : presetArray.map(function(x) {
    return (x + bsSuffix) > 11 ? (x + bsSuffix) - 12 : x + bsSuffix;
  });
  for(let i = 0; i < strNum; i++) {
    selId = allStr[i].options[allStr[i].selectedIndex].id;
    selSuffix = selId.length > 5 ? selId.substring(selId.length - 2) : selId[selId.length - 1];
    allStr[i].selectedIndex = adjustedArray[i];
  }
}

document.getElementById("preset-dd").onchange = presetTunings;

popStrDds();  // populate string dropdowns from notes object
popDd(aChromatic(), "key-dd");  // populate key dropdown (A-G#) from notes object
popDd(Object.keys(scales), "scale-dd");  // populate scale dropdown from scales object
