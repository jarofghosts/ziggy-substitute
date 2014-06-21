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

test('trailing slash is optional', function(t) {
  t.plan(2)

  var ziggy = new EE()

  ziggy.say = check_output

  plugin(ziggy)

  ziggy.emit('message', {nick: 'derp'}, 'herp', 'there\'s two things')
  ziggy.emit('message', {nick: 'derp'}, 'herp', 's/two/three')

  function check_output(channel, text) {
    t.equal(text, 'derp meant "there\'s three things"', 'subs characters')
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

test('can specify modifiers', function(t) {
  t.plan(2)

  var ziggy = new EE()

  ziggy.say = check_output

  plugin(ziggy)

  ziggy.emit('message', {nick: 'derp'}, 'herp', 'WHAA whaa')
  ziggy.emit('message', {nick: 'derp'}, 'herp', 's/wha/who/igl')

  function check_output(channel, text) {
    t.equal(text, 'derp meant "whoA whoa"', 'subs characters')
    t.equal(channel, 'herp', 'says to channel')
  }
})

test('dedupes modifiers', function(t) {
  t.plan(2)

  var ziggy = new EE()

  ziggy.say = check_output

  plugin(ziggy)

  ziggy.emit('message', {nick: 'derp'}, 'herp', 'WHAA whaa')
  ziggy.emit('message', {nick: 'derp'}, 'herp', 's/wha/who/iiggggl')

  function check_output(channel, text) {
    t.equal(text, 'derp meant "whoA whoa"', 'subs characters')
    t.equal(channel, 'herp', 'says to channel')
  }
})
