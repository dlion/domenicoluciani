---
layout: post
title: "Exam Project 0"
date: 2013-02-26 12:25:00
categories: [Past, Programming, ComputerVision, OpenCV]
cover: "/assets/images/covers/eyes.jpg"
lang: en
---

I'm very fascinated about the possibility to give sight to a machine so for my final high school exam I made a computer vision project...

The project is subdivided in many software that I wrote using the famous OpenCV[^1] libraries.   
I wrote 5 software in C language and tested on Slackware[^2].

## What do you need to test my project
* OpenCV libraries installed on your machine
* a very good webcam
* colours as highlighter pens
* a place with a very good lighting
* Linux

I named my project in a very fancy name... **Exam Project** (yea yea, I know, it sucks but who cares :sunglasses:)   

## Calibra
The first program that I named **Calibra** is the base to use the next two software; it allows us to track every colour we want to find and it will appear on the screen in a red rectangle.   
Obviously this program must be execute and configured before others.

## Bubbles
The second software that I wrote is named **Bubbles** it's a simple little game ideated by me with many levels as hard as you play.   
You have to touch red balls without touch the blue ones, obviously using color you have chosen before in *Calibra*.

## Draw
The third I wrote I named **Draw**, which uses the same principle[^3] we saw before, with the color we can "draw" on the screen as a canvas.

## Head
The fourth I wrote I named **Head**, which uses the Haar Cascade File[^4] to recognize a person's face on the screen.   
I wrote a simple algorithm to use the ROI[^5] with cascade to track eyes, nose and mouth too but because of time stuff I don't use it to default.

## Movement
The fifth I wrote, named **Movement**, offers two monitoring modality:

1. The first one allows to take a frame and to compare it with the stream, if there are differences the software will take that frames to put it together to make a video so as final result we will have a video with date and time over the frame with **ONLY** the changes.
2. The second modality allows to check every frame on the stream to recognize differences between them so in the end we will have a video with a movement inside the frame. (i.e. people walking around, cars in movement, etc.)


This is a general view about my project, very soon I will publish everything, stay tuned!

* * *

[^1]: [OpenCV Wiki](http://opencv.willowgarage.com/wiki/)
[^2]: [Slackware](http://slackware.com)
[^3]: Color Tracking
[^4]: [Haar Like Features](https://en.wikipedia.org/wiki/Haar-like_features)
[^5]: [Region Of Interest](https://en.wikipedia.org/wiki/Region_of_interest)

