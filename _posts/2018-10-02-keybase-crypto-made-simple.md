---
layout: post
title: "Keybase - Crypto made simple"
date: 2018-10-02 08:00:00
categories: [security, life]
cover: "/assets/images/covers/crypto.png"
lang: en
---

For years cryptography was considered like a witchcraft, until now! Let's see how Keybase made it.

## History?

From ancient times humankind ever wanted to communicate secrets or sensitive informations with each others, we invented a lot of method to do that, today we will see 2 of them:

## Symmetric

![symmetric](/assets/images/posts/symmetric_encryption_diagram2.png)

Alice (A) wants to send a SuPeRsEcReT message to Bob (B), how she can do that using symmetric cryptography?

### A:
* Crypts the message with **A KEY**
* Send the encrypted message to Bob

### B:
* Receive the encrypted message from Alice
* Decrypt the message using **THE SAME KEY** Alice used to encrypt the message.

### CONS:

Simple and clean BUT how can you see there is a problem here: Alice and Bob need to use **THE SAME KEY** to communicate each other and from it borns other problems:
* How can Alice pass the *KEY* to Bob?
* What happens if Bob lose his key or someone else steal it from him?

All of these hypothesis allows an attacker to read **ALL** messages from and to Alice/Bob/SomeoneElseWhoUseThatKey.

### PROS:

* Symmetric encryption allows to encrypt a message very fast.
* Simple to use


## Asymmetric

![asymmetric](/assets/images/posts/asymmetric_encryption_diagram.png)

Alice (A) wants to send a SuPeRsEcReT message to Bob (B), how she can do that using asymmetric cryptography?

### A:
* Generate a public/private key pair
* Get the public key of Bob
* Encrypt the message using the public key of Bob
* Send the encrypted message to Bob

### B:
* Receive the encrypted message from Alice
* Decrypt the message using his own private key

### CONS:
* Very slowly
* Not so simple to use
* You can't verify if the public key you are using is the right public key

### PROS:
* Alice doesn't need to pass the own private key
* It's enough for Bob to share his public key
* If someone else steal the key pair of Alice he can't read messages sent by another person to Bob

## Why not both? OpenPGP

Currently these worlds are combined to achieve a smart result, infact the asymmetric encryption is used to wrap the message encrypted using a symmetric encryption, it allows to share in security the message preserving speed.

![pgp](/assets/images/posts/pgp.png)

### CONS:

Using PGP today is painful because:
* It's not simple to use
* You don't have certainty that the public key you want to use belongs to your receiver


## Keybase

