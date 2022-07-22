---
layout: post
title: "Misleading Pair Programming"
date: 2022-07-22 08:00:00
categories: [Programming]
cover: "/assets/images/covers/pairing.png"
lang: en
---

I often read tweets, threads and posts full of complaints about this weird practice called **Pair Programming**, frequently due to a lack of understanding and wrong implementation.   
Today I'd like to spend some time clarifying why those complaints are misleading and why you should keep doing pair programming.

----

# It's tiring!
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Do you use pair programming? How do you do it?<br><br>It often feels like a more tiring way to move slower to me. Great for solving gnarly bugs together, but not for coding.</p>&mdash; Swizec Teller encouraging you to Be An Expert (@Swizec) <a href="https://twitter.com/Swizec/status/1363938310276583430?ref_src=twsrc%5Etfw">February 22, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I heard people complaining that 8 hours of pair programming are a nightmare.
 It is ruining their life, draining all their mental energies, and making them brainless at the end of the day.
Let me tell you a thing, and I want to make it clear:  
  
> If you are doing 8 hours of straight pair programming, you are doing it wrong!
  
## Take breaks!
Pair programming is a powerful and brain energy-consuming activity; therefore, having breaks **IS KEY**.   
One technique I like is the [Pomodoro](https://en.wikipedia.org/wiki/Pomodoro_Technique).   
Essentially it forces you to have breaks every 25 minutes of straight pair programming. The break usually lasts 5 minutes whenever you shouldn't do anything related to that specific task.   
Of course, you can be flexible according to your needs, but you shouldn't push too hard on that limit. Taking breaks is part of this activity; you and your pair should have it as frequently as possible. It's essential to have breaks and rest. Please do it.  
  
# It's slow!  
Another false assumption is that pairing slows you down.  
  
> Why have two people on the same task when you can have two people on two different tasks and speed up the development?  

![slow](https://media.giphy.com/media/3oriO7A7bt1wsEP4cw/giphy.gif)
  
It seems a fair statement, but it doesn't take into consideration the result of doing that, let's explore a few of them:
  
## Code Reviews
![code review](https://media.giphy.com/media/3o7WTL4qQCbbLLV2Pm/giphy.gif)

Doing code reviews is a common practice. Once you are done with your story, another (or more than just one) person has to review and accept your code to be merged.   
What are the pitfalls of this practice?   
- **Lack of context**: the person reviewing your code doesn't have the same context as you, it will lead to possible misunderstanding or long debates due to this deficiency, delaying the integration and having a longer feedback loop.   
- **It requires another person's availability**: waiting for another person to review your code leads to a significant delay creating a bottleneck within the team.   
- **Context Switch**: the other person probably is busy doing something else, like working on a different task. That person, just for unblocking you, has to do a context switch, review your code and then get back to the task by doing another context switch again. It has been proved that doing context switching often leads to spending lots of time restoring concentration and getting back on track.   
- **Fake Code Reviews**: Reading others' code is complex, and it requires concentration, especially without the context becoming time-consuming, so what do usually people do? Read quickly through the code, acting like a linter or a compiler. It is like doing a fake code review. It doesn't add any value; it can lead to side problems in the codebase and give the team a fake feeling of security. It often happens, especially when the team is in a rush due to imposed deadlines or constraints.

## Bus Factor and Collective Ownership
![bus factor](https://media.giphy.com/media/9qnogucSKuQ8g/giphy-downsized-large.gif)

Working alone on a task is cool until the rest of the team needs to know what you have done and how but you are not available.   
Handing over your knowledge around that task will require spending some time with the team explaining to them the code you have written, giving them the context and the choices you have made, and hoping they get it quickly. It could involve having different sessions with different people, drawing flows and having multiple discussions.   

All the things you can mitigate by having another person pair with you.   
In that scenario, two people are getting the same knowledge around a specific task; frequently rotating helps to spread this knowledge increasing the collective ownership of the codebase.   
Are you off tomorrow? No worries, you are covered by another person who knows what you know without the need to wait for you to be back.

# Sometimes I don't think that pairing is a good idea!
> Then don't do it!

Pairing is a valuable activity with multiple benefits, but it has to be used whenever it has sense; otherwise, it's just another practice you follow because of some "rules" written somewhere that someone is telling you to respect.   
If you see a task that doesn't require pairing, then you can just go ahead and do it by yourself. It is okay to have a sole moment, and it's up to you to decide whether or not to pair with someone else.

# Remotely is harder!
True, remote pairing is more complicated than pairing physically, and it is a fact. However, nowadays, we have some tools, precautions and equipment to overcome this situation as much as possible.
* **Slow internet connection**: Be ensure to have an internet connection that can support your pairing activities seamlessly. Without a good internet connection, the whole pairing activity will degrade, and it is no longer working anymore.
* **High-quality audio channel**: pairing forces you to communicate as much as possible. It's about sharing your thoughts; it's about having discussions and telling what you will do while driving. During the pairing sessions, **properly communicating is key**. Having a good headset with a good microphone (with noise reductions, for example) will allow you to not bother your pair with annoying noises and, on the other hand, to have a smooth call listening to your colleague seamlessly.
* **High-quality camera**: The body language is an essential part of the pairing session; it allows you to understand what the other person thinks (even unconsciously) and whether that person is following you or not. It will enable you to have a more human centre experience.   
These critical factors are missing during the remote pairing session. For this reason, it is essential to emulate the physical pairing as much as possible, having the camera on and streaming high-quality video. Having the camera on allows you to see the other person's expression and feeling of not being alone. It helps you to ensure to be listened to and force the other person to not be distracted. Turning your camera off is okay _if you need it or if you have a problem with your internet connection_. It's okay turning it off during your breaks, and it's okay if you are not feeling comfortable, but be conscious that you will lose lots of communication, making the session harder.
* **Use the right tool**: Don't stick with a single tool; if you need to use multiple tools, do it. The smoother the session is, the better. For instance, if you find the Zoom screen sharing pretty bad, try to use Visual Studio Live Code and use Zoom just for the call. Sure, you will use more resources, but it is the right thing to do if it improves your pairing session. Nowadays, there are a lot of tools you can try; use the one you and your pair find more comfortable.
* **Breaks breaks breaks!**: Pairing is a brain power-consuming activity, so if by default you need breaks, when remote, you need it even more. Don't be shy and ask whenever you need a break preventing zoom's fatigue or, in general, being exhausted at the end of the day.

# I have less experience than my pair
![less experience](https://media.giphy.com/media/qQJ1xyQXVuVfW/giphy.gif)

Pairing is not only about showing what you know but also showing what you don't know.   
It's totally fine saying "I don't know" during a pairing session. It's fine admitting you have less experience or are just blocked.
Your pair have to support, unblock and guide you.   
Pairing has this colossal benefit that cultivation is part of this activity. It helps juniors grow together by getting more confident, and it allows seniors to learn from less experienced engineers (it happens frequently).   
Pairing is about trust and being honest and open with your pair, so don't be afraid. Learning is a beautiful journey, and pairing is the safest way to do so.

# I have more experience than my pair
Having more experience than your pair shouldn't be a problem; it should be an occasion to do mentoring and cultivation.   
As a more experienced person, you should adjust your speed accordingly.   
The pairing session is also an excellent way to clarify whether or not you understood something; if you can explain it in simple words, then you understood it. It is a perfect way to improve your skills.

# Yara Yara
I'm pretty sure there are many other complaints we can consider and address, but the result will always be the same.   
Pair programming brings to your team tons of benefits if it is done correctly.   
My advice would also be to set the right expectations at the beginning of the session. Let's agree on what the pairing session would look like and clarify the style with your pair to avoid wrong assumptions and behaviours that can degrade the experience for both of you.

Happy Pairing!

![happy](https://media.giphy.com/media/toXKzaJP3WIgM/giphy.gif)

# Other resources

Here there are some resources you can find useful to convince your boss that doing pair programming is the way:

* https://tanzu.vmware.com/developer/learningpaths/application-development/pair-programming/
* https://martinfowler.com/articles/on-pair-programming.html
* http://www.extremeprogramming.org/rules/pair.html
