# Cred Server

This project aims to be a useful standalone authentication and authorization
system for managing a set of user credentials and issuing JSON web tokens with
permissions to access disparate resource servers that will accept the tokens
generated here.

But this is also a sandbox within which to test new ideas and identify re-usable
modules to break out into separate npm packages for use in more customized
systems.

Started as [cred-auth-manager](https://github.com/robmclarty/cred-auth-manager),
this project was originally intended to be one big piece that could be imported
to new projects, but proved a bit too opinionated, and too restrictive in its
architecture to be able to support a wide array of different use cases. Thus,
instead, I've decided to still maintain this project as a standalone app, but
also use it to find places where I can break off chunks into their own, more
focused, modules that can be used in custom projects. They can then be imported
back into this project and act as a demonstration of their real world usage.
