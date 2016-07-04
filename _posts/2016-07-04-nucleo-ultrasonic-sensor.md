---
layout: post
title: "Interfacing an ultrasonic sensor with NUCLEO board"
date: 2016-07-04 10:20:00
categories: [Programming, Electronics, Nucleo, MBED, ST, ultrasonic, sensor]
cover: "/assets/images/covers/ultrasonic.jpg"
excerpt_separator: <!--more-->
---

For academic purpose I have to interface the F401RE NUCLEO board with the HY-SRF05 ultrasonic sensor, it uses the sonar principle to allow to measure the distance to an obstacle.

<!--more-->

For simplicity I used the [SRF05](https://developer.mbed.org/users/simon/code/SRF05/) library that provides all the methods that I needed to use the SRF05 sensor.   
The sensor is composed by 5 pins:   

![SRF05](/assets/images/posts/SRF05.jpg)

* Vcc
* Trigger
* Echo
* OUT
* GND

And here the scheme to connect the sensor with the NUCLEO board:

* Vcc --> 3.3v
* Trigger --> D4 (PB_5)
* Echo --> D7 (PA_8)
* OUT --> NULL
* GND --> GND

You can find the NUCLEO-F401RE's pins scheme [here](https://developer.mbed.org/platforms/ST-Nucleo-F401RE/) and here the code:

```cpp
#include "mbed.h"
#include "SRF05.h"

int main() {

  while(1) {
    SRF05 srf(PB_5, PA_8); // Trigger, Echo
    printf("Distance = %.1f\r\n", srf.read());
    wait(0.5);
  }

  return 0;
}
```

Follow the [previous instructions](https://domenicoluciani.com/2016/04/09/hello-world-nucleo.html) to compile it and to import the libraries and after that put the bin on the NUCLEO.

Once connected on the screen appears an output like this:

> Distance = 125   
> Distance = 90   
> Distance = 80   
> Distance = 25   
> Distance = 13   
> ...

Obviously the number after the equal sign is the distance detected by the sensor.
