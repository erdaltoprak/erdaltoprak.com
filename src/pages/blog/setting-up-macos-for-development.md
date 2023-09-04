---
layout: ../../layouts/LayoutBlog.astro
title: Setting up macOS for development
pubDate: 2021-10-25
description: "Setting up macOS for development"
author: Erdal Toprak
---

![Banner](/assets/blog/setting-up-macos-for-development/banner.jpeg)

> Update : As of the 20/04/2022, I'm no longer installing most my development environment in the same way, I've made[ this post](https://erdaltoprak.com/blog/abstracting-local-development-environments-through-containers) explaining my transition to development containers.

With each release of macOS, I clean install everything on my MacBook 
just to be extra safe and avoid long debugging hours if there is an
incompatibility. Thus this guide is about setting up your machine 
quickly and in a predictable way. 

I'm primarily doing ML but I also set up various environnements, so feel free to be selective while reading this guide. I 
removed a lot of very specific things to make a good balance between development 
and general macOS usage.

### Initial formatting steps
**When everything you care about is backed up** you can proceed with pressing [CMD⌘+R on startup](https://support.apple.com/en-us/HT208496).
Then go to Disk Utility, format your drive with APFS and install macOS.

Complete the initial set up with your Apple ID and choose your privacy preferences,
you should now be on the desktop.

### Homebrew, Zsh & Other Mac settings

[Homebrew](https://brew.sh) is the most popular macOS package manager, we will use it to install all our apps ([except mas ones because it doesn't work anymore](https://github.com/mas-cli/mas/issues/164))

In your terminal let's copy & paste to install Homebrew
```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then let's make sure everything is up to date

```shell
brew update && brew upgrade
````

You can now install your apps, or search for it on the [Homebrew website](https://brew.sh)

Below the "--cask" refers to graphical applications instead of formulae.
```shell
# Note: you can install multiple apps in just one line, but this is a better visualization
# Browsers
brew install --cask firefox
brew install --cask firefox-developer-edition
brew install --cask google-chrome
brew install --cask homebrew/cask-versions/google-chrome-dev
# Media players
brew install --cask iina
brew install --cask vlc
# File downloads and disk analyze 
brew install --cask transmission
brew install --cask grandperspective
# Media transcode
brew install --cask handbrake
# Flash images (to USB for example)
brew install --cask balenaetcher
# Development
brew install --cask visual-studio-code
brew install --cask docker
brew install --cask local
brew install --cask cyberduck
brew install --cask tower
# App cleaner
brew install --cask appcleaner
# Remote communication
brew install --cask zoom
brew install --cask discord
# Vpn
brew install --cask private-internet-access
# Keyboard based window management
brew install --cask rectangle
# Markdown writer 
brew install --cask obsidian
```

Here are some formulae, make sure to understand each software that you install before trusting a random internet guide
```shell
# Logitech Options software
brew install homebrew/cask-drivers/logitech-options
# Development
brew install docker-compose
brew install node
brew install htop
brew install git
brew install tree
# Python
brew install pyenv
# Shell
brew install romkatv/powerlevel10k/powerlevel10k
brew install zsh-autosuggestions
brew install zsh-syntax-highlighting
brew install zsh-history-substring-search
```

We can now configure Python
```shell
pyenv install 3.9.7
pyenv global 3.9.7
echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.zshrc
````

To finish the powerlevel10k and zsh setup we need the following
```shell
# Plugins 
echo "source $(brew --prefix)/opt/powerlevel10k/powerlevel10k.zsh-theme" >>~/.zshrc
echo "source /usr/local/share/zsh-autosuggestions/zsh-autosuggestions.zsh" >>~/.zshrc
echo "source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >>~/.zshrc
echo "source /usr/local/share/zsh-history-substring-search/zsh-history-substring-search.zsh" >>~/.zshrc

# Zsh tweaks
echo -e "autoload -Uz compinit" >>~/.zshrc
echo -e "compinit" >>~/.zshrc
echo -e "zstyle ':completion:*' menu select" >>~/.zshrc
# Key bindings for history searching, the order is important
echo -e "bindkey '^[[A' history-substring-search-up" >>~/.zshrc
echo -e "bindkey '^[[B' history-substring-search-down" >>~/.zshrc

# Note: lines below are my personal aliases, this might disturb your workflow
echo -e "alias c='clear'" >>~/.zshrc
echo -e "alias rmm='rm -rf'" >>~/.zshrc
echo -e "alias lss='ls -lah'" >>~/.zshrc
echo -e "alias edit='code ~/.zshrc'" >>~/.zshrc
echo -e "alias reload='source ~/.zshrc'" >>~/.zshrc
````

We also need to configure git basics properly 
```shell
git config --global user.email "YOUR_EMAIL"
git config --global user.name "YOUR_NAME"
```

macOS is better with some tweaks
```shell
# Note: There are a lot of settings that you could change, this is just a few of them that I use
# Always show file extensions
defaults write NSGlobalDomain AppleShowAllExtensions -bool true
# Show status bar in Finder
defaults write com.apple.finder ShowStatusBar -bool true
# Allow text selection in Quick Look
defaults write com.apple.finder QLEnableTextSelection -bool true
# Disable TimeMachine prompt
defaults write com.apple.TimeMachine DoNotOfferNewDisksForBackup -bool true
# This is needed to apply our changes
killAll Finder
```

Finally before closing the terminal I setup [powerlevel10k](https://github.com/romkatv/powerlevel10k)
```shell
# Note: This has already been installed in the fomulae section above, this is just the install
source ~/.zshrc
```

### Everthing else

Once this is done I usually login into my password manager, retreive software licences, ssh keys and proceed to login to some applications like Google Chrome, Discord, etc.

#### Here is everything I changed in the System Preferences app

* General > Enable Dark Mode 
* Desktop > Live wallpaper selection
* Desktop > Screensaver > Hot Corners > Bottom Left > CMD⌘ + Display sleep 
* Dock > Enable Automatically hide
* Siri > Disable show Siri in menu bar
* Notifications > Disable everything or remove sounds  
* Screen Time > Enable & share across devices  
* Security > General > Require password > Immediately 
* Trackpad > More Gestures > Enable everything 
* Sharing > Setup the computer name 
* iCloud > iCloud Drive > Enable Desktop & Document
* Keyboard > Text > Disable spelling and capitalization

#### Some Mac App Store apps that I use 
* 1Password (Password Manager)
* Xcode (Code apps)
* Amphetamine (Keep Mac awake)
* Adguard (Safari ad disable)
* The Unarchiver (Almost unrar for Mac)
* Parcel (Track packages)

### Conclusion

This was a quick look at how I install macOS, I hope this helped you in your next fresh install. 

If you enjoyed this guide you can also check the previous ones about [iCloud custom domains](https://erdaltoprak.com/blog/icloud-custom-domain-guide) or [Cloudflare argo & access on a RaspberryPi](https://erdaltoprak.com/blog/setting-up-cloudflare-argo-and-access-on-a-raspberry-pi).
