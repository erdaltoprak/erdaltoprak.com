---
layout: ../../layouts/LayoutBlog.astro
title: Abstracting local development environments through containers
pubDate: 2022-04-20
description: "Abstracting local development environments through containers"
author: Erdal Toprak
og: "https://erdaltoprak.com/assets/blog/abstracting-local-development-environments-through-containers/banner.jpeg"
---

![Banner](/assets/blog/abstracting-local-development-environments-through-containers/banner.jpeg)
  
Every time I set up my devices, I like to take the time to use the sensible defaults of the operating system and then evaluate my personal needs of customization. On Mac devices, the default apps are quite good in terms of long term support and integration across devices, so installing a complete development environment often causes some disruption in the everyday workflow experience.
  
 If you tried to install a development environment on your computer, especially python, you must be familiar with this popular [xkcd](https://xkcd.com/1987/).
  
  
  ![xkcd python](/assets/blog/abstracting-local-development-environments-through-containers/xkcd.png)
  
  
  My goal going forward is to abstract my local development environment, so I can be more flexible and avoid unnecessary risks by separating the professional and personal usage, and this can be done through containers.
  
  ## Dev containers
  
  In [VS Code](https://code.visualstudio.com), the addition of development containers allows developers to use a reproducible and isolated environment while maintaining the flexibility of local files.
  
   ![Dev Containers](/assets/blog/abstracting-local-development-environments-through-containers/dev-containers.png)
  
  The above diagram from the Microsoft [documentation](https://code.visualstudio.com/docs/remote/containers) shows the development container architecture.
  
  It is quite easy to try it for yourself, just install Docker and the ["Remote - Containers" extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) and you're all set.
  
   ![VSCode Extension](/assets/blog/abstracting-local-development-environments-through-containers/vscode-extension.png)
   
  In a new project, you can open the command palette, and you have the option to create a container according to the development environment of your choice.
   
   ![Container Creation](/assets/blog/abstracting-local-development-environments-through-containers/container-creation.png)
   
   On your project location you know have a ".devcontainer" folder containing the "dockerfile" and the "devcontainer.json" configuration file that you can modify [according to your project](https://code.visualstudio.com/docs/remote/devcontainerjson-reference).
  
  ## Github Codespaces
  
  The motivation for this blog post and quick introduction to development containers are to take a step back and appreciate the possibilities offered by this solution.
  
  Combining development containers with [Github Codespaces](https://github.com/features/codespaces),you can not only abstract the need for a local development environment, but also (almost) abstract the need for a fully fledged operating system and use something like an iPad on the go and with your external monitors at your desk.
  
  ## Conclusion
  
  Personally, this kind of development setup with containers just makes sense in order to avoid, as much as possible, unnecessary conflicts with the operating system that I'm working with.
  
  I hope that this guide might help your workflow, you might also be interested in my previous post about [Setting up macOS for development](https://erdaltoprak.com/blog/setting-up-macos-for-development).