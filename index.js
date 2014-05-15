var allWords;
var searchValue = "";
var wordTmpl = [
  '<div class="word"><table>' +
  '  <tr>' +
  '    <th rowspan="1" style="font-size:36px">{{word}}</th>' +
  '    <th>{{sign1}}</th>' +
  '    <th rowspan="2"><div style="margin:-20px 0 0 -9px">{{sign2}}</div></th>' +
  '  </tr>' +
  '</table></div>',
  '<div class="word"><table>' +
  '  <tr>' +
  '    <th rowspan="2" style="font-size:36px">{{word}}</th>' +
  '    <th>{{sign1}}</th>' +
  '    <th rowspan="2"><span style="margin-left:-9px">{{sign3}}</span></th>' +
  '  </tr>' +
  '  <tr>' +
  '    <td><div style="margin-top:-15px">{{sign2}}</div></td>' +
  '  </tr>' +
  '</table></div>',
  '<div class="word"><table>' +
  '  <tr>' +
  '    <th rowspan="3" style="font-size:36px">{{word}}</th>' +
  '    <th><div style="margin:0 0 {{signPos}} 0">{{sign1}}</div></th>' +
  '    <th></th>' +
  '  </tr>' +
  '  <tr>' +
  '    <td>{{sign2}}</td>' +
  '    <td><div style="margin:-5px 0 0 -12px">{{sign4}}</div></td>' +
  '  </tr>' +
  '  <tr>' +
  '    <td><div style="margin-top:-10px">{{sign3}}</div></td>' +
  '    <td></td>' +
  '  </tr>' +
  '</table></div>'
];

function printSingleWord(string) {
  var wordLen = string.length;
  var lastWord = string.substring(wordLen - 1);
  var tmplIdx = '˙ˊˇˋ'.indexOf(lastWord) >= 0 ? wordLen - 3 : wordLen - 2;
  try {
    tmpl(tmplIdx, string);
  } catch (e) {
    console.log(e);
  }
}

$(document).on('ready', function () {
  setInterval(checkTextboxChanged, 0.5);

  function checkTextboxChanged() {
    var currentValue = $('#inputWord').val();
    if (currentValue != searchValue) {
      searchValue = currentValue;
      TextboxChanged(currentValue);
    }
  }

  function TextboxChanged(currentValue) {
    //requestPost(currentValue, function (data) {
    fromJSON(currentValue, function (data) {
      $('#txt').empty();
      var words_signs = data.split(' ');
      var wordsLength = words_signs[0].length;
      for (var i = 0; i < wordsLength; i++) {
        var word = words_signs[0].substring(i, i + 1);
        if (!isChineseChar(word)) {
          words_signs.splice(i + 1, 0, ' ');
        }
        printSingleWord(word + words_signs[i + 1]);
      }
    });
  }

});

function isChineseChar(word) {
  return /[\u3400-\u9FBF]/.test(word);
}

function select(string, idx) {
  return idx > string.length ? '' : string.substring(idx, idx + 1);
}

function tmpl(idx, string) {
  var word = select(string, 0);
  var sign1 = select(string, 1);
  var sign2 = select(string, 2);
  var sign3 = select(string, 3);
  var sign4 = select(string, 4);
  var outputWord = wordTmpl[idx].replace('{{word}}', word)
    .replace('{{sign1}}', sign1)
    .replace('{{sign2}}', sign2)
    .replace('{{sign3}}', sign3)
    .replace('{{sign4}}', sign4)
    .replace('{{signPos}}', sign1 === "˙" ? "-20px" : "-10px");
  $('#txt').append(outputWord);
}

function fromJSON(words, callback) {
  words = words.replace(/\s/g, '');
  words = words.replace(/\n/g, '');
  words = words.replace(/\t/g, '');
  var signsStr = '',
    rtnWord = '';
  if (words.length == 1) {
    try {
      signs = allWords[words].split(' ');
    } catch (e) {
      return;
    }
    $.each(signs, function (idx, w) {
      if (w !== '') {
        rtnWord += words;
        signsStr += ' ' + w;
      }
    });
    callback(rtnWord + signsStr);
    return;
  }
  var words_signs = '';
  for (var i = 0; i < words.length; i++) {
    word = words.substring(i, i + 1);
    try {
      if (i + 1 < words.length) {
        var checkTerm = words.substring(i, i + 2);
        if (termWords.hasOwnProperty(checkTerm)) {
          rtnWord = rtnWord + checkTerm;
          signsStr += termWords[checkTerm] + ' ';
          i++;
          continue;
        }
      }
      rtnWord += word;
      var sign = allWords[word].split(' ')[0];
      signsStr += sign + ' ';
    } catch (e) {

    }
  }
  callback(rtnWord + " " + signsStr);
}