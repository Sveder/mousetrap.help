/**
 * Copyright 2013 Michael Sverdlin (sveder.com)
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
 * @version 1.5
 * @url https://github.com/Sveder/mousetrap.help
 */

CSS_SELECTORS = [".mousetrap_lightbox", "#mousetrap_title", "#mousetrap_table", "#mousetrap_table > div",
                 "#mousetrap_table > div > div", "#mousetrap_table > div > div:nth-child(1)",
                 "#mousetrap_table > div > div:nth-child(3)", ".mousetrap_key", ".mousetrap_sequence"];

/**
 * Is the mousetrap.help css injected to the DOM?
 */
function is_help_css_in_dom()
{
    var rules = [];
    _.map(document.styleSheets, function(styleSheet){ rules.push(styleSheet.rules); } );
    rules = _.flatten(rules);
    for (var rule in rules)
    {
        for (var item in rules[rule])
        {
            if (_.contains(CSS_SELECTORS, rules[rule][item].selectorText))
            {
                return true;
            }
        }
    }
    return false;
}
function is_help_showing()
{
    return $(".mousetrap_lightbox").length === 1;
}

function set_up(details)
{
    Mousetrap.reset();
    Mousetrap.hideHelp();
    ok(!is_help_showing(), "Help is showing after hiding it in set_up!");
}
QUnit.testStart(set_up);


/**
 * Test: Test that showHelp works.
 * Expected Result: When showHelp is called the overlay and css is created and shown.
 */
test( "Test showHelp", function() {
    ok(!is_help_showing(), "Test started without showing the overlay.");
    Mousetrap.showHelp();

    ok(is_help_showing(), "Help is showing after calling showHelp.");
    ok(is_help_css_in_dom(), "CSS was added to the dom.");
});


/**
 * Test: Test that hideHelp works.
 * Expected Result: When hideHelp is called the overlay is .
 */
test( "Test hideHelp", function() {
    Mousetrap.showHelp();
    ok(is_help_showing(), "Test started showing the overlay.");

    Mousetrap.hideHelp();
    ok(!is_help_showing(), "Help is hidden after calling hideHelp.");    
});


/**
 * Test: Test that toggleHelp works.
 * Expected Result: When toggleHelp is called the overlay visibility is switched.
 */
test( "Test toggleHelp", function() {
    ok(!is_help_showing(), "Test started without showing the overlay.");
    Mousetrap.toggleHelp();
    ok(is_help_showing(), "Help is showing after calling toggleHelp.");

    Mousetrap.toggleHelp();
    ok(!is_help_showing(), "Help is hidden after calling toggleHelp again.");
});