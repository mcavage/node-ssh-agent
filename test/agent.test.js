// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

var crypto = require('crypto');
var fs = require('fs');
var util = require('util');
var test = require('tape').test;


///--- Globals

var SSHAgentClient;
var client = null;
var privateKey = null;


///--- Start Tests

test('require library', function (t) {
  SSHAgentClient = require('../lib/ssh_agent_client');
  t.ok(SSHAgentClient);
  t.end();
});

test('setup', function (t) {
  client = new SSHAgentClient();
  t.ok(client);

  if (process.env.SSH_PRIVATE_KEY)
    privateKey = fs.readFileSync(process.env.SSH_PRIVATE_KEY, 'ascii');

  t.end();
});

test('request identities', function (t) {
  client.requestIdentities(function(err, keys) {
    t.ifError(err);
    t.ok(keys);
    t.ok(keys.length);
    t.ok(keys[0].type);
    t.ok(keys[0].ssh_key);
    t.ok(keys[0].comment);
    t.ok(keys[0]._raw);
    t.end();
  });
});

test('sign', function (t) {
  client.requestIdentities(function(err, keys) {
    t.ifError(err);
    t.ok(keys);
    t.ok(keys.length);

    var key = keys[0];
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].type === 'ssh-rsa') {
        key = keys[i];
        break;
      }
    }

    var data = new Buffer('Hello World');
    client.sign(key, data, function(err, signature) {
      t.ifError(err);
      t.ok(signature);

      if (privateKey) {
        var signer = crypto.createSign('RSA-SHA1');
        signer.update(data);
        t.equal(signature.signature, signer.sign(privateKey, 'base64'));
      }

      t.end();
    });
  });
});
