---
layout: post
title: "How to create an always up to date alias for your Mastodon account"
date: 2022-11-19 08:00:00
categories: [Life]
cover: "/assets/images/covers/mastodon.png"
lang: en
---
Mastodon is a new hot-trend topic, so I spent some time trying to wrap my head around it.   
The decentralisation is an exciting part of Mastodon; if tomorrow I don't like the instance where my account resides anymore, I can always switch to another instance and bring all my data seamlessly. It's fantastic, except that now it's like having another account with a different address, so I need to share it with my "audience" again and again.   
Doing some research, I discover how to create a custom alias for my Mastodon account to have it always pointing to my current account; let's see how!


## How is it look like?

The alias I created for my account is `dlion@domenicoluciani.com` where `dlion` is my nickname, and `domenicoluciani.com` is my custom domain.   
If you try to search it on Mastodon, you will find my current account, which resides on `mastodon.social`

![Mastodon Search](/assets/images/posts/mastodon_search.png)

## Behind the scene

I discovered that Mastodon uses ActivityPub to communicate between different actors and that those actors are found using WebFinger, a way to attach information to a specific email address or other online resources.   
So I just needed to implement the WebFinger spec on my domain to have it working.

On your Mastodon instance, you have an endpoint called `.well-known/webfinger`, which accepts a query parameter that allows other Mastodon instances to get information around a particular account.   
```
<youmastodonaddress>/.well-known/webfinger?resource=acct:<yournick>@<youmastodonaddress>
```

For instance, in my case, doing a curl GET request to this URL:   
```
https://mastodon.social/.well-known/webfinger?resource=acct:dlion@mastodon.social
```

I get the WebFinger response for my account:

```json
{
   "aliases" : [
      "https://mastodon.social/@dlion",
      "https://mastodon.social/users/dlion"
   ],
   "links" : [
      {
         "href" : "https://mastodon.social/@dlion",
         "rel" : "http://webfinger.net/rel/profile-page",
         "type" : "text/html"
      },
      {
         "href" : "https://mastodon.social/users/dlion",
         "rel" : "self",
         "type" : "application/activity+json"
      },
      {
         "rel" : "http://ostatus.org/schema/1.0/subscribe",
         "template" : "https://mastodon.social/authorize_interaction?uri={uri}"
      }
   ],
   "subject" : "acct:dlion@mastodon.social"
}
```

I need to put this response on my server under the same directory and inside the same file and that's it.

## How to do it on a Jekyll website

For my blog, I use GitHub for the hosting; specifically, I use `github-pages` which means using `Jekyll`, a static site generator.

To have your Mastodon alias in your custom domain using Jekyll, you need to:

1. In the root of your repo, create a directory called `.well-known`.
2. Inside the directory `.well-known`, create a new file called `webfinger`.
3. Inside the `webfinger` file, put the response you get when you curl your actual Mastodon instance WebFinger endpoint, as mentioned before.
4. In your `_config.yml`, add `include: ["/.well-known" ]` to include that directory in your rendering.

And it's done. Just push and wait a bunch of minutes. Your alias will be founded as `anything@your-custom-domain.whatever` by Mastodon, redirecting everyone to your actual account.

---

### References

If you want to know more about WebFinger, you can have a look at the original website of the spec and at the Mastodon's documentation:
* [https://webfinger.net/](https://webfinger.net/)
* [https://docs.joinmastodon.org/spec/webfinger/](https://docs.joinmastodon.org/spec/webfinger/)

I found out about this method thanks to this article by [Maarten Balliauw](https://blog.maartenballiauw.be/):
* [https://blog.maartenballiauw.be/post/2022/11/05/mastodon-own-donain-without-hosting-server.html](https://blog.maartenballiauw.be/post/2022/11/05/mastodon-own-donain-without-hosting-server.html)