To helps people to use more crypto in their lives [Keybase](https://keybase.io/) create a *magic* tool to do that!


## Is this public key yours?

One of the problem with PGP is that you aren't secure of the public key you want to use.   
If you want to send a message to me you need my public key, right? Ok so an attacker send to you his public key, how can you say THAT public key is mine or not without ask to me? (and if the attacker pretend to be me through a fake account on a social network like Twitter? How can you be sure that account is really "me"?)   
Keybase solve this problem in a nice way

![my_account](/assets/images/posts/keybaseAccount.png)


Keybase allows to you to do a lot of stuff, one of these is to verify your identity through social networks like Twitter, Facebook, Github, Reddit, etc.   
How? To verify it you need to post a "prove" that those accounts belongs to you.   
After the verification keybase allows all of who want to speak to you to encrypt using your public key **USING ONLY YOUR NICKNAME**.

For example, I want to encrypt a message for a follower I have on twitter but I don't know his public key; keybase to the rescue:
```sh
$:> keybase encrypt -m "Hello!" <nick_of_your_follow_who_verified_his_twitter_account>
```
and BAM:

```log
BEGIN KEYBASE SALTPACK ENCRYPTED MESSAGE. 
kiVagqKWSHjJD0o 7vgiSU0z0qRiJex T9Qn53ePr6tFC77 AlKXbld19b0U0rA V6YesGSqRfzzfNY VhAmXbi6lEkKqLs Xky12T52tcrzfi0
XwTNGuXlAzs2gpu hRdRzEX52eiF6OQ Fu0ZWD7uWqsAxVN oLaMW0qdZcVxVoS 3TpHffNen6Uviqy JMe2omZNOHkTRMM gRxSBg02CyDn1Vp pFbFoVc34kSC7OZ hihp56fBcteu3CS dqQcf9GEWnRJoSK rWRhww2YpwlOJBZ eorvamUcz0BzzcN LeedUtmVl5BKLpU eaf8KFEb8WuRJQ0 owOF0RQUcOfeX5y OzajZqLrEa0nKle ZVCGdEsaXMEaysv jKEyJs9NdNQqvJM YGcxOACBaTBKSn1 QMasCqDrxAE3ELo YQDqmLkTgI95nz8 a7LMtq3SkXGS7B7 b8wMkIJIXbr7lVB FGcpLsjzTdJ2SQs d1P1FM2kapjqijW Dey6knD7YL9WgbX z4vQ6eM3UhbWbW7 5qyuCAPlQxUaELa FXbSbwJX7eHy3PM RhZ3QHonMMXKg8c L3WY2Fo3H8LMphv 4AU01DYRxCqaOjD 7B0GFtQeyW24jpK K42Ocdi2QgyK2et G0ysFqzd3uKYaX9 Q7pVBP96Ekzdyuf 8nLVXQm7vtBZAXS 5037ZJnPnd4kJgP Aj8chce81VB11Rv 5gTRjklrTpDmSCI smZoH4tZkAz3i2b sSkFTQM1GbpbDm3 2OJmaWSrWaS6oeT guGOu8hL31Tm44O KKH6XX6uwmJKqnf PXarEySWwILaHPG NzcJwyTLUGVBZFC zDhzHZN3f62KHe9 bLCQEZw8eb0kCSd 3XvozsiR0N9P5hN G8f2jA0Q42tcUyu I8e8Hy3nDikFaHz dTcyE00Kfekd8aJ L1w3SWIQKxQBRjy QTHyPDAl6xUNqFq MIr8tYBT3957Imy POUpnDBLEGYWwGG 8H6CfGsXk5cfF8k XTkJnLkOdSpMfzd llXR3XbwWMgIe23 yITDC4D2nIFitvx oqtdsqRg4VmGdfV TP0fOzIJEuoR9f2 Zd0aXBTkkaNXP9l mMM0OZ7BQpjTCiK rTmSqeJd2HlOckB 3u2mjbhV89Q954T vc7looDpTsszD36 yEypMMMCmFIH97d cyLlIe99l6lNRfS WDkixQOtPYmTLpy B1dmAKIVzhSGkDK xQTUYNCDJc16oMQ fmH6x8GVv0Bl6Hk 561mRg5hGlDgEwB Hheph31Z7K4Pymx NWGR3qQX9ioYlIk SsCaUJzbn8JJG8J qJtIPFKvN56FR2o 7rK81g8i4ehe1xz 7qHvoGNb1hFD. 
END KEYBASE SALTPACK ENCRYPTED MESSAGE.
```

Me -> hey keybase, give me the public key of my friend with nick `<nick>`, please -> Keybase answer me with the public key.

Me -> encrypt using the public key retrieved using keybase -> encrypted message in output

Using keybase we can be sure that public key belongs to our receiver for real, nice!


> Ok now I can trust of you but why in 2018 I have to use a terminal...?


## Keybase encrypted chat

An interesting feature of keybase is the **Encrypted Chat**

![chat](/assets/images/posts/keybase_chat.png)

You can create [Teams](https://keybase.io/blog/introducing-keybase-teams), channels, subteams and much more. Of course you have an app for your smartphone too!
It's an end-to-end encrypted chat built into Keybase so you can use your _secure_ nickname of Hacker News as secure address to communicate; no phone number or email needed.
To understand better read the [official announcement](https://keybase.io/blog/keybase-chat).

## Keybase Encrypted Filesystem

Another interesting feature of Keybase is the possibility to have an encrypted filesystem built into Keybase that works in 3 ways:

### Public

You can share **WITH THE WORLD** public, **signed** directories: do you want to share a package and do you want to be sure to ensure to your friends that file is yours so with Keybase you can share it (You have **250GB FOR FREE**, fo real) and keybase will sign it for you.
How? You have to put your file into the public directory of keybase filesystem with your nick: `keybase/public/dlion/yourFile.txt`, even a baby can do that :smile:.

Last but not least Keybase will host these files for you into a public hosting, for example: `https://keybase.pub/dlion/`.

![public](/assets/images/posts/public_dir.png)

### Private
Of course you can sign, crypt and preserve your own files into your private dir, nobody will be able to read those files, how? Just put them into the right dir `keybase/private/dlion/`.

### Teamwork and private sharing
You can create a sharing folder with your team (created using keybase chat, as said previously) or just with your friends, how? Just put the file you want to share inside the right dir with the right nickname `keybase/private/dlion,nick_of_my_friend`.

![twitter](https://keybase.io/images/getting-started/dropbox_sharing.png)

And you can find a [nice explanation](https://keybase.io/docs/kbfs) of it if you want to know how it works.

##  Encrypted git repositories

As last feature Keybase allows every developer to have an encrypted git repository built in Keybase.

![git](https://keybase.io/images/blog/encrypted_git/encrypted_git_ui3.png)

If you want to use a **private** for your own projects, not an open source one or just for your needs like to store your novel, business docs, etc. you can use it for almost everything! How? Just open Keybase, go onto the `Git` label and just type the name of the repo and BAM, you are ready to go.

### Team?

Yes, you can even create and share your repos with your team.

It is end-to-end encrypted. It's hosted, like, say, GitHub, but only you (and teammates) can decrypt any of it. To Keybase, all is but a garbled mess. To you, it's a regular checkout with no extra steps. Even your repository names and branch names are encrypted, and thus unreadable by Keybase staff or infiltrators.

If you want to know more read [the article about it](https://keybase.io/blog/encrypted-git-for-everyone)

## Conclusion

I use Keybase everyday and I'm happy to use a simple (it's an euphemism) tool that allows me to talk with friends without to worry about my privacy or just to work with my teammate without worry where to share our *secret files*.

## So follow me!

![follow me](/assets/images/posts/keybaseAccount.png)
