SystemJS.config({
  devConfig: {
    'map': {
      'plugin-babel': 'npm:systemjs-plugin-babel@0.0.17',
      'angular-mocks': 'npm:angular-mocks@1.6.1'
    }
  },
  packages: {
    'src': {
      'defaultExtension': 'js'
    }
  },
  transpiler: 'plugin-babel'
});

SystemJS.config({
  packageConfigPaths: [
    'npm:@*/*.json',
    'npm:*.json',
    'github:*/*.json'
  ],
  map: {
    'angular': 'npm:angular@1.6.1',
    'angular-bootstrap': 'github:angular-ui/bootstrap-bower@2.4.0',
    'angular-local-storage': 'npm:angular-local-storage@0.5.0',
    'angular-route': 'npm:angular-route@1.6.1',
    'angular-ui/ui-select': 'github:angular-ui/ui-select@0.19.6',
    'angular-ui/ui-sortable': 'github:angular-ui/ui-sortable@0.16.1',
    'assert': 'github:jspm/nodelibs-assert@0.2.0-alpha',
    'babel': 'npm:babel-core@6.21.0',
    'bootstrap-sass': 'github:twbs/bootstrap-sass@3.3.7',
    'bowser': 'npm:bowser@1.6.0',
    'buffer': 'github:jspm/nodelibs-buffer@0.2.0-alpha',
    'child_process': 'github:jspm/nodelibs-child_process@0.2.0-alpha',
    'constants': 'github:jspm/nodelibs-constants@0.2.0-alpha',
    'crypto': 'github:jspm/nodelibs-crypto@0.2.0-alpha',
    'dcneiner/Downloadify': 'github:dcneiner/Downloadify@0.2.1',
    'events': 'github:jspm/nodelibs-events@0.2.0-alpha',
    'font-awesome': 'npm:font-awesome@4.7.0',
    'fs': 'github:jspm/nodelibs-fs@0.2.0-alpha',
    'h5bp/html5-boilerplate': 'github:h5bp/html5-boilerplate@5.3.0',
    'html5-boilerplate': 'npm:html5-boilerplate@0.0.1',
    'intro.js': 'npm:intro.js@2.4.0',
    'lodash': 'npm:lodash@4.17.4',
    'malihu-custom-scrollbar-plugin': 'github:malihu/malihu-custom-scrollbar-plugin@3.1.5',
    'module': 'github:jspm/nodelibs-module@0.2.0-alpha',
    'ng-file-upload': 'npm:ng-file-upload@12.2.13',
    'os': 'github:jspm/nodelibs-os@0.2.0-alpha',
    'path': 'github:jspm/nodelibs-path@0.2.0-alpha',
    'process': 'github:jspm/nodelibs-process@0.2.0-alpha',
    'stream': 'github:jspm/nodelibs-stream@0.2.0-alpha',
    'string_decoder': 'github:jspm/nodelibs-string_decoder@0.2.0-alpha',
    'util': 'github:jspm/nodelibs-util@0.2.0-alpha',
    'vm': 'github:jspm/nodelibs-vm@0.2.0-alpha',
    'wesnolte/jOrgChart': 'github:wesnolte/jOrgChart@master'
  },
  packages: {
    'npm:babel-core@6.21.0': {
      'map': {
        'babel-helpers': 'npm:babel-helpers@6.16.0',
        'babel-generator': 'npm:babel-generator@6.21.0',
        'babel-messages': 'npm:babel-messages@6.8.0',
        'babel-code-frame': 'npm:babel-code-frame@6.20.0',
        'babel-template': 'npm:babel-template@6.16.0',
        'babel-types': 'npm:babel-types@6.21.0',
        'babel-register': 'npm:babel-register@6.18.0',
        'babel-traverse': 'npm:babel-traverse@6.21.0',
        'convert-source-map': 'npm:convert-source-map@1.3.0',
        'babel-runtime': 'npm:babel-runtime@6.20.0',
        'json5': 'npm:json5@0.5.1',
        'minimatch': 'npm:minimatch@3.0.3',
        'babylon': 'npm:babylon@6.14.1',
        'debug': 'npm:debug@2.6.0',
        'private': 'npm:private@0.1.6',
        'path-is-absolute': 'npm:path-is-absolute@1.0.1',
        'slash': 'npm:slash@1.0.0',
        'source-map': 'npm:source-map@0.5.6',
        'lodash': 'npm:lodash@4.17.4'
      }
    },
    'npm:babel-generator@6.21.0': {
      'map': {
        'babel-messages': 'npm:babel-messages@6.8.0',
        'babel-runtime': 'npm:babel-runtime@6.20.0',
        'babel-types': 'npm:babel-types@6.21.0',
        'source-map': 'npm:source-map@0.5.6',
        'lodash': 'npm:lodash@4.17.4',
        'jsesc': 'npm:jsesc@1.3.0',
        'detect-indent': 'npm:detect-indent@4.0.0'
      }
    },
    'npm:babel-messages@6.8.0': {
      'map': {
        'babel-runtime': 'npm:babel-runtime@6.20.0'
      }
    },
    'npm:babel-helpers@6.16.0': {
      'map': {
        'babel-runtime': 'npm:babel-runtime@6.20.0',
        'babel-template': 'npm:babel-template@6.16.0'
      }
    },
    'npm:babel-template@6.16.0': {
      'map': {
        'lodash': 'npm:lodash@4.17.4',
        'babylon': 'npm:babylon@6.14.1',
        'babel-traverse': 'npm:babel-traverse@6.21.0',
        'babel-types': 'npm:babel-types@6.21.0',
        'babel-runtime': 'npm:babel-runtime@6.20.0'
      }
    },
    'npm:babel-types@6.21.0': {
      'map': {
        'babel-runtime': 'npm:babel-runtime@6.20.0',
        'lodash': 'npm:lodash@4.17.4',
        'esutils': 'npm:esutils@2.0.2',
        'to-fast-properties': 'npm:to-fast-properties@1.0.2'
      }
    },
    'npm:babel-register@6.18.0': {
      'map': {
        'babel-core': 'npm:babel-core@6.21.0',
        'babel-runtime': 'npm:babel-runtime@6.20.0',
        'lodash': 'npm:lodash@4.17.4',
        'mkdirp': 'npm:mkdirp@0.5.1',
        'source-map-support': 'npm:source-map-support@0.4.8',
        'home-or-tmp': 'npm:home-or-tmp@2.0.0',
        'core-js': 'npm:core-js@2.4.1'
      }
    },
    'npm:babel-traverse@6.21.0': {
      'map': {
        'babel-code-frame': 'npm:babel-code-frame@6.20.0',
        'babel-messages': 'npm:babel-messages@6.8.0',
        'babel-runtime': 'npm:babel-runtime@6.20.0',
        'babel-types': 'npm:babel-types@6.21.0',
        'babylon': 'npm:babylon@6.14.1',
        'debug': 'npm:debug@2.6.0',
        'lodash': 'npm:lodash@4.17.4',
        'invariant': 'npm:invariant@2.2.2',
        'globals': 'npm:globals@9.14.0'
      }
    },
    'npm:babel-code-frame@6.20.0': {
      'map': {
        'chalk': 'npm:chalk@1.1.3',
        'esutils': 'npm:esutils@2.0.2',
        'js-tokens': 'npm:js-tokens@2.0.0'
      }
    },
    'npm:babel-runtime@6.20.0': {
      'map': {
        'regenerator-runtime': 'npm:regenerator-runtime@0.10.1',
        'core-js': 'npm:core-js@2.4.1'
      }
    },
    'npm:debug@2.6.0': {
      'map': {
        'ms': 'npm:ms@0.7.2'
      }
    },
    'npm:minimatch@3.0.3': {
      'map': {
        'brace-expansion': 'npm:brace-expansion@1.1.6'
      }
    },
    'npm:source-map-support@0.4.8': {
      'map': {
        'source-map': 'npm:source-map@0.5.6'
      }
    },
    'npm:chalk@1.1.3': {
      'map': {
        'ansi-styles': 'npm:ansi-styles@2.2.1',
        'has-ansi': 'npm:has-ansi@2.0.0',
        'escape-string-regexp': 'npm:escape-string-regexp@1.0.5',
        'strip-ansi': 'npm:strip-ansi@3.0.1',
        'supports-color': 'npm:supports-color@2.0.0'
      }
    },
    'npm:detect-indent@4.0.0': {
      'map': {
        'repeating': 'npm:repeating@2.0.1'
      }
    },
    'npm:invariant@2.2.2': {
      'map': {
        'loose-envify': 'npm:loose-envify@1.3.0'
      }
    },
    'npm:mkdirp@0.5.1': {
      'map': {
        'minimist': 'npm:minimist@0.0.8'
      }
    },
    'npm:home-or-tmp@2.0.0': {
      'map': {
        'os-homedir': 'npm:os-homedir@1.0.2',
        'os-tmpdir': 'npm:os-tmpdir@1.0.2'
      }
    },
    'npm:loose-envify@1.3.0': {
      'map': {
        'js-tokens': 'npm:js-tokens@2.0.0'
      }
    },
    'npm:brace-expansion@1.1.6': {
      'map': {
        'balanced-match': 'npm:balanced-match@0.4.2',
        'concat-map': 'npm:concat-map@0.0.1'
      }
    },
    'npm:has-ansi@2.0.0': {
      'map': {
        'ansi-regex': 'npm:ansi-regex@2.0.0'
      }
    },
    'npm:strip-ansi@3.0.1': {
      'map': {
        'ansi-regex': 'npm:ansi-regex@2.0.0'
      }
    },
    'npm:repeating@2.0.1': {
      'map': {
        'is-finite': 'npm:is-finite@1.0.2'
      }
    },
    'npm:is-finite@1.0.2': {
      'map': {
        'number-is-nan': 'npm:number-is-nan@1.0.1'
      }
    },
    'github:jspm/nodelibs-buffer@0.2.0-alpha': {
      'map': {
        'buffer-browserify': 'npm:buffer@4.9.1'
      }
    },
    'npm:buffer@4.9.1': {
      'map': {
        'base64-js': 'npm:base64-js@1.2.0',
        'isarray': 'npm:isarray@1.0.0',
        'ieee754': 'npm:ieee754@1.1.8'
      }
    },
    'github:jspm/nodelibs-stream@0.2.0-alpha': {
      'map': {
        'stream-browserify': 'npm:stream-browserify@2.0.1'
      }
    },
    'github:jspm/nodelibs-os@0.2.0-alpha': {
      'map': {
        'os-browserify': 'npm:os-browserify@0.2.1'
      }
    },
    'npm:stream-browserify@2.0.1': {
      'map': {
        'readable-stream': 'npm:readable-stream@2.2.2',
        'inherits': 'npm:inherits@2.0.3'
      }
    },
    'npm:readable-stream@2.2.2': {
      'map': {
        'isarray': 'npm:isarray@1.0.0',
        'inherits': 'npm:inherits@2.0.3',
        'string_decoder': 'npm:string_decoder@0.10.31',
        'buffer-shims': 'npm:buffer-shims@1.0.0',
        'process-nextick-args': 'npm:process-nextick-args@1.0.7',
        'util-deprecate': 'npm:util-deprecate@1.0.2',
        'core-util-is': 'npm:core-util-is@1.0.2'
      }
    },
    'github:jspm/nodelibs-crypto@0.2.0-alpha': {
      'map': {
        'crypto-browserify': 'npm:crypto-browserify@3.11.0'
      }
    },
    'npm:crypto-browserify@3.11.0': {
      'map': {
        'inherits': 'npm:inherits@2.0.3',
        'browserify-cipher': 'npm:browserify-cipher@1.0.0',
        'create-ecdh': 'npm:create-ecdh@4.0.0',
        'create-hash': 'npm:create-hash@1.1.2',
        'browserify-sign': 'npm:browserify-sign@4.0.0',
        'create-hmac': 'npm:create-hmac@1.1.4',
        'diffie-hellman': 'npm:diffie-hellman@5.0.2',
        'public-encrypt': 'npm:public-encrypt@4.0.0',
        'randombytes': 'npm:randombytes@2.0.3',
        'pbkdf2': 'npm:pbkdf2@3.0.9'
      }
    },
    'npm:create-hash@1.1.2': {
      'map': {
        'inherits': 'npm:inherits@2.0.3',
        'ripemd160': 'npm:ripemd160@1.0.1',
        'cipher-base': 'npm:cipher-base@1.0.3',
        'sha.js': 'npm:sha.js@2.4.8'
      }
    },
    'npm:browserify-sign@4.0.0': {
      'map': {
        'create-hmac': 'npm:create-hmac@1.1.4',
        'inherits': 'npm:inherits@2.0.3',
        'create-hash': 'npm:create-hash@1.1.2',
        'bn.js': 'npm:bn.js@4.11.6',
        'elliptic': 'npm:elliptic@6.3.2',
        'browserify-rsa': 'npm:browserify-rsa@4.0.1',
        'parse-asn1': 'npm:parse-asn1@5.0.0'
      }
    },
    'npm:create-hmac@1.1.4': {
      'map': {
        'create-hash': 'npm:create-hash@1.1.2',
        'inherits': 'npm:inherits@2.0.3'
      }
    },
    'npm:public-encrypt@4.0.0': {
      'map': {
        'create-hash': 'npm:create-hash@1.1.2',
        'randombytes': 'npm:randombytes@2.0.3',
        'bn.js': 'npm:bn.js@4.11.6',
        'browserify-rsa': 'npm:browserify-rsa@4.0.1',
        'parse-asn1': 'npm:parse-asn1@5.0.0'
      }
    },
    'npm:diffie-hellman@5.0.2': {
      'map': {
        'randombytes': 'npm:randombytes@2.0.3',
        'bn.js': 'npm:bn.js@4.11.6',
        'miller-rabin': 'npm:miller-rabin@4.0.0'
      }
    },
    'npm:pbkdf2@3.0.9': {
      'map': {
        'create-hmac': 'npm:create-hmac@1.1.4'
      }
    },
    'npm:browserify-cipher@1.0.0': {
      'map': {
        'browserify-aes': 'npm:browserify-aes@1.0.6',
        'browserify-des': 'npm:browserify-des@1.0.0',
        'evp_bytestokey': 'npm:evp_bytestokey@1.0.0'
      }
    },
    'npm:browserify-aes@1.0.6': {
      'map': {
        'create-hash': 'npm:create-hash@1.1.2',
        'inherits': 'npm:inherits@2.0.3',
        'evp_bytestokey': 'npm:evp_bytestokey@1.0.0',
        'cipher-base': 'npm:cipher-base@1.0.3',
        'buffer-xor': 'npm:buffer-xor@1.0.3'
      }
    },
    'npm:create-ecdh@4.0.0': {
      'map': {
        'bn.js': 'npm:bn.js@4.11.6',
        'elliptic': 'npm:elliptic@6.3.2'
      }
    },
    'npm:browserify-des@1.0.0': {
      'map': {
        'inherits': 'npm:inherits@2.0.3',
        'cipher-base': 'npm:cipher-base@1.0.3',
        'des.js': 'npm:des.js@1.0.0'
      }
    },
    'npm:evp_bytestokey@1.0.0': {
      'map': {
        'create-hash': 'npm:create-hash@1.1.2'
      }
    },
    'npm:elliptic@6.3.2': {
      'map': {
        'bn.js': 'npm:bn.js@4.11.6',
        'inherits': 'npm:inherits@2.0.3',
        'hash.js': 'npm:hash.js@1.0.3',
        'brorand': 'npm:brorand@1.0.6'
      }
    },
    'npm:cipher-base@1.0.3': {
      'map': {
        'inherits': 'npm:inherits@2.0.3'
      }
    },
    'npm:sha.js@2.4.8': {
      'map': {
        'inherits': 'npm:inherits@2.0.3'
      }
    },
    'npm:browserify-rsa@4.0.1': {
      'map': {
        'bn.js': 'npm:bn.js@4.11.6',
        'randombytes': 'npm:randombytes@2.0.3'
      }
    },
    'npm:parse-asn1@5.0.0': {
      'map': {
        'browserify-aes': 'npm:browserify-aes@1.0.6',
        'create-hash': 'npm:create-hash@1.1.2',
        'evp_bytestokey': 'npm:evp_bytestokey@1.0.0',
        'pbkdf2': 'npm:pbkdf2@3.0.9',
        'asn1.js': 'npm:asn1.js@4.9.1'
      }
    },
    'npm:miller-rabin@4.0.0': {
      'map': {
        'bn.js': 'npm:bn.js@4.11.6',
        'brorand': 'npm:brorand@1.0.6'
      }
    },
    'npm:des.js@1.0.0': {
      'map': {
        'inherits': 'npm:inherits@2.0.3',
        'minimalistic-assert': 'npm:minimalistic-assert@1.0.0'
      }
    },
    'npm:hash.js@1.0.3': {
      'map': {
        'inherits': 'npm:inherits@2.0.3'
      }
    },
    'npm:asn1.js@4.9.1': {
      'map': {
        'bn.js': 'npm:bn.js@4.11.6',
        'inherits': 'npm:inherits@2.0.3',
        'minimalistic-assert': 'npm:minimalistic-assert@1.0.0'
      }
    },
    'github:jspm/nodelibs-string_decoder@0.2.0-alpha': {
      'map': {
        'string_decoder-browserify': 'npm:string_decoder@0.10.31'
      }
    },
    'github:malihu/malihu-custom-scrollbar-plugin@3.1.5': {
      'map': {
        'jquery': 'npm:jquery@3.1.1'
      }
    },
    'npm:font-awesome@4.7.0': {
      'map': {
        'css': 'github:systemjs/plugin-css@0.1.32'
      }
    },
    'github:dcneiner/Downloadify@0.2.1': {
      'map': {
        'jquery': 'npm:jquery@3.1.1'
      }
    },
    'github:wesnolte/jOrgChart@master': {
      'map': {
        'jquery': 'npm:jquery@3.1.1'
      }
    }
  }
});
