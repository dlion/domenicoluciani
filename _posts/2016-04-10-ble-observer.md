---
layout: post
title: "BLE NUCLEO observer"
date: 2016-04-10 20:05:00 +0100
categories: [Programming, Electronics, Nucleo, MBED, ST, BLE]
cover: "/assets/images/covers/observer.jpg"
---

For university reasons I have to work with BLE, a new technology often used nowadays, with a NUCLEO-F401RE board and the NUCLEO-IDB04A1 BLE extension board by ST

To test it I wrote a small software to discovery a BLE peripheral around me, I named it "BLE Observer".

```cpp
#include "mbed.h"
#include "BLE.h"

BLE ble;

void advCb(const Gap::AdvertisementCallbackParams_t *params) {
    printf("Adv peerAddr: [%02x %02x %02x %02x %02x %02x] rssi %d, ScanResp: %u, AdvType: %u\r\n",
        params->peerAddr[5],
	params->peerAddr[4],
	params->peerAddr[3],
	params->peerAddr[2],
	params->peerAddr[1],
	params->peerAddr[0],
	params->rssi,
	params->isScanResponse,
	params->type);
}

void main(void) {
    ble.init();
    printf("INIT\r\n");
    ble.gap().setScanParams(400, 300);
    ble.gap().startScan(advCb);

    while(true) {
        ble.waitForEvent();
    }
}
```

To use this software you need to import two libraries: [BLE_API](https://developer.mbed.org/teams/Bluetooth-Low-Energy/code/BLE_API/) and [X_NUCLEO_IDB0XA1](https://developer.mbed.org/teams/ST/code/X_NUCLEO_IDB0XA1/). (Follow the [previous post](/2016/04/09/hello-world-nucleo.html) to know how to do this)

The first instruction `ble.init()` initializes the BLE module.

With `ble.gap().setScanParams(400, 300);` we set the scan params, as first parameter we set the interval (delay between scans) and as second parameter we set the window (how long scan).

With `ble.gap().startScan(advCb);` we start the scan operation passing datas to a callback function named `advCb` through a pointer to `AdvertisementCallbackParams_t` struct.

In the `advCb` function we print on the screen the peer address, rssi (received signal strength indicator) information, if is a scan response and the type of the advertising (ADV_CONNECTABLE, ADV_UNDIRECTED, ADV_DIRECT, etc.).

In the ever true while loop we waiting for an event.

Here the result:

![ble1](/assets/images/posts/ble1.jpg)
