# Utilitarian - Common, Low-Level JavaScript Utility & Helper Functions

This module contains low-level JavaScript functions that I find myself using frequently on NodeJS or React/Angular/Vue projects.  I would often start a JavaScript project by dropping most of these functions into a `utils.js` file in the project root, however this was typically for monolithic UI projects that would occupy my time for nearly a year at a time (or more). Once I found myself working on handfuls of small NodeJS microservices and smaller UI applications, the need to place these utils into an npm module became obvious.

This package includes type-checkers, array & object mappers, http code constants, some of my favorite CSS colors, constants and mixins for responsive design, connect.js request parsing functions, random string/number generators, and event helpers. Most of these utils are so low level that you've undoubtedly written functions like these (especially those in the `is.util.js` file) but hopefully you'll find it useful to have them organized into one collection that can be injected and used piecemeal on a front-end or back-end JavaScript application.

During my time with [Mentor](https://www.mentor.com/) I attempted to fully polish these APIs, splitting them up into multiple files so that you can import smaller portions of this library when your particular needs are minimal. Much of this package's organizational structure was influenced by what I learned while there, creating one NodeJS service, and then another, rinse-and-repeat.

## Installation

Latest release:

	$ npm install utilitarian

## Dependencies

* [url](https://github.com/defunctzombie/node-url)
* [md5](https://github.com/pvorb/node-md5)
* [crypto](https://github.com/Gozala/crypto)

## Usage

    import {isEmpty} from 'utilitarian/is.util';

    function fullName({first, last, middle} = {}) {
        if (!isEmpty(middle)) {
            return `${first} ${middle} ${last}`;
        }

        return `${first} ${last}`;
    }

Or:

    import utils from 'utilitarian';

    function fullName({first, last, middle, title, suffix} = {}) {
        return utils.string.fullTrim(
            [title, first, middle, last, suffix].filter(name => name)
        ) || utils.string.randomString(5);
    }

## Overview

* [css cards](#markdown-header-css-cards)
* [css mixins](#markdown-header-css-mixins)
* ["color" utils](#markdown-header-color-utils)
* ["event" utils](#markdown-header-event-utils)
* ["is" utils](#markdown-header-is-utils)
* [logger](#markdown-header-logger)
* ["obj" utils](#markdown-header-obj-utils)
* ["req" utils](#markdown-header-req-utils)
* ["string" utils](#markdown-header-string-utils)

### is utils

Functions that check data types and validate categories of string types (such as passwords, emails, urls, etc.)

### obj utils

Helper functions for objects, for converting to other formats, for deep inspection of nested properties, etc.

### string utils

Helper function for strings to convert to other formats, to format string in different manners, and for hashing.

### logger

A simple wrapper around the console logging that allows for turning messages on or off.

### req utils

Helper functions for Http request handling and code parsing (some helpers specific to the ExpressJS framework)

### event utils

Helper functions for parsing native or React-wrapped `event` objects.

### color utils

Helper functions for color conversion (hex to rgb, rgb to hex, hex to rgba, etc) and other helpers related to coloring.

### css cards

Style constants for responsive Card design.

### css mixins

CSS mixins for transitions, box shadow, text shadow and other complex styling.

