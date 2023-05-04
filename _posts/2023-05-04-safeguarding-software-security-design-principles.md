
---
layout: post
title: "Safeguarding Software: Embracing Security Design Principles in Software Development"
date: 2023-05-04 08:00:00
categories: [Programming]
cover: "/assets/images/covers/security-principles.png"
lang: en
---

In today's digital landscape, developing software with a security-oriented mindset is no longer an option – it's a top priority.   
I've had the opportunity to attend the [Secure Software Development Fundamentals Course](https://training.linuxfoundation.org/training/developing-secure-software-lfd121/) by the [Open Source Security Foundation](https://openssf.org/), and I found it enlightening and a must for passionate Software Engineers.   
So today, I'm going to talk about a set of widely recommended Security Design Principles that serve as invaluable rules of thumb for developing software with security-first in mind.   
Let's start! 🚀

----

# Least Privilege

Probably the most well-known principle, I'm talking about the `Least Privilege` design principle. This principle revolves around the concept of giving just the required privileges to a specific user/application to operate correctly, which means with **the fewest privileges possible**. Following this principle makes unintentional or improper uses of privilege less likely to occur.

A few points to remember 👇

* Don't give a user/application any special privileges if they are not needed.
* Always minimize the special privileges a user/program receives.
* Give up privileges as soon as they are no longer required.
* If it's not possible to give up privileges, try to limit the time the privilege is active.
* Break your application into different modules and give special privileges - if needed - to only a few modules.
* Minimize the attack surface.
* Validate the input before accepting it.
* Sandbox your application, running it in an intentionally restricted environment.
* Minimize privileges for files and other resources.

![least privilege](https://media.giphy.com/media/Hn1VPQRmzEZUc/giphy.gif)

# Complete Mediation

This principle is often called the `non-bypassability` principle. Essentially, it states that every access attempt coming from an external domain should be checked, and especially, don't act on the data received before validating that the request came from a valid source. By following this principle, we have thorough and consistent authorization checks at every access point in a software system, protecting data and enhancing the security of our application.

![check](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjFmYWQwZDQ5MmFmZGU1NWU3YzIxYzEzOGFhYjRmMTA3MDQ2MGViOSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/IeKgCDlpTqRQbZEhBF/giphy.gif)
# Economy of Mechanism

This is the `simplicity` principle, also called KISS. Security and over-engineering are always a dangerous duo. Having a security mechanism with lots of hidden features and intricate components can increase the chances of something going wrong. The rule to follow this principle is to keep your security mechanism simple. Don't try to reinvent the wheel or overcomplicate the solution – **keep it simple**. A simple system is easier to review, maintain, and test, and harder to get wrong.

![complex](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDc5Y2EzOTUyOGNhYTYwOTE1NDk5MzE3MmQ3NTk0MzA3ZjdjODNlNSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3o6Mbsras7qdAwgABW/giphy.gif)

# Open Design

The Open Design principle is often underestimated, but it's one of the most powerful. Essentially, it states that an attacker shouldn't be able to break into our system just because they know how it works. Relying on the ignorance of the attacker to protect our system is always a big mistake. We should always act as if the security mechanism is publicly known and depend on the secrecy of a few easily changeable items like credentials. The opposite of the Open Design principle is called Security Through Obscurity, and there have been multiple documented cases that prove it doesn't work. Moreover, having an open design makes extensive public scrutiny possible and gives confidence to any user who knows about the mechanism used that our software is secure.

![open design](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWIwOWQzYjJhM2I3ZGQ4NTVhOWJiZjM5NzNlYjM3YjM5NGFjNTRhNyZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/17DxVYqrlsbSDWiPeA/giphy.gif)

# Fail-Safe Defaults

The rule of this principle is that in situations where a decision or authorization cannot be explicitly determined, the system should default to the most secure option. Don't distribute software with an empty or default password; instead, force the user to set it up during the installation process. How many times have you seen default passwords being used by unaware users? By applying this principle, developers can minimize the risks associated with incomplete or erroneous authorization decisions.

![safe](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzBiOGJjY2RjMjdjMmMwZWE0Y2E3YjkxZjVmMmM3N2FjMGI2MzI4NyZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3ogwGakzdnTxvRgxfG/giphy.gif)

# Separation of Privilege

This principle states that access to critical resources or sensitive operations should depend on more than one independent condition. In this way, even if an attacker manages to break one condition, they still need to break the others to compromise the system's security. It promotes the distribution of privileges and responsibilities to multiple independent entities, reducing the potential impact of compromised accounts.

![powers](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWYzYTRiZDRlN2Q5ZTdlNTFjN2U3MzlhNzIxN2JhYmE2NTg1ZTA0NyZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/kQYNaEa35hQ6pCYywH/giphy-downsized-large.gif)

# Least Common Mechanism

This principle focuses on reducing the amount of shared resources or dependencies between different components of a system. In some cases, sharing can reduce costs, but it increases security risks. Following this principle leads to having more modular and robust software. For example, we can establish separate database connections for different components or modules instead of using a single, shared one. This approach minimizes the chances of conflicts or bottlenecks and allows for better isolation and scalability.

![don't share](https://media.giphy.com/media/llToceLTKQj0R1Asid/giphy.gif)

# Psychological Acceptability

This principle is more user-centric. It states that the security mechanism's user interface must be designed to be user-friendly and simple to use. If something is hard to use, it is often insecure in practice because users will work around it to make their lives easier. One easy example is defining rules for passwords; after a few attempts, users will resort to using very simple passwords just to pass all the checks and move on, causing the opposite effect.

![nope](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTY2NTkzMmE3ZjZiOTBmZGZjMTYwYzNkNDY1ODRmZjM3MDdmYWQ0MSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/gj0IKRLgBFap2TlcoD/giphy.gif)

# Conclusion

These security design principles are not mere theoretical concepts; they provide practical guidelines that can be applied during the software development lifecycle, which, for me, is **GOLD**.

Of course, these security design principles are guidelines, and there may be good reasons not to apply them in some cases. It is important to think about them wisely and consider the specific context of your software development project.

![think](https://media.giphy.com/media/d3mlE7uhX8KFgEmY/giphy.gif)

Remember, security is an ongoing process. We must remain vigilant, continuously assess our systems, and act accordingly.

As software engineers, we have the responsibility to build software that not only meets functional requirements but also prioritizes the protection of user privacy, data integrity, and system reliability.
