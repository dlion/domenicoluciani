---
layout: post
title: "Workflowy, how to change a theme with an hack"
date: 2013-03-20 01:00:05
categories: [Past, Programming, Hacking, Security]
cover: "/assets/images/covers/mrobot.png"
lang: en
---

I was advised about a nice site that allows to organize my thoughts using many hierarchical lists, every programmer should try it!

Here some examples:

![one](/assets/images/posts/workflowy1.jpg)

![two](/assets/images/posts/workflowy2.jpg)

it has many functionalities and looking around I see some settings I can change.

![three](/assets/images/posts/workflowy3.jpg)

Woah, I can change the theme and the font. Good, that "white" was too much "white" for me; when I saw a "hacker" theme: black and green, so l337, I have to try it!

But for to do that I have to pay...

### Local sweet Local

I found in the source the css file `media/versioned/20130318210837/themes/desktop.default.css` so using the developers tools I changed that with `media/versioned/20130318210837/themes/desktop.hacker.css` and **TADAAN** everything worked like a charm but I'm not even satisfied, I want to know more about it.

### May the theme be with you

I tried to set a font and to sniff the request using Live HTTP headers, a firefox's plugin and I saw this

![four](/assets/images/posts/workflowy4.jpg)

To change the font, the page sent a simple `font=serif` parameter to the `/change_settings` route, very interesting! So I tried to reply a request sending `theme=hacker` as parameter and **BAANG** `{"success": true}` I'm *in*!

![five](/assets/images/posts/workflowy5.jpg)

Checking if I'm a **pro** user it's enough to fix it, I obviously I reported that to the admin.

Currently I don't want to do else, it's enough for me, I have my hacker theme setted and I'm happy now. :satisfied:
