# RedisPubSub

[Redis](http://code.google.com/p/redis/)

Subscribe/Unsubscribe:

    RedisPubSub.subscribe(key)
    RedisPubSub.unsubscribe(key)

Add callback for initial value and subsequent: 

    RedisPubSub.onMessage = function(key,value) { }

Connected to Redis ready for subscribe commands:

    RedisPubSub.onReady = function() { }

From a different Redis client you might run these commands to publish a new value:

    MULTI
    SET key value
    PUBLISH key value
    EXEC

(Note that if you don't care about having initial values you only need the PUBLISH part.)

There is a sample orbited configuration file included that assumes orbited is being run from the root of an orbited installation and has a full path to the orbited-redis-pubsub directory (for static files). If you want orbited to serve the static files you'll need to change that path and if your serving them another way you'll need to make a symbolic link called orbited in this directory pointing to the orbited/static/ directory.
