---
layout: post
title: "SmagenBot"
date: 2015-07-14 18:51:00
categories: [Past, Programming, Node]
cover: "/assets/images/covers/hal.jpg"
---


I use Telegram, whatsapp alternative messaging application, it contains more features than whatsapp and many benefits, one of these is the possibility to create bots and to try it I decided to make one just for fun.

## Initial Configuration
For API docs you can see [here](https://core.telegram.org/bots/api), everything is very clear and simple, first of all you have to contact the Father's bot to receive a security token to use and register your bot.

## SmagenBot
It's a simple plugins based on bot written in node.js, you can insert new plugins when the bot is alive without restart it and to use it, it is enough to type `/pluginname` this feature allows the bot to stay up always, to insert new functionalities put a simple script into a `plugins` directory and after that put the name of the plugins in the `list.json` file.

## Plugin's template
To create a simple plugin you can see many examples in the `plugins` directory, for example to retrieve os information:

```js
var os = require('os');

var exec = function (param, cb) {
  var uptime;
  if((os.uptime() / 3600 < 24)) {
    uptime = parseInt(os.uptime(), 10) + " Seconds";
  } else if ((os.uptime() / 3600) > 24) { //More than 24Hours
    uptime = parseInt(os.uptime() / 86400, 10) + " Days";
  } else {
    uptime = parseInt(os.uptime() / 3600, 10) + "Minutes";
  }

  return cb([{
    hostname: os.hostname(),
    type: os.type(),
    platform: os.platform(),
    arch: os.arch(),
    uptime: uptime
  }], ["text"]);
};

module.exports = exec;
```

Everything must be done inside the `exec` function and it must be return a callback that returns an array of objects as first parameter and an array of strings as second parameters. The first parameter is composed by an array of objects that contains the information that has to be returned and the second parameter specifies which type of datas will be return and they can be *text*, *photo* and *video*.

Here you can find the repo: [SmagenBot](https://github.com/dlion/smagenBot) 

I made SmagenBot fo personal use so I wrote many plugins for my own needs, if you want to contribute with plugins you are welcome!

![Example](/assets/images/posts/smagenbot.png)
