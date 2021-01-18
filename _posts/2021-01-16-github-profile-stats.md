---
layout: post
title: "How to show useful stats about your open source activites on your Github profile"
date: 2021-01-16 00:00:00
categories: [Programming, Life]
cover: "/assets/images/covers/github_stats.png"
lang: en
---
I've finally found the time to customise my Github's profile. It shows some interesting stats about my activities, without any external browser extension, how?

This morning I was taking my usual look around on GitHub. I discovered a profile which was using Github Actions to create statistics from just its own Github's account. The author created a project containing particular GitHub Actions instructions to get those stats from Github. It allows to generate stats about the rate of contributions, used languages, topics we care about, last posts on dev.to, and much more.

It was fun exploring how Github Actions work trying to customise my profile which I can say now looks better, here the result:

![profile](/assets/images/posts/github_profile.png)


The repository where to find how to obtain the same result is called [Metrics](https://github.com/lowlighter/metrics). It's straightforward to follow the documentation, and you can have beautiful stats in less than 10 minutes.

* You just need to create your own particular repo (in my case [dlion](https://github.com/dlion/dlion))
* Create a new action providing a valid workflow file (you can follow [mine](https://github.com/dlion/dlion/blob/main/.github/workflows/main.yml) as a working example)
* Create a token to put into the repo's secrets
* Edit your README.md to show the images created by our workflow.

    I thought to generate my stats in many images to display them as I prefer (or just not all stats but only a few of them) instead to generate a single image.

You can see those updated stats in my [Github's profile](https://github.com/DLion) and in my [about](https://domenicoluciani.com/about) page as well.
