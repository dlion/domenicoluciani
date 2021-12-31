---
layout: post
title: "How to sync your Obsidian vault on your Android"
date: 2021-12-31 08:00:00
categories: [Life]
cover: "/assets/images/covers/obsidian_sync.png"
lang: en
---

I recently [moved from Notion to Obsidian](https://domenicoluciani.com/2021/12/17/why-did-i-switch-from-notion-to-obsidian.html) and one big problem I've had to face was how to sync my desktop instance with my android mobile one without having a paid plan on Obsidian.   
After some researches, I discovered how to do it smoothly...

The main tool that I use for my backup/sync is git and specifically, I use a private repo on Github to store my vault.

> I don't have any sensitive information in my vault, so be aware that even tho your vault is inside a private repo, it won't be encrypted.

## Computer

There is an amazing plugin called [Obsidian Git](https://github.com/denolehov/obsidian-git) which automatically commit and push toward my repo each 10minutes.   
Make sure that the `Disable push` option is deactivated.    
It works out of the box if you have already set your credentials on your computer and of course, you always need to initialise your git repo first with

```bash
git init
git remote add origin <your repo's address>
```

Obsidian Git will automatically pull new changes when you start Obsidian, you can also pull it by yourself through the command line or the hotkey ctrl+p searching for "Obsidian Git: Pull".

I would suggest to put in your `.gitignore` :


```bash
.obsidian/workspaces.json
.obsidian/workspace
.obsidian/cache
.trash/
.DS_Store
.vault-stats
```

You can just commit and push


```bash
git add .
git commit -m "First commit"
git push
```

Now the Obsidian vault is on Github 🎉

## Android

Okay, the vault is online, but how can we sync it on your android mobile phone?   
We can install [https://termux.com/](https://termux.com/) to get a Linux shell on your Android, then you can install `git` and clone the repo.   
You can install termux from the Play Store and then execute it, installing and configuring what we need with:

```bash
> pkg install git #to install git
> termux-setup-storage #to make storage available
```

Now let's configure the Github credentials.

### Github credentials

First of all, you need to generate an ssh key for the Android mobile phone

```bash
ssh-keygen -t ed25519 -C "email@provider.com"
```

Don't add a passphrase, just press enter   
If you don't have ssh installed type

```bash
pkg install openssh
```

Now you need to add the ssh key to the Github's account, just following these instructions: [https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

To get the ssh key you can just type on termux `cat .ssh/id_ed25519.pub` copying the key and pasting it into the `key` field of Github's form adding the ssh key to your account.   

Once we have followed these steps we can try to clone the repo:

```bash
git clone git@github.com:YOUR_USER/YOUR_REPO_NAME.git
```

and then let's move it to the shared folder so you can access it from any Android application:

```bash
mv YOUR_REPO_NAME/ storage/shared/
```

Now you can just open the directory from your Obsidian application and here we go, we have the vault up to date with the latest changes.   
I also suggest putting inside your vault a `.nomedia` file so you won't see the image contained in your vault in your gallery.   

But how can make this process simpler?

Let's first create a soft link to the repo to simplify the process:

```bash
ln -s storage/shared/YOUR_REPO_NAME YOUR_REPO_NAME
```

And then let's create a `pull.sh` script that you will run to pull the latest changes from the repo:

```bash
cd YOUR_REPO_NAME/
git pull -r
```

and the `push.sh` script:


```bash
cd YOUR_REPO_NAME/
git add .
git commit -m "synched with android on $(date)"
git push
```

then let's make them executable:


```bash
chmod +x push.sh pull.sh
```

From now on, you can push and pull executing those scripts with:


```bash
./pull.sh
./push.sh
```

Be aware that this solution doesn't handle possible conflicts which I try to avoid as much as possible resetting my mobile vault considering the desktop one as the most up to date (having regular backups helps me to validate this assumption easily).

Of course, there is surely a window of improvement on this solution but I'm ok right now with this one, it's easy to open termux, type `./pull.sh` and then exit right after that I updated my vault.
