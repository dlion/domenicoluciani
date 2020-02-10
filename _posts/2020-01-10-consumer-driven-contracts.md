---
layout: post
title: "Consumer Driven Contracts"
date: 2020-01-10 08:00:00
categories: [Programming]
cover: "/assets/images/covers/consumer_driven_contracts.png"
lang: en
---

During our journey as developers, we often have to use external APIs, integrate our systems with them and be sure that everything works smoothly, sometimes it becomes difficult because suddenly the systems we are interacting with change their behaviour, breaking our integration.   
How to prevent it?

## What is a contract testing

We have two types of contract testing:

* Provider: The service which provides some APIs
* Consumer: The service which consumes some APIs

![ProviderConsumer](/assets/images/posts/provider_consumer.png)

Essentially a contract is an agreement between a consumer and provider, it means that if one of these actors change their behaviours breaking this agreement we will notice it automatically having a specific test behind it.


![contract](https://media.giphy.com/media/hYAvfvuj8xKxO/source.gif)

This type of testing has many benefits, one of those is about the evolvability of our system, it allows us to evolve our system without breaking any contract or simpler without breaking any existing functionality.   
When a provider accepts and adopts some expectations by a consumer, it enters into a consumer contract.

## Consumer Contract

* The contract is only about a subset of the system's business functionalities that our consumer has to use, they are a complete set of mandatory elements required to support consumer expectations.
* We can have multiple tests to tests multiple contracts, let's say for example different endpoints and behaviours.
* Being in a consumer contract means that the provider has an obligation from outside its boundaries. It doesn't mean that we have some impacts on our implementation but that it simply makes explicit that our service depend on the provider's implementation and push the provider to respect this agreement and let us consume their APIs as expected.

We can think that having a specific contract help the provider to understand what are the needs of the consumers and what business functionality is important for them highlighting which business value is truly important.   
Moreover, a consumer contract gives insights and rapid feedbacks to identify how the provider's changes could impact applications currently in production underlying hidden couplings.

Usually, we can use a consumer contract as a fitness function putting it inside our pipeline but a failure in a contract test shouldn't necessarily break the build in the same way that a normal test failure would.

![contract](/assets/images/posts/consumer_driven_contracts.png)

## More 

If you are interested in this topic I recommend to read [Building Evolutionary Architectures](https://www.oreilly.com/library/view/building-evolutionary-architectures/9781491986356/) and [Martin Fowler's article](https://martinfowler.com/articles/consumerDrivenContracts.html) about it.
