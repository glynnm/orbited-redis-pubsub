RedisPubSub = {};
(function (){
  if (!window["TCPSocket"])
    TCPSocket = Orbited.TCPSocket;

  function decode(s) {
    var msg = [];
    var i = 0;
    while (i < s.length) {
      var end = s.indexOf('\r\n', i)
      if (s[i] === "$") {
        var length = Number(s.substring(i+1, end));
        i = end + 2;
        end = i + length;
        msg.push(s.substring(i, end));
      }
      i = end + 2;
    }
    return msg;
  }

  function encode() {
    var msg = [];
    msg.push("*")
    msg.push(arguments.length);
    msg.push("\r\n");
    for (var i = 0; i < arguments.length; i++) {
      var p = arguments[i];
      msg.push("$");
      msg.push(p.length);
      msg.push("\r\n");
      msg.push(p);
      msg.push("\r\n");
    }
    return msg.join('');
  }

  var tcp = new TCPSocket();
  tcp.open('localhost', 6379, false);

  tcp.onopen = function() {
    if (RedisPubSub.onReady)
      RedisPubSub.onReady();
  };
  tcp.onclose = function(code) { }

  tcp.onread = function(s) { 
    var msg = decode(s);
    if (msg[0] === "message" && RedisPubSub.onMessage)
      RedisPubSub.onMessage(msg[1],msg[2]);
  }

  RedisPubSub.subscribe = function(key) {
    if (tcp.readyState != 3)
      throw "Not connected";

    var initialValue  = new TCPSocket()
    initialValue.open('localhost', 6379, false)//connUrl.render())
    initialValue.onread = function(s) {
      var msg = decode(s);
      if (msg.length > 0 && RedisPubSub.onMessage)
        RedisPubSub.onMessage(key, msg[0]);
      tcp.send( encode( 'subscribe', key ) );
    };
    initialValue.onopen = function() {
      initialValue.send( encode( 'get', key ) );
    };
  }
  /** @param key optional  */
  RedisPubSub.unsubscribe = function(key) {
    tcp.send( key ? encode( 'unsubscribe', key ) : encode( 'unsubscribe' ) );
  }
})();
