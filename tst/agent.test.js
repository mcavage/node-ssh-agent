// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

var crypto = require('crypto');
var fs = require('fs');
var util = require('util');

var SSHAgentClient = require('../lib/ssh_agent_client');



///--- Globals

var client = null;
var privateKey = null;


///--- Start Tests

exports.setUp = function(test, assert) {
  client = new SSHAgentClient();
  assert.ok(client);

  if (process.env.SSH_PRIVATE_KEY)
    privateKey = fs.readFileSync(process.env.SSH_PRIVATE_KEY, 'ascii');

  test.finish();
};


exports.test_request_identities = function(test, assert) {
  client.requestIdentities(function(err, keys) {
    assert.ifError(err);
    assert.ok(keys);
    assert.ok(keys.length);
    assert.ok(keys[0].type);
    assert.ok(keys[0].ssh_key);
    assert.ok(keys[0].comment);
    assert.ok(keys[0]._raw);
    test.finish();
  });
};


exports.test_sign = function(test, assert) {
  client.requestIdentities(function(err, keys) {
    assert.ifError(err);
    assert.ok(keys);
    assert.ok(keys.length);

    var key = keys[0];
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].type === 'ssh-rsa') {
        key = keys[i];
        break;
      }
    }

    var data = new Buffer('Hello World');
    client.sign(key, data, function(err, signature) {
      assert.ifError(err);
      assert.ok(signature);

      if (privateKey) {
        var signer = crypto.createSign('RSA-SHA1');
        signer.update(data);
        assert.equal(signature.signature, signer.sign(privateKey, 'base64'));
      }

      test.finish();
    });
  });
};


exports.tearDown = function(test, assert) {
  test.finish();
};
