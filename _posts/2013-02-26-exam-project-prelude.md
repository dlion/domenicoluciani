---
layout: post
title: "Exam Project Prelude"
date: 2013-02-26 16:00:00
categories: [Past, Programming, ComputerVision, OpenCV]
cover: "/assets/images/covers/roboteye.png"
---
In the [previous article](https://domenicoluciani.com/2013/02/26/exam-project-0.html) I introduced you my exam project about computer vision, now I'm going to explain to you how it works but first let me introduce a small header file I wrote to reuse useful functions and structs.

Firs of all, you can find the project [here](https://github.com/DLion/ExamProject), you can find the header file in the `lib` directory.

>Header

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

#include "funzioni.c"

/*
 * -Funzione per leggere il file di configurazione-
 * I primi 2 parametri indicano dove salvare i valori presi.
 * I valori presi vengono salvato su 2 strutture apposite.
 * Il terzo parametro è il nome del file da cui leggere.
 */
void leggiConfig(HSV*,HSV*,char*);

/*
 * -Funzione per scrivere sul file di configurazione-
 * Stessi parametri di prima.
 */
void scriviConfig(HSV*,HSV*,char*);

/*
 * -Funzione per diminuire la dimensione di un'immagine-
 *  Il primo parametro indica l'immagine.
 *  Il secondo parametro è il valore in percentuale di riduzione.
 *  Viene ritornata l'immagine modificata.
 */
IplImage* diminuisci(IplImage*,int);

/*
 * -Funzione per ridurre i disturbi in un'immagine-
 *  Il primo parametro indica l'immagine sorgente.
 *  Il secondo parametro indica l'immagine di destinazione.
 */
void riduciNoise(IplImage*,IplImage*);

/*
 * -Funzione per inserire un'immagine in un'altra immagine-
 *  Il primo parametro indica l'immagine da inserire.
 *  Il secondo parametro indica dove inserire l'immagine.
 *  Il terzo e il quarto parametro indicano le coordinate dove posizionare l'immagine.
 */
void inserisci(IplImage*,IplImage*,int,int);
```

>C file

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

typedef struct
{
    int H,S,V;
}HSV;

typedef struct
{
    int xmin,xmax;
    int ymin,ymax;
}Rettangolo;

void leggiConfig(HSV *m,HSV *n,char *file)
{
    FILE *config;
    config = fopen(file,"r");
    if(config != NULL)
        fscanf(config,"%d,%d,%d,%d,%d,%d",&m->H,&m->S,&m->V,&n->H,&n->S,&n->V);
    else
    {
        m->H = m->S = m->V = 0;
        n->H = n->S = n->V = 255;
    }

    printf("--- VALORI PRESI ---\n## MIN ##\nH->%d S->%d V->%d\n## MAX ##\nH->%d S->%d V->%d\n",m->H,m->S,m->V,n->H,n->S,n->V);
    fclose(config);
}

void scriviConfig(HSV *m,HSV *n,char *file)
{
    FILE *config;
    config = fopen(file,"w");
    if(config != NULL)
    {
        fprintf(config,"%d,%d,%d,%d,%d,%d",m->H,m->S,m->V,n->H,n->S,n->V);
        puts("Valori scritti correttamente");
    }
    fclose(config);
}

IplImage* diminuisci(IplImage* file,int perc)
{
    IplImage *ris = cvCreateImage(cvSize((int)((file->width*perc)/100),(int)((file->height*perc)/100)),8,file->nChannels);

    cvResize(file,ris);

    return ris;
}

void riduciNoise(IplImage *src,IplImage *dst)
{
    IplImage *buff = cvCreateImage(cvGetSize(src),8,dst->nChannels);
    cvDilate(src,buff,NULL,1);
    cvErode(buff,buff,NULL,2);
    cvSmooth(buff,dst,CV_GAUSSIAN,5);
    cvReleaseImage(&buff);
}

void inserisci(IplImage *small,IplImage *big,int pos1,int pos2)
{
    CvRect dim = cvRect(pos1,pos2,(int)small->width,(int)small->height);
    cvSetImageROI(big,dim);
    cvCopy(small,big);
    cvResetImageROI(big);
}
```
To use color tracking I need to use a better color space than RGB so I used the **HSV**[^1] color space. HSV was invented to emulate the human vision, it is based on the perception that we have based by tint, shade and tone. The coordinate system is cylindrical and it is defined with a distorted cone.   
H = angle around the vertical axis   
S = Saturation, from 0 on the axis to 1 on the surface   
V = Brightness is the height of the cone   
![HSV](/assets/images/posts/hsv.png)

The `Rettangolo`(Rectangle) structs allows to define **points** to manage rectangles.

The `leggiConf` (readConfiguration) functions has as parameters two HSV struct pointers and the configuration file to read.

The opposite of `leggiConf` is the `scriviConf`(writeConfiguration) function, it allows to save the value of the our configuration.

The function `diminuisci`(decrease) allows to decrease the size of an image to a specific percentage choice by us; the function returns a pointer to an *IplImage* struct defined in the OpenCV libraries. Inside the function we create a smaller image using `cvCreateImage` function indicating the size of the new image (width * percentage / 100), the number of bits per pixel and the number of channels (1 to 4) passing it to the function`cvResize` that will deecrease the initial image to adapt it to the final one.

The function `riduciNoise` (reduceNoise) allows to dilate, eroding and in the end smoothing an image passed by param (opening[^2] and closing[^3] operation) looking for to avoiding possible false positives.

The function `inserisci` has as parameters a big and a small images and 2 integer; it allows to insert a small image into a bigger one in the coordinates defined by the 2 integers. Inside the function we set a **ROI** that allows us to operate **ONLY** in that region of an image leave intact the rest.

![ROI](/assets/images/posts/roi.gif)

That's all! In the next posts I will introduce the rest of the project, stay tuned!

* * *

[^1]: [HSV](https://en.wikipedia.org/wiki/HSL_and_HSV)
[^2]: [opening](https://en.wikipedia.org/wiki/Opening_(morphology))
[^3]: [closing](https://en.wikipedia.org/wiki/Closing_(morphology))
