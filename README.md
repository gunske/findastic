# Findastic
[![Build Status](https://travis-ci.org/gunske/findastic.svg?branch=master)](https://travis-ci.org/gunske/findastic)

Simple Multi-phrase Search in any text

Detect trigger words and phrases in text. Great for discovering of locations,
social media mentions, simple language detection, filtering documents based on
good/bad phrases etc.

## Features

* In-memory high performance search
* Search for many multiple phrases at once
* Lightweight 
* Normalizes local language characters (E.g. á -> a)
* Supports long texts with sentences
* Attach data to phrases
* Search phrases are indexed and can be exported/imported for higher performance

## Install

```
$ npm install findastic
```

## Usage

Initialize library:

```
const findastic = require('findastic');
```

Add phrases to search for:

```
findastic.add("javascript rocks");
findastic.add("dream comes true");
```

Search text for those phrases:

```
findastic.search("I found that JavaScript Rocks", function (err, result) {
    // Prints: Phrase 'javascript rocks' found at position 13
    if (!err) console.log("Phrase '" + result[0].phrase + "' found at position " + result[0].position);
});
```

### Advanced usage
Attach data to phrases:

```
findastic.add("go north", {direction: "north"});
findastic.add("go south", {direction: "south"});
findastic.add("go west", {direction: "west"});
findastic.add("go east", {direction: "east"});
findastic.search("I want to go north to the reindeers", function (err, result) {
    // Prints: "Direction is north"
    if (!err) console.log("Direction is '" + result[0].data.direction);
});
```

Delete and reset phrases:
```
findastic.reset();
```

Export and save index to file:
```
const fs = require('fs');
const exportData = findastic.export();
fs.writeFile("/tmp/findastic.txt", JSON.stringify(exportData), function(err) {
    // ...
});
```

Import index:
```
const fs = require('fs');
fs.readFile("/tmp/findastic.txt", function(err, importData) {
    if (!err) findastic.import(JSON.parse(importData));
});
```

### Working with promises

Instead of callback, you can use promise for findastic.search:
```
findastic.search("hello").then(function(result) {
   console.log("Found " + result.length + " hits");
}, function (err) {
   console.log("Error!");
});
```

## Change log

### v0.1.2
* Support for promises for findastic.search()
* Added findastic.length to get number of search phrases
* Updated to Mocha v5.0.0

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2018 Gunnar Skeid
