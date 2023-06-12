---
layout: post
title: "How I Passed my AWS Certified Developer Exam"
date: 2023-06-08 08:00:00
categories: [Programming, Life]
cover: "/assets/images/covers/cloud_cert_aws.png"
lang: en
---

A few weeks ago [I passed my AWS Certified Developer Associate (DVA-02) exam](https://domenicoluciani.com/2023/05/16/aws-certified-developer-associate-certification.html) and I thought it would have been nice to document how _heck_ I accomplished to do it on a first try, and of course provide some hints to whoever wants to 
do the same. 🧑🏻‍💻👨🏻‍💻

----

## But why did you spend your time getting the certification?

I'd like to start by saying that I'm not a big fan of getting as many certifications as possible, I'm more affected by the greedy learner pathology which pushed me forward on this route.

> This indeed is my first real certification.

I started to study AWS **just for fun** and to desire to become a better professional. **I wasn't really interested to get any certification.**   
I started it for fun and it became even more fun over time, digging deeper into AWS services and use cases, so at the end of the path/course I felt that after all the effort I could try to challenge myself even more by getting the 
certification.   
**I LOVE GOING OUTSIDE MY COMFORT ZONE** 

>Did I need it? No.   
>Do you need it? Probably not.

It was just a matter of challenging myself, nothing more 🤭 so my advice is to enjoy the journey and learn as much as possible but just for your own sake, it will give you the extra motivation you need to pass the exam at the first try. 🎯

## Why did I focus on AWS?

I work at [VMware Tanzu Labs](https://tanzu.vmware.com/labs) right now, and we often jump from one project to another; it's always fun and it gives the possibility to work on different things and don't get bored. 🤩   
One thing that I noticed was that during my career I've always been facing AWS architectures at least once per year.

> At least one client had their ecosystem on AWS.

Working for a [Multi-Cloud company](https://vmware.com) gives me the possibility to have a T-shape skills-set, focusing more on the `how`  than the `what`; I mean, I worked on Azure and GCP as well, but to be honest the most fun 
ecosystems I worked on were on AWS. 🤭

So I felt that I needed, for my career and for my interest (📚) to fill out some gaps that I had on AWS to become a better engineer and a better professional. 💪🏻

## Where did I study?

### A Cloud Guru

Working at VMware also means I have lots of benefits 😌🙏 and one of them is the possibility to access [https://acloudguru.com/](https://acloudguru.com/) courses/resources/labs **FOR FREE**! ✨   
A Cloud Guru is well known to be very expensive but to have one of the best playgrounds out there.

#### Playground?

Yes, essentially you can just go to their playground section   
Open a new session of their sandbox and log in.

From that moment till a bunch of hours, you will have the chance to play with an almost real AWS environment, bill-free. 👀

![playground-aws-1](/assets/images/posts/playground-aws-1.png)

#### Developer Associate Course

Of course, A Cloud Guru has its course: [https://learn.acloud.guru/course/aws-certified-developer-associate](https://learn.acloud.guru/course/aws-certified-developer-associate)   
I took it and I can say that it covers more or less everything you need to know to pass the exam.   
Especially I want to call out the 4 mocked exams which have been super useful to get to know the exam env and the questions' style.

![mocked-exam](/assets/images/posts/mocked-exam-aws.png)

### Tutorials Dojo

Another resource I found useful to reinforce my knowledge was [https://tutorialsdojo.com/](https://tutorialsdojo.com/)   
It's a website that contains a study path for each certification.   
Here the one for the Developer Associate: [ https://tutorialsdojo.com/aws-certified-developer-associate-exam-guide-study-path-dva-c02/](https://tutorialsdojo.com/aws-certified-developer-associate-exam-guide-study-path-dva-c02/)

#### Mocked Exams

In Tutorials Dojo you can also find mocked exams which as far as I heard are very close to the real ones but I haven't purchased it so I don't have a personal opinion or experience on it.

### AWS Whitepapers

Listed either on Tutorials Dojo or A Cloud Guru you can find a list of recommended whitepapers from AWS that are worth reading.   
I know, they are quite big but I think that reading them once is worth your time.

### Reddit
I also really liked reading about other experiences on [/r/AWSCertifications/](https://www.reddit.com/r/AWSCertifications/), it is full of nice advice and great people who can help you out.   
There I discovered that there are other recommended resources that I didn't follow, maybe it's worth having a look at it. 👀


## How did I study?

> Every person has their unique approach so there aren't good or wrong ways to study.

Having a full-time job it's always complicated to find the time and the energy to study, for this reason, I repeat that you should study _only because you want to learn new things_, improve yourself and become a better professional.   
The certification itself IMHO doesn't add anything up to your skills-set.   
I studied for 2 months more or less, dedicating myself to it almost every day for at least 25 minutes.

> Something I would like to highlight here is that **I have more than 10 years of experience** as a Software Engineer so your experience can be different and you might need more time and resources.

### Obsidian

[Obsidian](https://obsidian.md) is my main tool for taking notes, creating blog posts, scheduling my day, keeping track of everything, and of course: studying.   
[I switched over to Obsidian from Notion](https://domenicoluciani.com/2021/12/17/why-did-i-switch-from-notion-to-obsidian.html) and I will never get back to it.   
My main way to study is to take notes about whatever I read/watch and then look at it later on, to memorise better and freshener those concepts.   
Spatial repetition works very well for me even tho I'm not very consistent.

### Excalidraw

Another amazing tool I've been using to memorise better is [Excalidraw](https://excalidraw.com/), an infinite canvas that I used to divide each topic with its information.   
It has been very useful to visualise the information that I've got from the video course and blog posts.

Worth to mention that Obsidian has an [Excalidraw plugin](https://github.com/zsviczian/obsidian-excalidraw-plugin) which means you can use all Excalidraw functionalities from your Obsidian instance, having your draws locally.

For me having a visual representation works quite well and it helps to remember better.

![excalidrw-aws](/assets/images/posts/excalidraw-aws.png)

### Mocked Exams

As mentioned before doing mocked exams **IS KEY** to pass your exam, it helps you to get familiar with the questions and the timing.

#### Strategy I adopted

A Cloud Guru gives you 4 exams that you can practice with.

My strategy was:
1. Take the mocked exam
2. Review the questions I've answered wrongly
3. Take notes of the wrong answers
4. Read deeper about that specific topic by going through the AWS documentation
5. Read again what I did wrong
6. Re-take the exam

My goal was to pass each mocked exam with at least 80% of correct answers.   
I've done it multiple times during the 2 months I spent studying.   
Don't focus too much on the specific questions but more on the topics they cover.

### Hands-on Lab

A Cloud Guru helps a lot with the hands-on part but it doesn't mean you can't open an AWS free-tier account and try by yourself to play with AWS services.   
Right now the exam is composed of 65 multi-choice questions so at first it seems not hands-on oriented but that would be the wrong assumption.   
Lots of questions are about specific technical details and particular services options that it's easier to know if you had the chance to play with them and having a hands-on experience is always better considering the 
nature of this certification.

## Final thoughts

Coming to the end of the article, I'd like to say again that I think that the certification per se says nothing about your competencies and skill set.   
Yeah, it shows other people that you can stick to a plan, go out of your comfort zone and that you are capable of learning new things.   
I've been a software engineer for more than 10 years so far, and I can say that having a certification doesn't mean you are a better professional than those who don't have it.

##### Friendly reminder:

Don't be too hard on yourself, if you don't pass the exam, if you don't complete the course or if you drop it after a few months.   
Keep trying, keep being motivated thinking about what you are learning more than what you can do with the certification.

Good Luck! 🍀
