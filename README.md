# YodaBotKelio

Yoda Hangouts Bot For Kelio CRA <br>
You can set one by one client percentage

# Config

- Rename config.model.js -> config.js
- Replace your Kelio / Hangouts account in the config.js file
- "to" paramater is somethink like (ddsqdkqsd4567DKLS@public.talk.google.com)
- Send message to your bot to see him in node console.
- Select yours clients as favorite on Kelio to save the list (see preview 2)
- May the force be with you !
- Enjoy !

# AutoLoad at 11AM

## MAC OSX

```sheel
sudo crontab -e

0 11 * * * /usr/local/bin/node /Users/Aurelien/Web/yodabotkelio/app.js

### test
sudo crontab -l
```

## Windows
```sheel
... ?
```

## Linux
```sheel
sudo crontab -e

0 11 * * * /usr/local/bin/node /Users/Aurelien/Web/yodabotkelio/app.js
```

# Chat Option

exit -> Stop the process

# Preview

![Preview Hangouts](img/screen_1.png)
![Preview favorite](img/screen_2.png)
