---
layout: post
title: "Save 5 minutes web scraping with Rust"
date: 2021-04-30 08:00:00
categories: [Programming]
cover: "/assets/images/covers/mobile.png"
lang: en
---

Often I read that for simple tasks Rust is not a good choice. Go is more adopted when we need to create a small script to automatize our jobs. But is it true?

So far, I have been in Spain for two years, and now I can consider myself fully on-boarded. I learned Spanish, I have my residency here, and I have my Spanish telephone number.   
The company that I chose is [Lycamobile](https://www.lycamobile.es/), it's cheap, and it has the minimum requirements to live without any[^1] problem.   
The website tho has a problem with the login: I can't copy-paste my credentials. Besides that, in general, the UI it's a mess, and it's pretty slow, especially when you log in and want to see your data, but as I said, it's cheap.   
Every time I want to see how much money/internet data I still have, I have to spend some time to get my creds and access my profile. It's very annoying, so I thought to automatize this process by getting that info directly in my shell with one execution. Of course, I decided to use Rust for this job.

![vamos](https://media1.tenor.com/images/441d814d49f761085f8deefe63d0e2e9/tenor.gif)

## Login

As the first task, I needed to log in and keep the session alive. How to do it in Rust?

I used the [reqwest](https://crates.io/crates/reqwest) crave; I just need to add 

```
reqwest = { version = "0.11", features = ["blocking", "cookies"] }
```

to my `Cargo.toml` file to use it and have the `blocking` and `cookies` support since I don't need any async operation and need to save the session from one request to another.

Then let's start with the login:

```rust
let client = reqwest::blocking::Client::builder().cookie_store(true).build()?;
client.post("https://www.lycamobile.es/wp-admin/admin-ajax.php")
    .form(&[
            ("action", "lyca_login_ajax"),
            ("method", "login"),
            ("mobile_no", "<MOBILE_PHONE_NUMBER>"),
            ("pass", "<SUPER_SECRET_PASSWORD>")
    ])
    .send()?;
```

Yes, that's it. If everything is as it should be, I should have logged in. No, in this article, I won't do any further checks for simplicity.

Once I have done the login, I should get into my profile to get my stats; I can do it with these two lines of code:

```rust
let response = client.get("https://www.lycamobile.es/es/my-account/").send()?;
let body_response = response.text()?;
```

If everything went well, I should have gotten the page's body right into the `body_response` variable. Easy no?

![easy](https://media.giphy.com/media/3o7btNa0RUYa5E7iiQ/giphy.gif)

## Scraping the body

Now the tricky part, scraping the page's body; how to do it?

I used the [Scraper](https://crates.io/crates/scraper) crate; I need to add 

```
scraper = "0.12.0"
```

to my `Cargo.toml` file to be able to use it.

First of all, we need to parse our document that, in this case, is in the `body_response` variable.

```rust
let parsed_html = Html::parse_document(&body_response)
```

and then we can start scraping it:

```rust
let selector = &Selector::parse("p.bdl-balance > span")
    .expect("Error during the parsing using the given selector");
let span_text = parsed_html
    .select(selector)
    .flat_map(|el| el.text())
    .collect()
```

Here, I'm navigating the DOM of the page as I'm using JQuery. I say to the scraper that I want to get the text inside the span element, children of the paragraph with class `bdl-balance`. Incredible uh?

Then a bit of text manipulation: 

```
span_text.split("hasta").nth(1)
    .expect("Can't get the expiration date correctly")
    .trim_start().to_string()
```

And the result: `07-05-2021`

Same thing for all the information I need, just a bit of walking through the DOM using the correct selector, manipulate the result to obtain what I need and print it.

For example, the internet data left:

```rust
let selector = &Selector::parse("div.bdl-mins")
    .expect("Error during the parsing using the given selector");
let div_text = parsed_html
    .select(selector)
    .flat_map(|el| el.text())
    .collect()
```

and

```rust
div_text.get(2..)
.unwrap_or_else(||"Can't get the internet balance correctly")
.to_string()
```

To obtain: `5.66GB`

I spent like 20minutes in total to get it done, the crate's documentation and the examples I found on its pages were super helpful, and I've got my script done without any headache.

Later on, I decided that maybe this could have been helpful for someone else, so I decided to add more things like reading the credentials from a YAML file, having a pretty output, and checking more errors during the process.

I made it public on my Github: [https://github.com/dlion/rustyca](https://github.com/dlion/rustyca)

Here an example of the final output:

```
__________                __
\______   \__ __  _______/  |_ ___.__. ____ _____
 |       _/  |  \/  ___/\   __<   |  |/ ___\\__  \
 |    |   \  |  /\___ \  |  |  \___  \  \___ / __ \_
 |____|_  /____//____  > |__|  / ____|\___  >____  /
        \/           \/        \/         \/     \/

Money Balance: €0.03
Internet Balance: 5.66GB
Expiration Date: 07-05-2021
```

Nice uh?

![bello](https://media.giphy.com/media/l4hLByhJfsbv87PJC/giphy.gif)

My final thoughts about it are that I haven't had any issues using new crates or reading through the documentation and that the major problem I had was related to the fact that I'm still learning the language. I need more time to get used to the basics; doing that, I'm pretty sure I will speed up even the "let's do the right things in the right ways" part (the one that I care more, to be honest). 

Of course, any constructive feedback is welcome.

* * * 

[^1]: Actually I've had some problems with this cheap company but it's another another story

















