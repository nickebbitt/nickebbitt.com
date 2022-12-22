+++
title = "Reading a file in Java 8"
date = "2017-07-31T00:00:00Z"
+++

I always forget how to read the contents of a file, here's the simplest way I've come across.

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public static void main(String[] args) throws IOException {
    List<String> content = Files.readAllLines(Paths.get("input.txt"));
}
```

There are other variants of `Files.readAllLines` such as `Files.readAllBytes` etc.

Also, if it's a `Stream` you're after then use `Files.lines`, but don't forget to close the stream (thanks [Tim Yates](https://twitter.com/tim_yates)!).
