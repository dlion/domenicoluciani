---
layout: post
title: "Misleading Pair Programming"
date: 2022-07-22 08:00:00
categories: [Programming]
cover: "/assets/images/covers/pairing.png"
lang: en
---

I often read tweets, threads and posts about a weird practice called **Pair Programming**, full of complaints. But I find this usually due to a lack of understanding and improper implementation.   
I'd like to clarify why those complaints are misleading and why you shouldn't write pair programming off completely.

----

# It's tiring!
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Do you use pair programming? How do you do it?<br><br>It often feels like a more tiring way to move slower to me. Great for solving gnarly bugs together, but not for coding.</p>&mdash; Swizec Teller encouraging you to Be An Expert (@Swizec) <a href="https://twitter.com/Swizec/status/1363938310276583430?ref_src=twsrc%5Etfw">February 22, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I read the complaint that 8 hours of pair programming is a nightmare. It is ruining their life, draining all their mental energies, and making them brainless at the end of the day.   
I mean, pairing IS tiring, and our job IS tiring, BUT let me tell you a thing, and I want to make it clear:  
  
> If you are pair programming for 8 hours straight, you are doing it wrong!
  
## Take breaks!
Pair programming is a powerful and brain energy-consuming activity; therefore, taking breaks **IS KEY**. But pairs are frequently so focused on the task that they forget until they suddenly realize they're exhausted.   
Here's one technique I use to remember to take breaks: [Pomodoro](https://en.wikipedia.org/wiki/Pomodoro_Technique).   
Essentially it forces you to take a break every 25 minutes of straight pair programming. The break usually lasts 5 minutes, during which you shouldn't do anything related to that specific task. Do something else, step away from screens, look out the window or refill your glass of water.   
Of course, you can be flexible according to the needs of you and your pair, but you shouldn't push too hard on that 25-minute limit. Taking breaks is part of this activity; you and your pair should do it frequently. It's essential to have breaks and rest. Please do it.  
  
# It's slow!  
Another false assertion is that pairing slows down the development process.  
  
> Why have two people on the same task when you can have two people on two different tasks and speed up the development?  

