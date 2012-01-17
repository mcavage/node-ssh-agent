node-ssh-agent is a client binding to the SSH Agent protocol, written in "pure"
node.js.  For now, the operations supported are "list keys" and "sign data"
(which in SSH parlance is `requestIdentities` and `sign`.

## Usage

    var SSHAgentClient = require('ssh-agent');

    var client = new SSHAgentClient();
    var data = new Buffer('Hello World');

    // Try to sign data with an RSA key (will generate
    // an RSA-SHA1 signature).
    client.requestIdentities(function(err, keys) {
      var key = null;
      for (var i = 0; i < keys.length; i++) {
        if (keys[i].type === 'ssh-rsa') {
          key = keys[i];
          break;
        }
      }
      if (!key)
        return;

      client.sign(key, data, function(err, signature) {
        console.log('Signature: ' + signature.signature);
      });
    });


## Installation

    npm install ssh-agent

## License

MIT.

## Bugs

See <https://github.com/mcavage/node-ssh-agent/issues>.
