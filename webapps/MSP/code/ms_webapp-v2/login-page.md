# Login Page Template
The following is the template used for the Auth0 login page. You can update/set this via the command line interface by calling `auth0 branding templates update`. This version is not the one is use, it is simple here as a backup in case it needs to be reset, the actual template in use is stored on the Auth0 side and only updated via that command line.

Templates use Liquid, and have warnings about CSS classes changing without warning. Styling will need to keep this in mind if it wants to be durable, not just so the styles stay but so that if they change things on their end it won't break in a way that makes the form unusable.


## The Template
See `login-page.html` is the same directory as this readme for the template. I do have some notes on templating to excuse what you'll see in the template;

- The docs mention that the class values change between builds (their, not ours) so you can't rely on them in order to, hench the hideous selector chains.
- Since we can't point to an element via CSS selector but they can a lot of things need to be given an `!important` tag just to take effect.
- Some of their elements, namely the custom logo space, commit the ultimate sin of `!important`ing in an inline style, there is nothing you can do to CSS over that (at least to my knowledge)
- Due to CORS erros graphic elements are inline. They have been optomized as best as possible, but it still makes the page a bit of a bother to work with. 
- In the optomization I trimmed a bunch of diacritics, as well as some other things, from the font. This optimized it a bit but not as much as I would have liked. If you need to work with it but VS Code is truncating it due to the length see this SO question for a solution: https://stackoverflow.com/questions/50862347/how-to-show-full-long-line-in-visual-studio-code-word-wrap-off
- The saved version is the working version, however I suggest passing it through an minifier before using it to try and scrape back some performance.

## Controls
The Auth0 login editing interface has a few controls in it, these are largely replaced by the inline CSS but they should still be updates to the following
- PrimaryColor - #E14963
- PageBackgroundColor - #211F30
- LogoURL - Leave this one blank
