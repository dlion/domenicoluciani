---
layout: post
title: "Buildpacks - 3 months later"
date: 2023-11-16 08:00:00
categories: [Programming, Life]
cover: "/assets/images/covers/take3.png"
lang: en
---

Since the beginning of my career in this industry, I've always been fascinated by the open-source world.   
After so many years of contributing on my own, this year, I finally joined for 3 months an open-source team within VMware and discovered how an open-source team works.   
In this article, I'm going to tell you more about this open-source journey and how it went. Let's go! 🚀

## Take 3

I'd like to start with how I ended up working full-time on an open-source project, and to do so, I have to describe what a VMware Take3 initiative is.   

[VMware](https://www.vmware.com/), the company I currently work for, gives everyone the fantastic opportunity to join another team within the company for a limited amount of time, usually 3 months (that's why the 3 😉).   

Every team that needs some help or that is open to accepting temporary new joiners can publish an opportunity in an internal platform. Sometimes they require specific skills, proficiency in a particular stack, or just people with the motivation to learn new things.   

Everyone who has the approval can apply to those opportunities, and have a conversation with the manager who published it to verify whether that person might be a good fit or not.   
As you can imagine I went through this process early this July and, I applied for a Take3 to join a small open-source team called 

> **CNB** - **Cloud Native Buildpacks**. 👀

## What do Buildpacks do?

**TLDR**: Buildpacks turn your code into OCI-compliant containers. They examine your source code, build it, and create a container image with all the required dependencies to run your application. ⚡️   

Using Dockerfiles can be exhausting, you have to make lots of decisions like which base image you want to use and which version, being sure that all your application dependencies are ok with it. After that, you need to bring additional dependencies, and runtimes, build your application, and finally optimize all these operations to have an optimized container.   
Cloud Native Buildpacks on the other hand would take care of all these steps, at least for most of the common use cases.   
Your container also needs to be maintained over time, using your Dockerfiles you don't have a real separation between the base image, the runtime, your dependencies, and your application so updating the image would require rebuilding it every time.   

Cloud Native Buildpacks create different layers that can be swapped with new versions like Legos. 🧱   
If you want to know more about it, have a look at the [Cloud Native Buildpacks website](https://buildpacks.io/).

## Cloud Native Buildpacks - The team

CNB stands for [Cloud Native Buildpacks](https://buildpacks.io/), it's a small team composed of amazing people who are spending their daily time on repositories like [Buildpacks/Pack](https://github.com/buildpacks/pack) and [Buildpacks/Lifecycle](https://github.com/buildpacks/lifecycle).   
Their main duty is to help the Buildpacks maintainers and the Buildpacks community, they take care of the issues, develop new features, attend numerous working group meetings, and help release new versions.

## How does the Cloud Native Buildpacks Open Source team work?

The Open Source world is *HUGE*, and a standard to follow doesn't exist yet, so every experience can be unique. 👈🏻   
The team's favorite way of working is to be [async](https://handbook.gitlab.com/handbook/company/culture/all-remote/asynchronous/) as much as possible due to the different timezones involved and then take advantage of the overlapped hours to pair/sync if necessary.   
We were using an async standup where we could raise blockers and/or keep the rest of the team up-to-date.

During the week we had different meetings:
* Internal Sync with other teams
  * In the internal sync meetings a representative of the team kept other teams informed about the work in progress and possible new initiatives and events.
* Working Groups
	* During these meetings, we catch up with maintainers, other collaborators, and people with specific requests and problems. This meeting was one of the most interesting ones for me, it gave me the occasion to meet people working for other companies, from Google to Bloomberg.
* Iteration Planning Meetings
	* During these meetings, each of us talked about the tasks in progress, and their status, and asked for help and possible future initiatives.
* Knowledge sharing meetings
	* These meetings were about sharing interesting stuff, they could be very effective during the onboarding process or just to dive deeper into some fun topics.
* Social meetings
	* Working remotely doesn't mean you have to be alone the whole time, these meetings were a nice opportunity to know each other better, talk about anything, and play some nice games. It was very refreshing knowing that behind such talented people, there were extraordinary human beings.
* Pairing Sessions
	* Pairing was crucial to get onboarded and help faster. Collaborating so closely with other team members helped me to get confident with the codebase and to answer many questions that I -could- definitely have

### How a day within the team looked like

Most of my mornings were free from meetings due to the different time zones, so I could focus on getting things done. 🚀   
Getting things done meant continuing my tasks in progress, reviewing issues opened, and reviewing PRs. Being in a different timezone allowed me to interact efficiently with whom was in my timezone as well.   
In the afternoon it's when I had most of my meetings, I could catch up with the rest of the team and join the necessary meetings explained above, besides, of course, our pairing sessions.

## Expectations 
The expectations that have been set for me was to be able to deliver *one* feature at the end of the 3 months of the Take3.   

My todo list was kind of similar:
* First week: get onboarded
	* Learn about the project, the team, the codebase, etc.
* Second week: try to work on a first good issue
	* Usually, they are very simple issues
* 3 Months: Deliver a feature
	* E2E Ownership

## Golang
Despite my long experience jumping from one stack to another, I've had just one occasion to push any written Golang code to prod so far, and it was a few years ago. Now, the challenge was to re-learn it and, to kind of push it to prod.   
Kind of because our "prod" was a "release" state, not a real prod env, since the software I was working on was mainly a CLI app.   
Honestly, I liked Golang and I was able to use it quite effectively in no time. I liked to work with this language and I would like to work again with it in the future. 👀

## First Feature
Thanks to my years of experience jumping from one stack to another as a consultant Extreme Programmer, I could re-learn the basics of the Go language quite quickly and, I've got my first feature merged *within one week*.

I picked up one first good issue: [https://github.com/buildpacks/pack/issues/1800](https://github.com/buildpacks/pack/issues/1800) and created a PR that has been merged within 1 week: [https://github.com/buildpacks/pack/pull/1810](https://github.com/buildpacks/pack/pull/1810). 🥳   
At that moment, I was officially a *paid Open Source contributor*. 🚀

## Open Source Contributor

I started contributing to the Open Source when I was young, I think I was 17 years old, this is my first contribution ever: [https://github.com/toshidex/DefollowNotify/pull/1](https://github.com/toshidex/DefollowNotify/pull/1).   
Then I 've been an Hacktoberfest contributor: [2017](https://domenicoluciani.com/2018/01/10/hacktoberfest-swag.html), [2018](https://domenicoluciani.com/2019/02/10/hacktoberfest-18.html), [2019](https://domenicoluciani.com/2019/12/18/hacktoberfest-19.html), [2020](https://domenicoluciani.com/2021/01/31/hacktoberfest2020.html).   
And finally, after so many years, I was a paid open-source contributor. I was so happy that I had to [share it on Linkedin too](https://www.linkedin.com/posts/dlion_github-buildpackspack-cli-for-building-activity-7079918050530975744-btba).

### Back to Labs

Months have passed now, and I'm back at [Tanzu Labs](https://tanzu.vmware.com/labs), happy to have had the time to help this amazing team and learn about Buildpacks internals.   
It was an amazing experience I'd try again in the future.

## Some of my contributions:
* Pack: [https://github.com/buildpacks/pack/commits?author=dlion](https://github.com/buildpacks/pack/commits?author=dlion)
* lifecycle: [https://github.com/buildpacks/lifecycle/commits?author=dlion](https://github.com/buildpacks/lifecycle/commits?author=dlion)
* samples: [https://github.com/buildpacks/samples/commits?author=dlion]( https://github.com/buildpacks/samples/commits?author=dlion)
* imgutil: [https://github.com/buildpacks/imgutil/commits?author=dlion]([https://github.com/buildpacks/imgutil/commits?author=dlion)
* docs: [https://github.com/buildpacks/docs/commits?author=dlion]([https://github.com/buildpacks/docs/commits?author=dlion)
* RFCs: [https://github.com/buildpacks/rfcs/commits?author=dlion](https://github.com/buildpacks/rfcs/commits?author=dlion)

I led and facilitated a [user journey mapping](https://tanzu.vmware.com/developer/practices/journey-map/) session with some our users about a [flatten feature](https://github.com/buildpacks/rfcs/pull/290), it was really interesting getting feedback from our users, shaping the functionality based on their feedback and of course, I was happy to have put my facilitation skills to help the project.

![user journey mapping](https://user-images.githubusercontent.com/2125236/257560685-b9a8a0b6-55f0-4074-a8d4-2d7baf6c4338.png)

## Outcome 

I **over-achieved** the initial goal of delivering just one small feature, but I've got passionate about the project and, I couldn't help myself delivering just one small thing, I wanted to have an impact and deliver as much value as possible to our users.

## Become a contributor

* If you want to start becoming a contributor don't be shy and take any of the first-good-issue issues that already exist on any of the repos I linked above.
* Ask for help, the team is there to support you, and they will try to unblock you, they are the best! 💪🏻

## Thank you

I'd like to thank:
* VMware for the amazing opportunity.
* The CNB team has welcomed, helped, and supported me all the time: Natalie, Juan, Navdeep, Nanci and Joe.
* Labs managers that have approved my request for the Take3
