---
layout: post
title: "ToxiProxy node client"
date: 2016-02-08 10:10:00
categories: [Past, Programming, Node]
cover: "/assets/images/covers/comment.jpg"
---

I saw on github a nice tool to test my applications under certain network and system condition to prove that my tests never fail...

[ToxiProxy](https://github.com/shopify/toxiproxy) is the name of this tool, using it you can reproduce latency issues, network limitations, etc.   
Basically is a TCP proxy, to use it you have to set the configuration options to simulate issues and specific network conditions and after that you have to set it as a proxy on your application, that's all!

## Clients
To use it I saw many clients write in many languages:

> [toxiproxy-ruby](https://github.com/Shopify/toxiproxy-ruby)   
> [toxiproxy-go](https://github.com/Shopify/toxiproxy/tree/master/client)   
> [toxiproxy.net](https://github.com/mdevilliers/Toxiproxy.Net)   
> [toxiproxy-php-client](https://github.com/ihsw/toxiproxy-php-client)

and I saw that the node client missed from the list so I decided to write it.

## ToxiProxy-node
 
You can find it [here](https://github.com/dlion/toxiproxy-node), to use it you can follow this example:
```js
var toxiproxy = require('toxiproxy-node');

//New Client
var client = new toxiproxy('localhost:8474');

//New Proxy
var redis = client.NewProxy({
  name: 'Redis',
  listen: '127.0.0.1:26375',
  upstream: '127.0.0.1:6375'
});

//Create redis Proxy
redis.Create(function(err, body) {
  if(!err) {
    //Set Latency
    redis.SetToxic('latency', 'downstream', {
      enabled: true,
      latency: 1000
    }, function(err, body) {
      //Show Redis downstream info
      redis.Toxics('downstream', function(err, body) {
        if(!err) {
          console.log(body);
          //Delete Redis Proxy
          redis.Delete(function(){});
        }
      });
    });
  }
});
```

## Install
To install it you can use npm: `npm install toxiproxy-node`
