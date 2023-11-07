---
layout: ../../layouts/LayoutBlog.astro
title: "Using venv, pyvenv, autoenv on macOS"
pubDate: 2023-11-07
description: "Using venv, pyvenv, autoenv on macOS"
author: Erdal Toprak
---

![Banner](/assets/blog/using-venv-pyvenv-autoenv-on-macOS/banner.jpg)


At some point you might work on a python project that requires some specific dependencies such as a machine learning project with an exact PyTorch version. It becomes a necessity to structure your workflow in order to avoid conflicts and iterate quickly across projects.

In this post I will explain the main tools that I use on macOS and show a neat trick in order to switch virtual environments automatically.  


## Why Use Virtual Environments?

The ability to replicate environments not only makes onboarding easier but also minimizes the « works on my machine » issue. To accomplish our goal we will need three tools, pyenv, venv and autoenv.

#### Pyenv
[Pyenv](https://github.com/pyenv/pyenv) is an incredible tool that allows you to switch between multiple versions of Python. You can even search and install Python versions and set local and global versions.

#### Venv
[Venv](https://docs.python.org/3/library/venv.html) is a built-in and simple method for creating isolated Python environments. While pyenv (through pyenv-virtualenv) could be used for isolating projects you should use venv.

#### Autoenv
[Autoenv](https://github.com/hyperupcall/autoenv) is magical tool that just makes using virtual environments seamless and uses .env and .env.leave files to activate and deactivate environments. 


## Setting up the tools

The tools require homebrew or another package manager and the ability to modify your shell.

We first need to install pyenv:

```shell
brew install pyenv 
```

Then we need to append the following in the .zshrc:

```shell
if command -v pyenv 1>/dev/null 2>&1; then eval "$(pyenv init -)"; fi
```

You can refer to the documentation but the minimal commands are:

```shell
pyenv versions
pyenv install your_python_version
pyenv global your_python_version
pyenv local your_python_version
```

Finally we need autoenv:

```shell
brew install autoenv
```

Then executing the following in your zsh shell:

```shell
printf '%s\n' "source $(brew --prefix autoenv)/activate.sh" >> "${ZDOTDIR:-$HOME}/.zprofile"  
```

Before using the tool you should read the documentation and activate the  « AUTOENV_ENABLE_LEAVE » option by setting it to any non empty string.

## Practical workflow 

Create or clone your project:

```shell
mkdir exllama && cd exllama
git clone https://github.com/turboderp/exllama
```

Set with pyenv the local python version needed:

```shell
pyenv local 3.10.10
```

Create the virtual environment:

```shell
python3 -m venv venv
```

Add the .env and .env.leave and approve the autoenv changes:

```shell
# .env file for autoenv
# It looks quite cryptic but it's to preserve the virtual environment state across sub folders 
venv_dir="venv"
currentvenv=""

# Function to traverse up the directory structure to find the parent directory containing venv_folder
get_project_root() {
    local current_dir="$PWD"
    while [[ "$current_dir" != "" && ! -d "$current_dir/$venv_dir" ]]; do
        current_dir=${current_dir%/*}
    done
    echo "$current_dir"
}

root_dir=$(get_project_root)

if [[ -z "$root_dir" || ! -d "$root_dir/$venv_dir" ]]; then
    echo "Unable to find the virtual environment folder."
    return
fi

if [[ $VIRTUAL_ENV != "" ]]; then
    # Strip out the path and just leave the env name
    currentvenv="${VIRTUAL_ENV##*/}"
fi

if [[ "$currentvenv" != "$venv_dir" ]]; then
    python_version=$(python --version 2>&1)
    echo "Switching to environment: $venv_dir | $python_version"
    # Source the activation script
    source "$root_dir/$venv_dir/bin/activate"
fi
```

```shell
# .env.leave for autoenv
deactivate
```

![autoenv](/assets/blog/using-venv-pyvenv-autoenv-on-macOS/autoenv.jpg)

## Conclusion

You are now ready to start your development, with a clean and isolated environment.

If you found this guide useful you can also check the previous ones about [Setting up macOS for development](https://erdaltoprak.com/blog/setting-up-macos-for-development/) and [AI Homelab: A guide into hardware to software considerations](https://erdaltoprak.com/blog/ai-homelab-a-guide-into-hardware-to-software-considerations/).
