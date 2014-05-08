var safe = require('safe-regex')
  , esc = require('quotemeta')

var sub_rex = /^s\/(.*?)\/(.*?)\/?(\w+)?$/

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

      var fix_rex = new RegExp(esc(parts[1]), (parts[3] || '')
          .replace(/[^ig]/, ''))

      ziggy.say(
          channel
        , user.nick + ' meant "' + previous.replace(fix_rex, parts[2]) + '"'
      )
    }
  }
}
