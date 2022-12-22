+++
title = "Git aliases"
date = "2017-08-21T00:00:00Z"
+++

[Git aliases](https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases) are a cool feature. With a little config you can power up your Git command line.

Here a few I have configured that make my day-to-day use of Git much nicer.

## status

This alias saves me typing a few characters (I'm lazy):

```bash
alias.st=git status
```

I can then save my fingers some effort by writing `git st` to quickly check the status of repo.

## log

I have the following alias configured that I use in place of the standard `git log` command:

```bash
alias.lg1=log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(bold yellow)%d%C(reset)' --all
alias.lg2=log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold cyan)%aD%C(reset) %C(bold green)(%ar)%C(reset)%C(bold yellow)%d%C(reset)%n'' %C(white)%s%C(reset) %C(dim white)- %an%C(reset)' --all
alias.lg=!git lg1
```

Running `git lg` produces the following output which is much nicer than the default:

![git lg](git-lg.png)

## pull & rebase

When developing changes on a local branch, prior to pushing to the remote repo I will generally rebase against `master`. To achieve this I also need to pull master first. As I do this regularly I've wrapped it in the following alias:

```bash
alias.prom=pull --rebase origin master
```

This allows me to simply run `git prom` to get my branch bang up-to-date.

---

I'd be interested to hear of any others people are using.
