var EE = require('events').EventEmitter

var test = require('tape')

var plugin = require('../')

test('substitutes words correctly', function(t) {
  t.plan(2)

  var ziggy = new EE()

  ziggy.say = check_output

  plugin(ziggy)

  ziggy.emit('message', {nick: 'derp'}, 'herp', 'whaa')
  ziggy.emit('message', {nick: 'derp'}, 'herp', 's/wha/who/')

  function check_output(channel, text) {
    t.equal(text, 'derp meant "whoa"', 'subs characters')
    t.equal(channel, 'herp', 'says to channel')
  }
})

test('does the right thing with special characters', function(t) {
  t.plan(2)

  var ziggy = new EE()

  ziggy.say = check_output

  plugin(ziggy)

  ziggy.emit('message', {nick: 'derp'}, 'herp', 'whaa')
  ziggy.emit('message', {nick: 'derp'}, 'herp', 's/whaa/wha?/')

  function check_output(channel, text) {
    t.equal(text, 'derp meant "wha?"', 'subs characters')
    t.equal(channel, 'herp', 'says to channel')
  }
})
