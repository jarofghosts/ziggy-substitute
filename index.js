var safe = require('safe-regex')
  , esc = require('quotemeta')

var sub_rex = /^s\/(.*?)\/([^\/]+)(.*?)$/

substitute.help = 'use "s/old string/new string/" to replace `old string` in' +
    ' your previous message with `new string`'

module.exports = substitute

function substitute(ziggy) {
  var messages = {}

  ziggy.on('message', parse_message)

  function parse_message(user, channel, text) {
    if(sub_rex.test(text)) return do_substitution()

    if(!messages[channel]) messages[channel] = {}
    messages[channel][user.nick] = text

    function do_substitution() {
      var previous = messages[channel][user.nick]

      if(!previous) return

      var parts = text.match(sub_rex)

      if(!safe(esc(parts[1]))) return

      var fix_rex = new RegExp(
          esc(parts[1])
        , dedupe((parts[3] || '').replace(/[^ig]/g, ''))
      )

      if(!fix_rex.test(previous)) return

      ziggy.say(
          channel
        , user.nick + ' meant "' + previous.replace(fix_rex, parts[2]) + '"'
      )
    }
  }
}

function dedupe(_str) {
  var str = _str.split('')
    , result = ''

  for(var i = 0, l = str.length; i < l; ++i) {
    if(result.indexOf(str[i]) === -1) result += str[i]
  }

  return result
}
