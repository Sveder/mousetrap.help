/**
 * Copyright 2012 Michael Sverdlin (github.com/Sveder)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Mousetrap.help.js is an extension to the Mousetrap.js library that automatically
 * generates and shows a lightbox overlay with help text for the bound keys.
 *
 * @version 1.2.2
 * @url https://github.com/Sveder/mousetrap.help
 */

Mousetrap = (function(Mousetrap) {
    /* Constants */
    
    /**
     * Original Moustrap functions to pass the "overloaded" functions to.
    */
    var _mousetrap_bind = Mousetrap.bind,
        _mousetrap_unbind = Mousetrap.unbind,
        _mousetrap_reset = Mousetrap.reset,
    
    /*
     * CSS style for the help overlay. Look at the unminified_help.css file
     * for the unminified version.
     *
     * @type {string}
    */
    _DEFAULT_CSS_HELP_STYLE = ".mousetrap_lightbox{font-family:arial,sans-serif;position:fixed;top:10%;left:15%;width:65%;height:65%;border-radius:10px;background-color:#222;opacity:0.85;z-index:1002;overflow:auto;color:#FFF;display:table;padding:25px;}#mousetrap_title{margin-left:20px;padding-bottom:10px;font-size:1.17em;font-weight:700;}#mousetrap_table{margin:7px;}#mousetrap_table > div{display:table-row;}#mousetrap_table > div > div{display:table-cell;padding:2px 4px;}#mousetrap_table > div > div:nth-child(1){width:50%;}#mousetrap_table > div > div:nth-child(3){width:47%;}.mousetrap_key{font-family:'courier new', monospace;font-size:120%;color:#FF0;}.mousetrap_sequence{text-align:right;}",
        
        
    /* Private Variables */
    
    /**
     * Maps the char sequence and action to the help text, kinda mirroring _direct_map
     *
     * @type {Object}
     **/
    _help_map = {},
    
    /**
     * The shortcut help div that should be added and removed as we want
     * to show or hide the help.
     *
     * @type {Object}
     */
    _help_div,
    
    /**
     * Whether the help CSS was added to the DOM already. This should only happen once and only
     * if the help is ever actualy used so to not to pollute the DOM.
     *
     * @type {Boolean}
     */
    _help_css_was_added = false;
    
    
    /**
     * Setup the help keybinding - ? to show and hide help and escape to hide it.
     */
    function _setupHelpBindings()
    {
        Mousetrap.bind('?', _toggleHelp, "Show or hide this help overlay.");
        Mousetrap.bind('esc', _hideHelp, "Hide this help overlay if it is showing.");
    }
    
    /**
     * Ensure that the help CSS was actually added to the dom. It should only be added once.
     * It also has to be right after the head element.
     */
    function _ensureCSS()
    {
        //Only add CSS once:
        if (_help_css_was_added)
        {
            return;
        }
            
        //Add the style element to just after the head so that other style declaration
        //or linked CSS can override it:
        var styleElement = document.createElement("style");
        styleElement.innerHTML = _DEFAULT_CSS_HELP_STYLE ;
        document.head.insertBefore(styleElement, document.head.firstChild);
        _help_css_was_added = true;
    }
    
    /**
    * Show auto generated help overlay.
    * This creates a ton of HTML and appends it to the DOM.
    */
    function _showHelp()
    {
        _ensureCSS();
        
        //Start the lighbox HTML showing title and starting the div table to make it look pretty:
        mappingHtml = "<div class='mousetrap_lightbox'><span id='mousetrap_title'>Keyboard Shortcuts</span>";
        mappingHtml += "<div id='mousetrap_table'>";
        
        //Add all the mappings with their respective class:
        for (var charSeq in _help_map)
        {
            var shortcut = charSeq;
            
            //Change spaces to " then " like gmail does for sequences:
            shortcut = shortcut.replace(/ /g, "</span> then <span class='mousetrap_key'>");
            shortcut = shortcut.replace(/\+/g, "</span> + <span class='mousetrap_key'>");
            shortcut = shortcut.replace(/,/g, "</span> , <span class='mousetrap_key'>");
            
            var seqHTML = "<div><div class='mousetrap_sequence'><span class='mousetrap_key'>";
            seqHTML += shortcut;
            seqHTML += "</span></div><div>:</div>";
            
            var helpText = _help_map[charSeq];
            
            mappingHtml += seqHTML + "<div class='mousetrap_explanation'>" + helpText + "</div></div>";
        }
        
        mappingHtml += '</div>';
        _help_div = document.createElement("div");
        _help_div.innerHTML = mappingHtml;
        document.getElementsByTagName('body')[0].appendChild(_help_div);
    }
    
    /*
    * Toggle the help overlay - show it if hidden and hide if it is shown.
    */
    function _toggleHelp()
    {
        //If _help_div is not null we're already showing help, so hide it instead:
        if (_help_div)
        {
            _hideHelp();
            return;
        }
        _showHelp();
    }

    /*
     * Hide the help overlay if it exists.
     */
    function _hideHelp()
    {
        //If the _help_div doesn't exist we're not showing help and there is nothing
        //to hide:
        if (!_help_div)
        {
            return;
        }
        
        document.getElementsByTagName('body')[0].removeChild(_help_div);
        _help_div = null;
    }
    


    /**
     * binds an event to mousetrap
     *
     * can be a single key, a combination of keys separated with +,
     * an array of keys, or a sequence of keys separated by spaces
     *
     * be sure to list the modifier keys first to make sure that the
     * correct key ends up getting bound (the last key in the pattern)
     *
     * @param {string|Array} keys
     * @param {Function} callback
     * @param {string=} action - 'keypress', 'keydown', or 'keyup'. If not action than
     * it will be used as helpText.
     * @param (string) helpText The help text to show in the help lightbox.
     * @returns void
     */
    Mousetrap.bind = function(keys, callback, action, helpText) {
        // if the third variable is not one of the allowed action values use that for help text
        // (this is such a bad idea but for now I'll go with it)
        if (action !== 'keyup' && action !== 'keydown' && action !== 'keypress' && action !== undefined) {
            helpText = action;
            action = undefined;
        }
        
        //Figure out help text - either the parameter or the bound function name:
        helpText = helpText || callback.name;
        
        //This is a stupid hack I need because Mousetrap.js uses this. in unbind
        //and as I redefine it here this. becomes the global window object. This means
        //I basically can't redefine unbind and just check that the bind in unbind is called.
        //https://github.com/ccampbell/mousetrap/issues/84 - ARGH!
        if (callback.toString() === (function() {}).toString())
        {
            if (_help_map[keys])
            {
                delete _help_map[keys];
            }
        }
        else
        {
            _help_map[keys] = helpText;
        }
        
        return _mousetrap_bind(keys, callback, action);
    };

    
    Mousetrap.reset = function()
    {
        var ret = _mousetrap_reset();
        _help_map = {};
        _setupHelpBindings();
        return ret;
    };
    
    /**
     * Show the help lightbox (overlay).
     */
    Mousetrap.showHelp = _showHelp;
    
    /**
     * Hide the help lightbox (overlay).
     */
    Mousetrap.hideHelp = _hideHelp;
    
    /**
     * Toggle the visibility of the help lightbox (overlay).
     */
    Mousetrap.toggleHelp = _toggleHelp;
    

    //Add the help lightbox shortcut:
    _setupHelpBindings();

    return Mousetrap;

}) (Mousetrap);
