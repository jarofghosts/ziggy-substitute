var esc = require('quotemeta')

var sub_rex = /^s\/(.*?)\/(.*?)/

module.exports = substitute

function substitute(ziggy) {
  var messages = {}

  ziggy.on('message', parse_message)

  function parse_message(user, channel, text) {
    if(is_sub.test(text)) return do_substitution()

    if(!messages[channel]) messages[channel] = {}
    messages[channel][user.nick] = text

    function do_substitution() {
      var previous = messages[channel][user.nick]

      if(!previous) return

      var parts = previous.match(sub_rex)

      var fix_rex = new RegExp(esc(parts[0]), 'g')

      ziggy.say(
          channel
        , user.nick + ' meant "' + previous.replace(fix_rex, parts[1]) + '"'
      )
    }
  }
}
