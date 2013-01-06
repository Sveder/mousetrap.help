/**
 * Copyright 2012 Craig Campbell
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
 * Mousetrap is a simple keyboard shortcut library for Javascript with
 * no external dependencies
 *
 * @version 1.2.2
 * @url craig.is/killing/mice
 */
Mousetrap = (function(Mousetrap) {
    /* Constants */
    
    /**
     * Original Moustrap object to pass the "overloaded" functions to.
    */
    var _mousetrap = Mousetrap,
    _lol = Mousetrap.bind,
    
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
            //Get only the char sequence part of the charSeq:condition tuple. slice and this cluncky
            //construct are used to make sure that a sequence containing : also works fine (split is weird):
            var shortcut = charSeq.slice(0, charSeq.lastIndexOf(":"));
            if (shortcut === "?")
            {
                continue;
            }
            
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
        _help_map[keys + ':' + action] = helpText;
        
        return _lol(keys, callback, action);
    };

    
    Mousetrap.unbind = function(keys, action) {
        if (_help_map[keys + ':' + action]) {
            delete _help_map[keys + ':' + action];
        }
        
        return _mousetrap.unbind(keys, action);
    };
    
    
    Mousetrap.reset = function()
    {
        _mousetrap.reset();
        _help_map = {};
        _mousetrap.bind('?', _toggleHelp);;
    };
    
    /**
     * Show the help lighbox (overlay).
     */
    Mousetrap.showHelp = _showHelp;
    
    /**
     * Hide the help lighbox (overlay).
     */
    Mousetrap.hideHelp = _hideHelp;
    
    /**
     * Toggle the visibility of the help lighbox (overlay).
     */
    Mousetrap.toggleHelp = _toggleHelp;
    

    //Add the help lightbox shortcut:
    Mousetrap.bind('?', _toggleHelp);

    return Mousetrap;

}) (Mousetrap);
