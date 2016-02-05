---
layout: post
title: "Exam Project 0"
date: 2016-02-05 12:25:00
categories: [ComputerVision, Past, Programming, OpenCV]
cover: "/assets/images/covers/eyes.jpg"
---

I'm very fascinated about the possibility to give sight to a machine so for my final high school exam I made a computer vision project

The project is subdivided in many software that I wrote using the famous OpenCV[^1] libraries.   
I wrote 5 software in C language and tested on Slackware[^2].

## What do you need to test my project
* OpenCV libraries installed on your machine
* a very good webcam
* colours as highlighter pens
* a place with a very good lighting
* Linux

I called my project with a very fancy name... **Exam Project** (yea yea, I know, it's sucks but who cares :sunglasses:)   

## Calibra
The first program that I called **Calibra** is the base to use the next two software; it allows us to track every colour we want to find and it will appear on the screen in a red rectangle.   
Obviously this program must to be execute and configured before others.

## Bubbles
The second software that I wrote called **Bubbles** it's a simple little game ideated by me with many increasing difficult levels.   
You have to touch red balls without touch blues, obviously using your color you have chosen before using *Calibra*.

## Draw
The third I wrote called **Draw**, use the same principle[^3] saw before, using the ours color we can "draw" on the screen as a canvas.

## Head
The fourth I wrote called **Head**, use the Haar Cascade File[^4] to recognize a person's face on the screen.   
I wrote a simple algorithm to use the ROI[^5] with cascade to track eyes, nose and mouth too but for time things I don't use it to default.

## Movement
The fifth I wrote, called **Movement**, offer two monitoring modality:

1. The first one allows to take a frame and to compare it with the stream, if there are differences the software will take that frames to put it together to make a video so as final result we will have a video with date and time over the frame with **ONLY** the changes.
2. The second modality allows to check every frame on the stream to recognize differences between them so in the end we will have a video with a movement inside the frame. (i.e. people walking around, cars in movement, etc.)


This is a general view about my project, very soon I will pubblish everything, stay tuned!

* * *

[^1]: [OpenCV Wiki](http://opencv.willowgarage.com/wiki/)
[^2]: [Slackware](http://slackware.com)
[^3]: Color Tracking
[^4]: [Haar Like Features](https://en.wikipedia.org/wiki/Haar-like_features)
[^5]: [Region Of Interest](https://en.wikipedia.org/wiki/Region_of_interest)

