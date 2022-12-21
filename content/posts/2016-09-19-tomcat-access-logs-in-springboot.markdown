+++
title = "Tomcat access logs in SpringBoot"
date = "2016-09-19T20:03:11Z"
+++

If you're running your SpringBoot app using Embedded Tomcat it may be useful to generate the access logs.

To do this add the following config to your application.properties file:

{{< highlight java >}}
server.tomcat.accesslog.enabled=true
server.tomcat.basedir=tomcat
{{< /highlight >}}

Alternatively, the property values can be passed as command line options.

The result will be a new directory called tomcat at the same level as the JAR under which your logs will be created.

SpringBoot version: `1.4.0-RELEASE`
