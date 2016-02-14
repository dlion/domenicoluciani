---
layout: post
title: "Move the cursor pointer with a joystick"
date: 2013-02-26 01:00:00
categories: [Past, Electronics, Programming]
cover: "/assets/images/covers/joystick.png"
---

I found a cool library online to interface my pc with any usb joystick I have in my house... so why not to move my cursor pointer with a joystick ?

**PLib** is the name of the library I choose, I obviously I made everything on a Linux distro, here the source:

```c
/*###############################################################################
*# @Author : Domenico Luciani aka DLion
*# @Description: Simple snippet for move the pointer on the screen using a joystick
*# @How compile: g++ <source> -o <binary> -lplibjs -lplibsl -lplibsm -lplibul -lm -lX11
*# @Copyright : 2012
*# @Site : http://domenicoluciani.com
*# @License : GNU AGPL v3 http://www.gnu.org/licenses/agpl.html
*###############################################################################*/
 
#include <X11/Xlib.h>
#include <X11/X.h>
#include <X11/Xutil.h>
#include <plib/js.h>
 
int main()
{
    Display *monitor;
    Window win;
    jsJoystick *js[1];
    float *ax[1];
    int x=0,y=0,b;

    //Init plib
    jsInit();

    //get first joystick
    js[0] = new jsJoystick();

    //Check if the joystick is present
    if(js[0]->notWorking())
        printf("Joystick not detected!\n");
    else
    {
        //Get axes
        ax[0] = (float*)malloc((js[0]->getNumAxes())*sizeof(float));
        //Functions for X
        monitor = XOpenDisplay(0);
        win = XRootWindow(monitor,0);
        XSelectInput(monitor,win,NoEventMask);

        while(1)
        {
            //Get Button pressed and Axes
            js[0]->read(&b,ax[0]);

            //Increment o decrement x and y axes
            x+=ax[0][0];
            y+=ax[0][1];

            //Move pointer on the screen
            XWarpPointer(monitor,None,win,0,0,0,0,x,y);
            XFlush(monitor);

            //Sleep 1 second
            usleep(1000);
        }
    }

    return 0;
}
```

The source is very simple and clear: I initialize everything, detect the joystick, get the coords and set the pointer showing everything on the sreen.

To compile this source:

`g++ joystick.cpp -o joystick -lplibjs -lplibsl -lplibsm -lplibul -lm -lX11 ; ./joystick`

