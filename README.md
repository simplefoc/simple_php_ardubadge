# A simple PHP based Arduino library badge generator


Make sure to check out https://github.com/gilmaimon/ArduBadge from @gilmaimon which is an awesome repo that has 
done this first, but is recently fallen out of maintenance. 
This repo is not really the fork of that project nor does it use the same approach, 
but it is inspired by it and reults in the same output.


## What is this?

This is a simple PHP based Arduino library badge generator. 
It generates a badge for your Arduino library by fetching the data from the
 Arduino website. The code can not be run on github as it does not support PHP, so it is hosted on 
 https://ardubadge.simplefoc.com/ 


## How to use it?

To use this badge generator, you need to provide the name of the library you want to generate the badge for.

The URL to generate the badge is:

```
https://ardubadge.simplefoc.com?lib=library+name
```
The output for the `Simple FOC` library will be:

![](https://ardubadge.simplefoc.com?lib=Simple+FOC)

## How to embed it in your README?

You can embed the badge in your README by using the following markdown code:
```markdown
![Arduino Library](https://ardubadge.simplefoc.com?lib=library+name)
```

or using the pure HTML code:
```html
  <img src="https://ardubadge.simplefoc.com?lib=library+name" alt="Arduino Library">
```

> Make sure to put `+` for empty spaces if your library has some
