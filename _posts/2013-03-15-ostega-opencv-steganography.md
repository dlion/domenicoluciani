---
layout: post
title: "Ostega, steganography using OpenCV libraries"
date: 2013-03-15 13:06:00
categories: [Past, Programming, OpenCV]
cover: "/assets/images/covers/hide.jpg"
lang: en
---

The steganography[^1] is a technique that allows to "hide" information inside an image or an audio files, it's a very interesting security field, I can hide "secrets" into an image, pass it to my friend, and he, using a decoder can read what I wrote. Very useful to keep my "secrets" secret; so I wrote a simple C library to hide words into a bitmap images using the OpenCV libraries just for fun and profit...

I named my library **OStega**, the header file contains two functions prototype, one for encrypt and one for decrypt:

### Prototipes

```c
/*
A simple library to use steganography with OpenCV
Thinking and created by Domenico Luciani aka DLion
*/

#include "OStega.c"


/* Function to insert and crypt a message into a bmp image.
 * first parameter is an image, second parameter is a message.
 * It returns -1 to error or 0 to complete successfull.
 */
int imgStega(IplImage*, char*);

/* Function to get a steganographed message into an bmp image
 * first parameter is an image
 * It returns the decrypted message
 */
char *imgDestega(IplImage*);
```

* The first function accepts two parameters: the first one expects an Image and the second a char pointer, it returns an integer to warning you about the result.
* The second function accepts one parameter: the image that you want to decrypt, it returns a char pointer.

### imgStega - Encoder

The source of the first function is:

```c
/* Functions to OStega project.
* thinking and created by Domenico Luciani aka DLion
*/

int imgStega(IplImage *img, char *msg)
{
    int wid = img->width;
    uchar *data = (uchar*)img->imageData;

    int j,k=0;
    int len = strlen(msg);
    char *new_str = (char*)malloc((len+2)*sizeof(char));

    new_str[0] = '$';

    for(j=1; j <= len; j++)
        new_str[j] = msg[j-1];

    new_str[len+1] = '$';

    if(img->nChannels != 3)
        return -1;

    for(j=0,k=0; j < wid || k < (len+2); j+=3,k++)
        data[j*3] = new_str[k];

    return 0;
}
```

As I said before this function accepts two parameters: an image and a message.
It takes the width of the image and the length of the message.

**Pay attention, the image must be a bitmap, so only .bpm format is supported**

The function creates a string long *msg*+2 and it puts into the first and the last position the `$` character and between these positions it inserts the *msg* so for example we pass "dog" as msg to the function, it puts into the image "$dog$", the loop cycle loop through the image and every 3 pixels it puts a character of the msg (`$` characters included); if everything is fine it returns 0;

### imgDestega - Decoder

The source of the second function is:

```c
char *imgDestega(IplImage *img)
{
    int wid = img->width;
    uchar *data = (uchar*)img->imageData;

    int j,k=0;
    char find;
    char *buffer = NULL;

    for(j=0; j < wid; j+=3)
    {
        find = data[j*3];

        if(j == 0)
        {
            if(find != '$')
                exit(EXIT_FAILURE);
            else
                continue;
        }
        else
        {
            if(find == '$')
                break;
            else
            {
                buffer=(char*)realloc(buffer,(k+1)*sizeof(char));
                buffer[k] = find;
                k++;
            }
        }
    }

    buffer = (char*)realloc(buffer,(k+1)*sizeof(char));
    buffer[k] = '\0';

    return buffer;
}
```

The decoding function accepts one paramater, the image that we want to decode, the algorithm is very clear: we scans the image from 0 to *wid* that is the width of the image, if we found at the start the character `$` we continue the research and every 3 pixels we put the character on the output buffer until we find again the `$` character.

### Usage

Here how to use it:

```c
#include <highgui.h>
#include <cv.h>
#include <string.h>
#include "OStega.h"
#include <stdlib.h>

int main(int argc, char **argv)
{
    IplImage *in;
    char *img,*message;
    int mode,result;

    if(argc <= 2)
    {
        printf("Usage: %s <mode> <image_in> <<message>>\n",argv[0]);
        return -1;
    }

    mode = atoi(argv[1]);

    if(mode != 1 && mode != 2 )
    {
        printf("You can specify what do you do.\n",argv[0]);
        return -1;
    }

    in = cvLoadImage(argv[2],CV_LOAD_IMAGE_COLOR);

    if(mode == 1 && argc == 4)
    {
        message = argv[3];

        if(strlen(message) >= (in->width*in->height))
        {
            puts("Message too long\n");
            return -1;
        }
        else
        {
            result = imgStega(in,message);
            if(result == 0)
            {
                puts("Message hidden");
                cvSaveImage("ImageHidden.bmp",in,0);
            }
            else
            {
                printf("Error: %d\n",result);
                return -1;
            }
        }
    }
    else if(mode == 2 && argc == 3)
            printf("Il messaggio trovato e': %s\n",imgDestega(in));

    cvReleaseImage(&in);
    return 0;
}
```

I included the necessary libraries and pass through the shell these parameters: `./stega 1 image.bmp Hello` to crypt the word "Hello" into the *image.bmp* image and to decrypt it `./stega 2 image.bmp`

Ok the code sucks, the algorithm is very simple, etc. etc. but this is a little example of how I can use OpenCV to manipulate image's pixels, just to learn something of new, you know.. :yum:

You can find the project here: [OStega](https://github.com/dlion/OStega)

* * *

[^1]: [Steganography](https://en.wikipedia.org/wiki/Steganography)


