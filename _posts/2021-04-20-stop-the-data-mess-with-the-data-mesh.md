---
layout: post
title: "Stop the data mess with the data mesh"
date: 2021-04-20 08:00:00
categories: [Programming]
cover: "/assets/images/covers/data_mesh.png"
lang: en
---

One of the hottest topics of the moment in Big Data is undoubtedly the Data Mesh, but what is it? Why is this better than the solutions we had before? Do we need it? Should we adopt it?

Besides the Data Mesh, when we talk about Big Data we have two pretty standard solutions:

* Warehouse = Accumulate data into a central schema
* Data Lake = Accumulate raw data into a central location

We can see these solutions implemented in many ways; for example, I've seen a solution based on a Data Lake with real-time data and stream processing to ingest, transforming and serve it from a centralized data platform.   
It seems friendly and relatively straightforward, but it's not always the best solution. Having a centralized ETL[^1] pipeline means that each team has less control over it since different data use cases require different approaches. It also means that all teams rely on the data team, which may cause a bottleneck in the whole organization.

![busy](https://media.giphy.com/media/3DnDRfZe2ubQc/giphy.gif)

## Let's fix this mess

Essentially a Data Mesh helps to get rid of this problem by having a centralized location where to have our data (a DB or a distributed Data Lake) with each team/business area responsible for handling their ETL pipeline. It means more flexibility and autonomy.

![good_team](/assets/images/posts/good_team.png)

## Should we adopt Data Mesh?

The applicability of the Data Mesh paradigm depends on some aspect of your business, and it's not always applicable.

* Do you need to reduce the distance between data producer and data consumer due to the lack of business domain knowledge?
* Do your business domains have difficulties understanding each other or just collaborating effectively?
* Does data have value in your business?
* Is your culture prepared to take advantage of team autonomy?

These are just a few questions you should answer before using the Data Mesh paradigm but let's go deeper into the Data Mesh principles to understand what it means to have a genuine Data Mesh.

## Domain Ownership

As we already said before, each business domain is responsible for ingesting, clean and aggregate the data; they are the owners of their data. For instance, its business domain should observe its data to identify if its data are fresh or broken.

## Data as a product

Each business domain should have data around customer's needs, which means have specific and essential data gathered from a necessity filtering out everything is not crucial for that particular business domain. This help to focus on the right things having inside the organization only data which matter.

## Federated Computational Governance

Having a standard way to communicate and provide the data is the key to good collaboration between business domains. It means that each business domain should agree to have a common vocabulary and syntax defining SLAs between them that they will guarantee to its consumers.

## Self-Serve Data Platform

Each business domain needs to provide domain-agnostic data into the central platform so every other business domain can benefit from it. Thanks to this abstraction, it becomes easy to automatize the whole process creating a self-serve platform.

Understanding the Data Mesh principles, we can indeed say that it is a paradigm that matches the structure and language of the code with its corresponding business domain. 

> (DDD + Microservices) x Data

It's like applying a Domain-Driven design to our distributed data infrastructure.

![surprise](https://media.giphy.com/media/5VKbvrjxpVJCM/source.gif) 

## Scratching the tip of the iceberg and final thoughts

Recently I've had a workshop here @[ThoughtWorks](https://thoughtworks.com) run by [Chris Ford](https://twitter.com/ctford). It has been very formative, and it helped me to clarify some doubts putting my hands on some use cases. I'm now able to identify a Data Mesh than a Data Mess. Thanks!
    
Of course, the topic is huge, and it should require more words and use cases to be fully understood. I'll leave here a list of resources you can find helpful to go deeper.

* [Data as a Product webinar](https://www.thoughtworks.com/webinar/data-as-a-product#recording) by [Zhamak Dehghani](https://twitter.com/zhamakd)
* [How to Move Beyond a Monolithic Data Lake to a Distributed Data Mesh](https://martinfowler.com/articles/data-monolith-to-mesh.html) by Zhamak Dehghani
* [Data Mesh Principles and Logical Architecture](https://martinfowler.com/articles/data-mesh-principles.html) by Zhamak Dehghani
* [Data Mesh in Practice: How Europe's Leading Online Platform for Fashion Goes Beyond the Data Lake](https://databricks.com/session_eu20/data-mesh-in-practice-how-europes-leading-online-platform-for-fashion-goes-beyond-the-data-lake) by Max Schultze and Arif Wider
* [Data mesh: it's not just about tech, it's about ownership and communication](https://www.thoughtworks.com/insights/blog/data-mesh-its-not-about-tech-its-about-ownership-and-communication) by Arif Wider
* [Data Mesh whitepaper](https://www.thoughtworks.com/ebook/data-mesh) by ThoughtWorks

* * *

[^1]: [ETL](https://databricks.com/glossary/etl-pipeline)
