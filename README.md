# Utilitarian - Common, Low-Level JavaScript Utility & Helper Functions

This module contains low-level JavaScript functions that I've found useful over the years when participating in NodeJS or React/Angular/Vue projects. I realize anytime someone creates/collects a suite of helper functions they tend to represent that particular person's stylistic preference on the proper balance between functionality and abstraction/convenience, and this library is no different. Perhaps each function or shape of these APIs aren't the most common or standard way to accomplish a given task, but recommendations for improvement or changes or new features are always welcome through [Pull Requests](https://github.com/arizonatribe/utilitarian/pull/new/master) (especially performance improvement recommendations).

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

