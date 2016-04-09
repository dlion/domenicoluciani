---
layout: post
title: "Hello World, NUCLEO"
date: 2016-04-09 17:00:00
categories: [Programming, Electronics, Nucleo, mbed, ST, Cpp]
cover: "/assets/images/covers/helloworldnucleo.jpg"
---

For university reasons now I have a NUCLEO-F401RE board of ST Microeletronics, it works with STM32 microcontrollers, it is arduino compatible, supported by MBED, it has 3 leds and 2 pushbuttons on board; Obviously is fully programmable... but how ? Let's do it!

## Compiler

I don't want to download and install an IDE so I decided to use the cloud based IDE of MBED that allows to have a complete IDE everywhere simply open the browser.   
Go on the [MBED](http://mbed.com) website and do the signup as developer. To use the IDE we have to specifying which board we have, how do this ?

## Insert your board on your profile

Connect your board through usb and mount it (i.e. `mount /dev/sdb /mnt/board`), visit the directory and you'll find two files: `DETAILS.TXT` and `MBED.HTM`; open MBED.HTM with the browser annd that's all, your board now is in your MBED profile.

## Hello World

Click on "Compiler", after the init process click on "My Programs" with the right button and select "New Program".   
Choose your platform, choose "Empty Program" template and insert the name of your program.   
First of all we have to add to our project an MBED library to work withe the our board; click on the project with the right button and choose "Import Library" and "From Import Wizard".

![mbed1](/assets/images/posts/mbed1.png)


Search `mbed` and select the first one.

![mbed2](/assets/images/posts/mbed2.png)

The *mbed* library is the official library by MBED, provides the main functions to use Nucleo.

Now we have to create a new source file; left click on your project icon and on "New File", choosing `main.cpp` as name.

```cpp
#include "mbed.h"

int main() {
    Serial pc(SERIAL_TX, SERIAL_RX);
    pc.printf("Hello World!\n");
    return 0;
}
```

Save and click on "Compile", if everything is fine we can download a binary file.

## Execute

Move that binary on the board (i.e. `mv ~/binary.bin /mnt/board ; sync`) and using screen read the result `screen /dev/ttyACM0 9600`, press the *reset* push button and on the screen we'll see the result.

![mbed3](/assets/images/posts/mbed3.png)

Easy to understand the source is composed by a class `Serial` and the object `pc` passing which pins we want to use to the constructor and the printf method.

This is only the first post about Nucleo so stay tuned!
