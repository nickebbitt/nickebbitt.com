+++
title = "JAlba 2019"
date = "2019-06-07T00:00:00Z"
+++

On the morning of 23rd May 2019 a group of Java enthusiasts from around the world converged on the historic Scottish city of Edinburgh for the 2nd edition of [JAlba Unconference](https://jalba.scot/).

For the 2nd time, JAlba did not dissappoint!

![Edinburgh](edinburgh.jpg)

JAlba is a special kind of conference that follows the [open space](https://en.wikipedia.org/wiki/Open_Space_Technology) format. After attending [JCrete](http://www.jcrete.org/) in [2016](https://nickebbitt.github.io/blog/2016/11/29/jcrete-2016), this quickly became my favourite kind of conference, and with JAlba being closer to home it's an event that would be rude to miss.

> It's basically JCrete but colder and no Cretan Raki.

That's not a problem though as there are many reasons other than the weather and alcohol that I enjoy this style of conference. The main one for me is that sessions are discussion based. Rather than being a consumer of a presentation for 45 minutes I'm actually involved in a conversation around a topic of interest. I feel I gain so much more from the open and collaborative setting that this creates.

JAlba is structured in such a way that after the planned sessions finish for the day everyone heads out as a group on excursions. The excursions are chosen to create the ideal environment for more geeky discussions that take on a more ad hoc and dynamic nature.

This year we headed to a lovely little village called Culross where a few us snuck off for a bit of geocaching. There was also a boat trip on the Firth of the Forth including a visit to [Incholm Island](https://www.maidoftheforth.co.uk/inchcolm-island) where we luckily managed to escape being attacked by nesting seagulls, except for Alex Theedom that is who quickly popped his umbrella for protection!

![Incholm Seagulls](seagulls.jpg)

[Jim Gough](https://twitter.com/jim__gough) and [Robert Scholte](https://twitter.com/rfscholte) somehow convinced a few of us to join them on a late night geocaching adventure to hunt down a cache they failed to find last year. We failed again! I suppose searching for a cache in the dark doesn't help! It does mean we'll have to come back next year for another look though, oh well.

![Night Caching](night-caching.jpg)

During this little adventure I had a great discussion about community and got some new ideas to take back and apply to the Manchester Java Community.

I attended many sessions on topics such as the social impact of technology, craftsmanship, whether you should buy or build and mentoring. Jim Gough has provided a write up for a couple of the sessions he facilitated on ["Is TDD dead?"](https://jpgough.github.io/blog/2019/05/26/jalba-tdd-dead) and ["Becoming a Developer Advocate"](https://jpgough.github.io/blog/2019/05/30/jalba-advocate) that are definitely worth checking out.

![The Marketplace](marketplace.jpg)

At work I've been spending a lot of time exploring the ideas behind a service mesh and playing around with Envoy proxy. I was lucky enough to run a session on service mesh exploring the questions of "What is it?" and "Do you need one?".

# Service Mesh

At an unconference such as this it is the responsibility of the person who proposed the topic to facilitate the session. I gave a short introduction describing what a service mesh is and some of the problems it solves.

![service mesh intro](service-mesh-intro.jpg)

## What is it?

We talked about the fact that a lot of engineering teams are building microservice based architectures. Naturally this style of architecture increases the number of network endpoints in a system significantly, all potentionally implemented using different technologies. There are a number of capabilities required by the services running behind each of the endpoints in a system such as this that are common. This is one reason why a service mesh can be useful.

Often capabilities such as encryption, service discovery and identity are provided through the use of libraries that are built in to the business application being deployed. With a service mesh these capabilities are pushed down to the network. One way of describing this is that the capabilities are provided out-of-process and a common implementation pattern is to deploy a side-car on the same host as the business application to act as a lightweight proxy. [Envoy proxy](https://www.envoyproxy.io/) is an example of a side-car proxy that be used to create a service mesh.

The service mesh and side-car pattern are a way of providing cross-cutting concerns and you can draw parallels with Aspect Oriented Programming in the way that the side-car proxy wraps the business app, intercepts requests to and from it and transparently provides various capabilities without having to implement them in the business application. This is a really powerful idea, particularly when you consider that many teams or organisations are deploying systems consisting of applications written in a variety of programming languages. With a service mesh you can provide a consistent set of capabilties across the whole system.

> Maybe the service mesh helps microservices actually become micro?

Not only do you get capabilities such as those previously mentioned, once all your services are connected using something like Envoy you can gain a great level of visibility for your system through a rich collection of metrics that are exposed as well as request tracing.

## Some discussion...

As with all sessions at an unconference such as this the value is in the conversation.

It was a small group for this session but it was interesting to discover that amongst us the concept of a _service mesh_ wasn't as well known as I though it might be.

The discussion therefore focused around my experience to try to answer the question of why you might want or need a service mesh.

Other than recent proof of concept work with Envoy my real practical experience was gained whilst working at Auto Trader. I worked on a infrastructure focused team responsible for migrating from a private cloud & virtual machine based platform to public cloud & containers, specifically [GKE](https://cloud.google.com/kubernetes-engine/). A popular service mesh offering for Kubernetes is [Istio](https://istio.io/) and Auto Trader were early adopters of it.

Istio uses Envoy under-the-hood as the side-car proxy running alongside each service in the mesh but it also provides much more than that. It provides the control plane for the mesh that configures the side-cars (Pilot) as well as other capabilties such certificate management (Citadel) and integrations with monitroing (e.g. Prometheus) and tracing (e.g. Jaeger). There's much more that I won't go into too...

Jim Gough gave us a demo of his project that shows some of Istio's capabilities around traffic routing based on API versions and fault injection, as well the service metrics that you get out of the box. Very cool!

![istio](istio.jpg)

At Auto Trader one of the main capabilities Istio helped to provide was mutual TLS between services in the mesh. Another key element was the high level of visibility that it provided out of the box enabling us to discover problems with applications that we didn't even know we had on the previous platform.

Granted, you can solve all these problems in various ways but I think real power of the service mesh is that you can provide these capabilities across all services in your system in a consistent way and transparently to your business applications. Of course, if you're on Kubernetes this becomes even easier.

## Do you need one?

I suppose it depends :)

My experience being part of a team building a new delivery platform on top of Kubernetes tells me that providing a service mesh as part of the platform can be hugely valuable. It does however increase the complexity of your system so that's definitely something to bare in mind.

In my view, if you have a way of providing the equivalent benefits of a service mesh with less effort and complexity then you should definitely choose that. Otherwise, maybe providing a service mesh as part of your platform offering is a good way to provide a number of core capabilities that most platforms need or could beneift from.

I imagine whether you are building a new platform or looking to retrofit a service mesh into an existing platform will play heavily into the engineering effort required to deliver it.

# Thanks!

To finish off this post I just want to say thanks to [Maurice Naftalin](https://twitter.com/mauricenaftalin) and the other JAlba disorganisers who made it happen.

Through organising [JManc](https://mcrjava.github.io/jmanc/) the last couple of years, which is only a single day event, I know how it can feel at times, wondering if anyone will come, debating whether it's all worthwhile etc.

I'd just like to say it definitely is worthwhile and I hopefully speak for all attendees when I say we appreciate it.

It's a great thing that we have a multi-day event of this kind in the UK focused around Java and it's ecosystem, long may it continue!
