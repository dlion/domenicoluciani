---
layout: post
title: "Your codebase is your garden"
date: 2020-04-15 08:00:00
categories: [Programming]
cover: "/assets/images/covers/garden.png"
lang: en
---

I always liked the `your codebase is like a garden` metaphor, it says that writing software is like gardening, you have to take care of your garden in many ways and from time to time you have to move plants around relative to each other, consider how to take advantage of the wind, rain and sunlight to help your plants grow and stay healthy. Every day you have to monitor them and make adjustments as needed. Like your code. But how can we do it in practice and become good gardeners?

## Refacto-what?

The first very pragmatic case where we can find the word `refactor` is during the [TDD](https://martinfowler.com/bliki/TestDrivenDevelopment.html) cycle: Red -> Green -> Refactor.   
We have a specific step where we have to focus on making our code cleaner and better.

![red-green-refactoring](/assets/images/posts/red-green-refactor.png)

This part is so importat that we need to separate it from the implementation part. It's like we are wearing two hat. The first hat is for the implementation, so create and add code. The second hat is about improving it.

Essentially:

> Rewriting, reworking and re-architecting code is called refactoring.

But remember, when we talk about refactoring we assume that we don't change our code's behaviour. We are wearing another hat.

## When should I refactor then?

There's not a specific rule for it but usually, I try to follow these points:

### Duplication

![dup_flowers](/assets/images/posts/dup_flowers.gif)

I'm always trying to follow the [DRY principle](https://martinfowler.com/ieeeSoftware/repetition.pdf) or when duplicating is necessary I try to follow the [three-strikes rule](https://wiki.c2.com/?ThreeStrikesAndYouRefactor).   
How to spot a duplication is just a matter of practices I guess, I found myself after many years of experience having a good sense of spotting duplications so my advice is to do more practice.

### Nonorthogonal design

![ortho_flowers](/assets/images/posts/ortho_flowers.gif)

We talk about nonhortogonality when modifying a component means having another effect somewhere else. For example, modifying the UI of our application results in a need to change our database too.   
When we say that two components are orthogonal between each other means that if we make some changes in one component, them don't affect the other one.

### Outdated knowledge

![deaf_flowers](/assets/images/posts/dead_flowers.gif)

The nature of our software is evolving by time so we have to update business and validation rules, our needs change and our software too.

### Performance

![speed_flowers](/assets/images/posts/speed_flowers.gif)

Of course, if we can improve our software's performances in terms of using the right data structure or using a better algorithm we should do it as much as we can.

## The practice makes perfect

Identify these smells is a matter of experience, my advice is to do some katas about refactoring, you can find many of them online, for example, the [trip service kata by Sandro Mancuso](https://github.com/sandromancuso/trip-service-kata) or the [tennis-refactoring kata by Emily Bache](https://github.com/emilybache/Tennis-Refactoring-Kata).

Try to follow the [boy scout's rule](https://www.oreilly.com/library/view/97-things-every/9780596809515/ch08.html) called also [Opportunistic Refactoring by Martin Fowler](https://martinfowler.com/bliki/OpportunisticRefactoring.html) as much as you can and take notes of the most common smells you have in your codebase trying to avoid to reproduce them the next time.

## How to convince your boss that you have to fix your roses

The example I like most is a medical one and I think it fits very well:   
let's think about our need to refactor as growth. Removing it requires invasive surgery, we can remove it now spending some time while it's small or we could wait while it grows. Then will be more expensive and dangerous and wait even longer could take our patient to death.

![heart-flower](/assets/images/posts/heart-flower.gif)

But I think the most important thing to mention to your boss is about economics. Martin Fowler talked about the [Design Stamina Hypothesis](https://martinfowler.com/bliki/DesignStaminaHypothesis.html), which show us that a clean and well-maintained codebase help us to deliver more features faster answering to the question `why should I refactor my code?`

Sometimes it's difficult to find time to do a refactoring that could take days to be finished so often we think that will be a better time to do our refactoring finding an excuse to avoid it but trust me, finding the right time later is difficult and often it never happen. In my team, for example, we thought about a basic solution: use a tech-debt dashboard.   
Every sprint we put in our board a tech-debt task to be sure to allocate some time to do something we left behind avoiding to let it grows. This is also called [Planned Refactoring](https://martinfowler.com/articles/workflowsOfRefactoring/fallback.html), it's still a smell but sometimes is a necessary evil.

## General advice

To maintain our garden beautiful and flourishing we should follow these steps as much as we can

 - Refactor early
 - Refactor often
 - Keep track of the things that need to be refactored
 - Do small reasonable steps. Do localized changes
 - Don't try to  refactor and add functionality at the same time
 - Make sure you have good regression tests, this is important to have enough confidence to refactor freely
 - Run tests as often as possible
 - Have fun

![forest](/assets/images/posts/forest.jpeg)

Happy gardening! 

## Resources

* During this quarantine I found myself re-reading [The Pragmatic Programmer](https://pragprog.com/book/tpp/the-pragmatic-programmer), a book which I strongly suggest to read at least once. Per year.
* Of course, I think all of us should have watched [Martin Fowler's talk about the refactoring's workflow](https://www.youtube.com/watch?v=vqEg37e4Mkw)
* Read the [Refactoring book by Martin Fowler](https://www.amazon.com/Refactoring-Improving-Design-Existing-Code/dp/0201485672)
* Watch [Sandro Mancuso's video about testing and refactoring legacy code](https://www.youtube.com/watch?v=_NnElPO5BU0)
