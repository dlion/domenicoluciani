---
layout: post
title: "How to interface a nunchuck with raspberry pi"
date: 2014-04-11 23:00:00
categories: [Past, Programming, Nunchuck, RaspberryPi, Electronics]
cover: "/assets/images/covers/nunchuck.jpg"
---

Walking around the city I found a cheap nunchuck and obviously I felt the need to do something. This time I chose to interface my raspberry pi with it.   
Let's see how!

### What you need

* Breadboard
* nunchuck (or in this case funchuck)
* raspberry
* jumpers

### Nunchuck Model

I bought "Funchuck" a cheap nunchuck for 5euros.

![funchuck](/assets/images/posts/funchuck1.jpg)

### Scheme

```
|1       3|
|         |
|6   5   4|
|  -----  |
|_|     |_|
```

1. DATA
2. IN (3.3v)
3. CLOCK
4. PRESENCE (useless)
5. GND

![funchuck2](/assets/images/posts/funchuck2.jpg)

1. PIN 3.3v -(red)-> IN
2. PIN 2 (0 SDA)-(blue)-> DATA
3. PIN 3 (1 SCL)-(green)-> CLOCK
4. PIN GND (0v)-(black)->GND

### On the raspi

Once you connected everything you need to configure the raspberry to comunicate with the device, I used the [wiringPi](http://wiringpi.com) libraries to do this.

1. Load the i2c module with `sudo gpio load i2c`
2. To verify that the device is seen by the raspberry execute `sudo gpio i2cd`, you will have an output like this:

```
0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:         -- -- -- -- -- -- -- -- -- -- -- -- --
10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
30: -- -- -- -- -- -- -- -- -- -- -- UU -- -- -- --
40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
50: -- -- 52 -- -- -- -- -- -- -- -- -- -- -- -- --
60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
70: -- -- -- -- -- -- -- --
```

`UU` indicates that location is busy. The `52` is very important, it says that the device is present on the `0x52` address, remember that!

I wrote a simple C program to retrieve some informations from the device. You can find it [here](https://github.com/dlion/Raspi/blob/master/nunchuck.c), you can compile it with `gcc nunchuck.c -o nunchuck` and execute it with `sudo ./nunchuck`.

```c
/*
 * The MIT License (MIT)
 * Copyright (c) 2014 Domenico Luciani http://dlion.it domenicoleoneluciani@gmail.com
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <linux/i2c.h>
#include <linux/i2c-dev.h>
#include <fcntl.h>
#include <sys/ioctl.h>

#define DEVICE "/dev/i2c-1"
#define ADDRESS 0x52
#define LEGGI 0
#define SCRIVI 1

int comunica(char*, int, int);

int main(void) 
{
    char buffer_read[6], //Buffer ricezione byte
         buffer_init[] = { 0xF0, 0x55 }, //Sequenza di init
         buffer_stop[] = { 0x00 }; //Sequenza di stop
  
    int file; //File handler
    int z, c; //Pulsanti
    int responso; //Responso della comunicazione

    responso = comunica(buffer_init, 2, SCRIVI);
    if(responso == 0)
        puts("Init avvenuto con successo");
    else
    {
        printf("Errore nella comunicazione %d\n", responso);
        exit(responso);
    }
      
    while(responso == 0)
    {
        //Stop
        responso = comunica(buffer_stop, 1, SCRIVI);
        if(responso != 0)
        {
            printf("Errore nella comunicazione %d\n", responso);
            exit(responso);
        }

        //Leggo
        responso = comunica(buffer_read, 6, LEGGI);
        if(responso != 0)
        {
            printf("Errore nella comunicazione %d\n", responso);
            exit(responso);
        }

        // Pulsanti
        z = buffer_read[5] & 0x01;
        c = (buffer_read[5] >> 1) & 0x01;
    
        //Asse X
        buffer_read[2] <<= 2;
        buffer_read[2] |= ((buffer_read[5] >> 2) & 0x03);
        //Asse Y                
        buffer_read[3] <<= 2;
        buffer_read[3] |= ((buffer_read[5] >> 6) & 0x03);

        printf("Analog X: %d Analog Y: %d Asse-X: %d Asse-Y: %d Asse-Z: %d ", buffer_read[0], buffer_read[1], buffer_read[2], buffer_read[3], buffer_read[4]);

        printf("Pulsante Z: ");
        (z == 1) ? printf("non premuto ") : printf("premuto ");
    
        printf("Pulsante C: ");
        (c == 1) ? printf("non premuto\n\f") : printf("premuto\n\f");
    
        usleep(200000);
    }
    
    return 0;
}

int comunica(char *buffer, int ndati, int mod)
{
    int file;

    if((file = open(DEVICE, O_RDWR)) < 0)
        return -1;

    if(ioctl(file, I2C_SLAVE, ADDRESS) < 0)
        return -2;

    if(mod == SCRIVI)
    {
        if(write(file, buffer, ndati) != ndati)
            return -3;
    }
    else if(mod == LEGGI)
    {
        if(read(file, buffer, ndati) != ndati)
            return -3;
    }
    else
        return -4;
  
    close(file);

    return 0;
}
```

Pay attention, if you have rev-1 raspberry pi rathen than rev-2 you have to change `/dev/i2c-1` with `/dev/i2c-0`

The device uses the I²C[^1] master/slave protocol and comunicate at 400KHz; to use it you need to provide an initial byte sequence and an address (`0x52` in the our case) to comunicate with the device; this sequence on the original devices is `0x40 0x00` and on the our device is `0xF0 0x55` and at the end you need to send a stop sequence `0x00`. As output you will receive the position of X/Y analogic axes, if you pressed C/Z buttons and the coordinates X/Y/Z axes of accelerometer.

<script type="text/javascript" src="https://asciinema.org/a/8812.js" id="asciicast-8812" async ></script>

* * *

[^1]: [I²C](https://en.wikipedia.org/wiki/I%C2%B2C)