![slow](https://media.giphy.com/media/3oriO7A7bt1wsEP4cw/giphy.gif)
  
It seems a fair statement on the surface, but let's look deeper:
  
## Code Reviews
![code review](https://media.giphy.com/media/3o7WTL4qQCbbLLV2Pm/giphy.gif)

Doing code reviews is a common practice in multiple realities. Once you are done with your story, another (or sometimes more than just one) person reviews and ultimately accepts the code you wrote to be merged.   
What are the pitfalls of this practice?   
- **Lack of context**: the person reviewing your code doesn't have the same context as you do. It can lead to misunderstandings or long debates, delaying the integration and resulting in a longer feedback loop.   
- **It requires another person's availability**: waiting for another person to review your code leads to a significant delay creating a bottleneck within the team.   
- **Context Switch**: It's been proven[^1] that context switching requires a lot of time to return to the original task following an interruption. If you, as a solo programmer, are blocked, you create this situation for your coworker who leaves her own task to help unblock you. In contrast, even when a pair is interrupted to help unblock someone else, getting back on track together is much easier.
- **Fake Code Reviews**: reading code written by others is complex. Especially without context, it can become very time-consuming. A typical response to this challenge is scanning the code, acting like a linter instead of truly understanding what has been written and how it will fit into the whole. It is like doing a fake code review, and it doesn't add any value; in fact, it can lead to new problems in the codebase while giving the team a false feeling of security. It's easy to fall victim to this practice, especially when the team is in a rush due to imposed deadlines or other time constraints.

## Bus Factor
![bus factor](https://media.giphy.com/media/9qnogucSKuQ8g/giphy-downsized-large.gif)

Working alone on a task is cool until someone else on the team needs to know what you have done and how, but you are not available to ask.   
Handing your knowledge around that task will require explaining the code you have written, the context and the choices you have made, and hoping they get it quickly.   

These are all the issues you can mitigate by working from the start with pair.   
This way, two people build the same knowledge base around a specific task. Frequent rotations between pairs help to spread this knowledge increasing the collective ownership of the codebase.   
Are you off tomorrow? No worries, the code will continue to be developed while you're out because the team knows what you know about the problem you're solving together.

# Sometimes I don't think that pairing is a good idea!
> Then don't do it!

Pairing is a valuable activity on several levels but should be used when it makes sense. Otherwise, it's just another practice you follow because someone said you should.   
If you see a task (i.e. adjusting some documentation) that doesn't require pairing, do it yourself. It is okay to have a solo moment, and it's up to you to decide whether or not to pair with someone else.

# Remote is harder!
True, remote pairing is more complicated than pairing physically. However, nowadays, we have some tools, practices and equipment to overcome these challenges as much as possible.
* **Slow internet connection**: Ensure an internet connection that seamlessly supports your pairing activities. Without a good internet connection, the whole pairing activity will degrade and become painfully slow and disruptive.
* **High-quality audio channel**: pairing forces you to communicate as much as possible. It's about sharing your thoughts and thinking out loud so your pair can follow what you're doing. It's about discussing and describing what you will do while driving or navigating. During the pairing sessions, communicating well **is key**. A good headset with a good microphone (with noise reduction) will protect your pair from annoying background noises while you listen to your colleague with in-person fidelity.
* **High-quality camera**: Body language is an essential part of pairing; it helps you understand what the other person is thinking (even unconsciously) and whether that person is following you or not. It will enable you to have a more human centre experience.   
Some of these critical factors are missing during the remote pairing session, where we can often see only the head and shoulders of our partner. Keeping the camera on and streaming high-quality video helps get the most out of this limited view. It allows you to see the other person's expressions well. It helps you to be listened to and forces the other person to not be distracted. Briefly turning the camera off is okay _if you need to blow your nose, for instance, or if you have a temporary problem with your internet connection_. Be sure to communicate this to your pair. Without the visual cues, be conscious that you will lose lots of communication, making the pairing session harder.
* **Use the right tools**: Don't stick with a single tool; if one tool works better for screen-sharing and another for video chat, use them. For instance, if you find the Zoom screen sharing pretty bad, try to use Visual Studio Live Code and use Zoom just for the call. Yes, you will use more resources, but it is the right thing to do if it improves your experience. Nowadays, you can try many tools; use the ones you and your pair are most comfortable with.
* **Breaks breaks breaks!**: Pairing is a brain power-consuming activity. If by default you take breaks, when remote, you'll need them even more. Don't be shy and ask whenever you need a break to prevent Zoom fatigue or, in general, being exhausted at the end of the day.

# I have less experience than my pair
![less experience](https://media.giphy.com/media/qQJ1xyQXVuVfW/giphy.gif)

Pairing is not only about showing what you know but also showing what you don't know.   
It's totally fine saying "I don't know" during a pairing session. It's fine to admit you have less experience or are just blocked.   
Your pair have to support, unblock and guide you.   
Pairing has this colossal benefit that cultivation is part of this activity. It helps juniors grow together by getting more confident, and it allows seniors to learn from less experienced engineers (it happens frequently).   
Pairing is about trust and being honest and open with your pair, so don't be afraid. Learning is a beautiful journey, and pairing is the safest way to do it.

# I have more experience than my pair
Having more experience than your pair shouldn't be a problem; it's an occasion for mentoring.   
The goal is to develop a shared context of the problem and solution. As a more experienced person, adjust your speed so your pair can follow along and ask you questions as necessary.   
The pairing session is also an excellent way to clarify whether something is understood; if it can be explained in simple words, then you know it. Think of pairing with a less experienced colleague as a perfect way to improve your speaking and teaching skills.

# Yada yada yada
There are probably many other complaints we could consider, but the result will always be the same.   
Pair programming brings to your team tons of benefits if it is done correctly.   
My advice is to set expectations at the beginning of each session. Agree on what the pairing session will look like and clarify the style together to avoid misaligned assumptions resulting in behaviours that can degrade the experience for both of you.

Happy Pairing!

![happy](https://media.giphy.com/media/toXKzaJP3WIgM/giphy.gif)

# Other resources

Here there are some resources you can find useful to convince your boss that doing pair programming is the way:

* [https://tanzu.vmware.com/developer/learningpaths/application-development/pair-programming/](https://tanzu.vmware.com/developer/learningpaths/application-development/pair-programming/)
* [https://martinfowler.com/articles/on-pair-programming.html](https://martinfowler.com/articles/on-pair-programming.html)
* [http://www.extremeprogramming.org/rules/pair.html](http://www.extremeprogramming.org/rules/pair.html)

# Thanks

I want to thank my colleague [Judy](https://www.linkedin.com/in/judyvansoldt/) for taking the time to read and review this article and for providing me lots of interesting advice and corrections.

![thank you](https://media.giphy.com/media/wIVA0zh5pt0G5YtcAL/giphy.gif)

---

[^1]: [Context Switching is hurting your productivity](https://blog.pleexy.com/context-switching-is-hurting-your-productivity-and-brain-health-heres-what-you-can-do-about-it-5bdcebd1fd42)

