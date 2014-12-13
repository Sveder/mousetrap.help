# Mousetrap Help Extension
mousetrap.help.js is an extension to [mousetrap.js](https://github.com/ccampbell/mousetrap "mousetrap.js") that automatically generates a beautiful help overlay containing the currently active key bindings. It looks like this:

![Example help overlay created by mousetrap.help.js](https://raw.github.com/Sveder/mousetrap.help/master/lightbox_screenshot.png "Example help overlay created by mousetrap.help.js")

## Usage

1.  Include [mousetrap.js](https://github.com/ccampbell/mousetrap "mousetrap.js") and mousetrap.help.js:
```
<script src="mousetrap.min.js"></script>
<script src="mousetrap.help.min.js"></script>
```

2.  Use the same API as mousetrap.js, with one change - add the help text after the regular parameter to bind:
```
//Regular bind call with help text:
Mousetrap.bind("a", some_callback, "Help text that appears in the overlay.");
//Bind call with a third parameter specifier (keyup):
Mousetrap.bind("b", other_callback, "keyup", "b does cool things!");
```

3. When user presses ? (usually shift+/. This has become a standard shortcut for it, try it on Gmail and Facebook) he will see the help overlay. A second press will hide it again.

## Mousetrap API Extensions

The following functions are added to the Mousetrap API with this extension:

``Mousetrap.showHelp`` - Show the help lightbox (overlay).

``Mousetrap.hideHelp`` - Hide the help lightbox (overlay).
    
``Mousetrap.toggleHelp`` - Toggle the visibility of the help lightbox (overlay).

The default key used for the help overlay is "?" but you can also bind it to whatever key you want:

``Mousetrap.bind("h", Mousetrap.toggleHelp);``

## Customization
**You can customize the layout using CSS.**

The basic overlay is the simplest lightbox made to look as close to Gmail's help overlay as possible. It is inserted immediately after the head statement to make sure that you can override it and use CSS to style it to your needs. The CSS is minified in the source code but an unminified is in "unminified_help.css". It is not needed but lets you see the styles and the names of the classes and ids. The main classes and ids are:

``.mousetrap_lightbox`` - the main lightbox popup.

``#mousetrap_title`` - the title "Keyboard Shortcuts".

``#mousetrap_table`` - the shortcut display is a table whose root is this.

``.mousetrap_key`` - the key itself, in yellow in the default overlay.

``.mousetrap_sequence`` - the whole sequence including the key, "then", "+" and ","

Want to share your style? Add a pull request and I'll add it. If I get enough I might make some way to specify/change them on runtime (for example for dark/light theme changes).


## Development
Feel free to report bugs and add features and suggestions either through github issues or by email to m@sveder.com

## License
Mousetrap.help is licensed under the [apache 2.0 license](http://www.apache.org/licenses/LICENSE-2.0.html).


## Additional Credits

@ccampbell for the [mousetrap.js](https://github.com/ccampbell/mousetrap "mousetrap.js") library. 

@ecgan for a lot of help, getting me on the right track and suggestions.
