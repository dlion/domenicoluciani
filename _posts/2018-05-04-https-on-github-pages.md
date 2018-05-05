---
layout: post
title: "Full HTTPS on your Github pages, for free"
date: 2018-05-04 08:00:00
categories: [Security]
cover: "/assets/images/covers/letsencrypt.png"
lang: en
---

From today this blog is full encrypted by a full SSL protocol, for free. How?

I run this blog **for free**, I don't need anything else than my Github's account, this is possible using [Github Pages](https://pages.github.com/) and [Jekyll](https://jekyllrb.com/)

You can find the repo of this blog [here](https://github.com/dlion/domenicoluciani), it's totally opensource. **The only thing I pay is my domain, nothing else**.

In the past I activated a [flexible SSL encryption](https://support.cloudflare.com/hc/en-us/articles/200170416-What-do-the-SSL-options-mean-) thanks to [Cloudflare](https://cloudflare.com) but as you can read the connection between cloudflare and the server is not encrypted. ❌

## And now, Full SSL, thank you Github

On [1 May](https://blog.github.com/2018-05-01-github-pages-custom-domains-https/) Github announces the full support of SSL protocol.
So after some research I activated it, how? Let me explain this

## Change IPs

The first thing you have to do is change your IPs on the DNS panel (I use Cloudflare). You can find the new specifics on [Github's documentation](https://help.github.com/articles/setting-up-an-apex-domain/#configuring-a-records-with-your-dns-provider).

In this case add `A` records with these IPs:

```
185.199.108.153

185.199.109.153

185.199.110.153

185.199.111.153
```

## Add letsencrypt record on DNS

The next thing to do on your DNS panel is adding a new `CAA` record, putting on the `name` field the name of your custom domain and as (CA) domain name `letsencrypt.org`.

## Full SSL on Cloudflare

After that you can activate the `full` encryption, go on the `Crypto` section on the Cloudflare panel and switch the select box on `Full`.

## Settings on your repo

The last thing you have to do is enforce the `HTTPS` on your repo, go on the `settings` page of your github's repo and check the `Enforce HTTPS` box.
If you can't you have to wait that the `DNS` propagation and that `Cloudlfare` works.

The last thing you can do to accelerate the process is to remove your custom domain from the `custom domain` text field, save and reinsert it again.

## Done

After these steps and some times you can check if everything was fine with this command on your terminal:

```sh
dig +noall +answer example.com
```

You should see a result like this:

```
dig +noall +answer domenicoluciani.com
domenicoluciani.com.    300     IN      A       185.199.110.153
domenicoluciani.com.    300     IN      A       185.199.108.153
domenicoluciani.com.    300     IN      A       185.199.109.153
domenicoluciani.com.    300     IN      A       185.199.111.153
```

And of course you should see the `HTTPS` valid encryption on your blog, **FOR FREE**.

---

Good full encryption to everyone!
