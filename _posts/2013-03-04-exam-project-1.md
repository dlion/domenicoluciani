---
layout: post
title: "Exam Project Part One"
date: 2013-03-04 16:00:00
categories: [Past, Programming, ComputerVision, OpenCV]
cover: "/assets/images/covers/roboteyes1.png"
lang: en
---

[In the previous article we saw a little library to semplify my work](https://domenicoluciani.com/2013/02/26/exam-project-prelude.html), today I'm going to talk about a software that allows to track any color and at the same time
tell other softwares which colour we have chosen

The software we talk about is this:

```c
/*
# This file is part of Computer Vision Exam Project
#
# Copyright(c) 2012 Domenico Luciani
# domenicoleoneluciani@gmail.com
#
#
# This file may be licensed under the terms of of the
# GNU General Public License Version 3 (the ``GPL'').
#
# Software distributed under the License is distributed
# on an ``AS IS'' basis, WITHOUT WARRANTY OF ANY KIND, either
# express or implied. See the GPL for the specific language
# governing rights and limitations.
#
# You should have received a copy of the GPL along with this
# program. If not, go to http://www.gnu.org/licenses/gpl.html
# or write to the Free Software Foundation, Inc.,
# 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
*/
 
#include <cv.h>
#include <highgui.h>
#include "../lib/funzioni.h"
//File di configurazione
#define FILE_CONFIG "config.txt"
//Nomi delle GUI
#define NORMAL "Calibra"
#define BINARY "Calibra - Binaria"
 
int main(int argc,char *argv[])
{
    int web;
    //Controllo se i parametri sono corretti
    if(argc != 2)
        printf("usage: %s <mode>\n0 - integrate webcam\n1 - external webcam",argv[0]);
    else
    {
        web = atoi(argv[1]);
 
        if(web >= 0 && web <= 1)
        {
            //Inizializzo la webcam
            CvCapture *capt = cvCaptureFromCAM(web);
            //Setto le proprietà della webcam a 640x480
            cvSetCaptureProperty(capt,CV_CAP_PROP_FRAME_WIDTH,640);
            cvSetCaptureProperty(capt,CV_CAP_PROP_FRAME_HEIGHT,480);
            //Prendo il primo frame dalla webcam e lo salvo
            IplImage *imm = cvQueryFrame(capt);
            //Creo immagini
            IplImage *hsv = cvCreateImage(cvGetSize(imm),8,3);
            IplImage *binary = cvCreateImage(cvGetSize(imm),8,1);
 
            //Variabili varie
            int i,j,step = binary->widthStep/sizeof(uchar);
            uchar *target = (uchar*)binary->imageData;
            char tasto;
            //Alloco spazio per i valori HSV
            HSV *low = (HSV*)malloc(sizeof(HSV));
            HSV *high = (HSV*)malloc(sizeof(HSV));
            //Alloco spazio per il rettangolo
            Rettangolo *punti = (Rettangolo*)malloc(sizeof(Rettangolo));
            //Leggo i dati dal file di configurazione
            leggiConfig(low,high,(char*)FILE_CONFIG);
            //Creo le GUI
            cvNamedWindow(NORMAL,CV_WINDOW_AUTOSIZE);
            cvNamedWindow(BINARY,CV_WINDOW_AUTOSIZE);
            //Ciclo while che si occuperà di prendere i frame
            while(imm)
            {
                //Creo le trackbar
                cvCreateTrackbar("HMIN",NORMAL,&low->H,255,NULL);
                cvCreateTrackbar("SMIN",NORMAL,&low->S,255,NULL);
                cvCreateTrackbar("VMIN",NORMAL,&low->V,255,NULL);
 
                cvCreateTrackbar("HMAX",NORMAL,&high->H,255,NULL);
                cvCreateTrackbar("SMAX",NORMAL,&high->S,255,NULL);
                cvCreateTrackbar("VMAX",NORMAL,&high->V,255,NULL);
               //Ruoto l'immagine
                cvFlip(imm,imm,1);
                //Converto in hsv
                cvCvtColor(imm,hsv,CV_BGR2HSV);
                //cerco il colore
                cvInRangeS(hsv,cvScalar(low->H,low->S,low->V),cvScalar(high->H,high->S,high->V),binary);
                //Riduco i disturbi
                riduciNoise(binary,binary);
                //Resetto il rettangolo
                *punti = {10000,0,10000,0};
 
                //Controllo pixel per pixel
                for(i=0; i < binary->height; i++)
                {
                    for(j=0; j < binary->width; j++)
                    {
                        if(target[i*step+j] == 255)
                        {
                            //I punti del nostro rettangolo
                            if(j < punti->xmin)
                                punti->xmin = j;
                            if(j > punti->xmax)
                                punti->xmax = j;
                            if(i < punti->ymin)
                                punti->ymin = i;
                            if(i > punti->ymax)
                                punti->ymax = i;
                        }
                    }
                }
                //Creo il rettangolo
                cvRectangle(imm,cvPoint(punti->xmin,punti->ymin),cvPoint(punti->xmax,punti->ymax),CV_RGB(255,0,0),2,8,0);
               //Creo il baricentro
                cvCircle(imm,cvPoint((punti->xmin+punti->xmax)/2,(punti->ymin+punti->ymax)/2),2,CV_RGB(0,0,255),-1,CV_AA,0);
                //Mostro le GUI
                cvShowImage(NORMAL,imm);
                cvShowImage(BINARY,binary);
                //Aspetto 15 millisecondi
                tasto = cvWaitKey(15);
 
                switch(tasto)
                {
                    //Se premo 'q' esco
                    case 'q':
                        return 2;
                        break;
                    case 's':
                        //Se premo 's' salvo i dati che mi servono
                        scriviConfig(low,high,(char*)FILE_CONFIG);
                        break;
                }
                //Prendo un altro frame
                imm = cvQueryFrame(capt);
            }
            //Libero tutto ciò che ho allocato in precedenza
            cvReleaseImage(&imm);
            cvReleaseImage(&binary);
            cvReleaseImage(&hsv);
            cvReleaseCapture(&capt);
        }
        else
            puts("webcam not found");
    }
 
    return 0;
}
```

it is in the `config` directory called `calibra.c`

* I start included the OpenCV libraries like `cv.h`, `highgui.h` and apart my library `funzioni.h`
* I define where we can find the configuration file, the name of the GUI where we are going to show the frame taken from the webcam and the name of the GUI where we are going to show the binary result of the taken values.
* I check if I inserted the right parameters to know which webcam we want to use.
* I initialize the webcam with the function `cvCaptureFromCAM` specifying with parameter `0` for the internal webcam and `1` for the external one.
* I set the property of the webcam using as dimensions `640×480`.
* I take the first frame and set it into `imm`
* I create an image HSV where I am going to save the converted image in HSV with the same size of `imm`.
* I create an image where I am going to save the binary image that we will found
* I take the `step` of the binary image, the `widthStep` field that tell the number of bytes between the start of every pixels row.
* After that we have `target`, the real pixels of the image.
* I need to cast as `unsigned char` the variable because as default is a `char*` and we need an `unsigned char`.
* I define a `tasto` variable that I use to hook the input of the user.
* I alloc 2 pointers to the `HSV` structure and one pointer to the `Rettangolo` structure.
* I take the values from the configuration file and set it in `low` and `high`
* I create 2 GUI
* Now I loop until `false`
* I create some trackbars that allows the user to interact to see changes in real time
* 6 trackbrs, each of them are going to manage the mininum and maximum value of `H`, `S`, `V` we want to analyze
* The values are between 0 and 255 and the trackbar will be on he `NORMAL` GUI.
* I rotate the frame 
* I convert the image from `BGR` to `HSV` and I insert the converted image in `HSV`.
* The function `cvInRangeS` is a filter function
* Using the maximum and minimum values I am able to create a binary image with white pixels as ROI abd black the rest
* I reduce the noises on the binary image 
* Now I want to find the white region to follows the colour, to do that I need to do a search over every pixel that make the image: if I find a white pixel I save the points of vertices of our rectangle
* With the `cvRectangle` function I draw a red rectangle in `imm` 
* With the `cvCircle` function I draw a blue center of gravity of the our rectangle.
* After that I show the GUIs with the our frame (with draws) and the binary image I found
* With the `cvWaitKey` I wait `15ms` to allows to check if a key was press, using the switch/case I check: `q` key -> exit ; `s` key -> I write the datas taken on the configuation file to allows other software to know which colour they have to follow.
* I take another frame and restart

Here a screenshot:

![screenshot](/assets/images/posts/examproject-parte-1.jpg)

As we can see the red rectangle is only around the colour we have choose.
