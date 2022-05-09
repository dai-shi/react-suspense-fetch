# react-suspense-fetch

[![CI](https://img.shields.io/github/workflow/status/dai-shi/react-suspense-fetch/CI)](https://github.com/dai-shi/react-suspense-fetch/actions?query=workflow%3ACI)
[![npm](https://img.shields.io/npm/v/react-suspense-fetch)](https://www.npmjs.com/package/react-suspense-fetch)
[![size](https://img.shields.io/bundlephobia/minzip/react-suspense-fetch)](https://bundlephobia.com/result?p=react-suspense-fetch)
[![discord](https://img.shields.io/discord/627656437971288081)](https://discord.gg/MrQdmzd)

A primitive library for React Suspense for Data Fetching

## Introduction

React 18 comes with Suspense (sort of),
but Suspense for Data Fetching is left for data frameworks.
The goal of this library is to provide a thin API
to allow Suspense For Data Fetching without richer frameworks.

Project status: Experimental. API should mostly be good, but we need to establish its usage.

## Install

```bash
npm install react-suspense-fetch
```

## Usage

```javascript
import React, { Suspense, useState, useTransition } from 'react';
import { createRoot } from 'react-dom/client';

import { createFetchStore } from 'react-suspense-fetch';

// 1️⃣
// Create a store with an async function.
// The async function can take one input argument.
// The input value becomes the "key" of cache.
// By default, keys are compared with strict equal `===`.
const store = createFetchStore(async (userId) => {
  const res = await fetch(`https://reqres.in/api/users/${userId}?delay=3`);
  const data = await res.json();
  return data;
});

// 2️⃣
// Prefetch data for the initial data.
// We should prefetch data before getting the result.
// In this example, it's done at module level, which might not be ideal.
// Some initialization function would be a good place.
// We could do it in render function of a component close to root in the tree.
store.prefetch('1');

// 3️⃣
// When updating, wrap with startTransition to lower the priority.
const DisplayData = ({ result, update }) => {
  const [isPending, startTransition] = useTransition();
  const onClick = () => {
    startTransition(() => {
      update('2');
    });
  };
  return (
    <div>
      <div>First Name: {result.data.first_name}</div>
      <button type="button" onClick={onClick}>Refetch user 2</button>
      {isPending && 'Pending...'}
    </div>
  );
};

// 4️⃣
// We should prefetch new data in an event handler.
const Main = () => {
  const [id, setId] = useState('1');
  const result = store.get(id);
  const update = (nextId) => {
    store.prefetch(nextId);
    setId(nextId);
  };
  return <DisplayData result={result} update={update} />;
};

// 5️⃣
// Suspense boundary is required somewhere in the tree.
// We can have many Suspense components at different levels.
const App = () => (
  <Suspense fallback={<span>Loading...</span>}>
    <Main />
  </Suspense>
);

createRoot(document.getElementById('app')).render(<App />);
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### FetchStore

fetch store

`get` will throw a promise when a result is not ready.
`prefetch` will start fetching.
`evict` will remove a result.

There are three cache types:

*   WeakMap: `input` has to be an object in this case
*   Map: you need to call evict to remove from cache
*   Map with areEqual: you can specify a custom comparator

Type: {get: function (input: Input): Result, prefetch: function (input: Input): void, evict: function (input: Input): void}

#### Properties

*   `get` **function (input: Input): Result** 
*   `prefetch` **function (input: Input): void** 
*   `evict` **function (input: Input): void** 

### createFetchStore

create fetch store

#### Parameters

*   `fetchFunc` **FetchFunc\<Result, Input>** 
*   `cacheType` **({type: `"WeakMap"`} | {type: `"Map"`, areEqual: function (a: Input, b: Input): [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?})?** 
*   `preloaded` **Iterable\<any>?** 

#### Examples

```javascript
import { createFetchStore } from 'react-suspense-fetch';

const fetchFunc = async (userId) => (await fetch(`https://reqres.in/api/users/${userId}?delay=3`)).json();
const store = createFetchStore(fetchFunc);
store.prefetch('1');
```

## Examples

The [examples](examples) folder contains working examples.
You can run one of them with

```bash
PORT=8080 npm run examples:01_minimal
```

and open <http://localhost:8080> in your web browser.

You can also try them in codesandbox.io:
[01](https://codesandbox.io/s/github/dai-shi/react-suspense-fetch/tree/master/examples/01\_minimal)
[02](https://codesandbox.io/s/github/dai-shi/react-suspense-fetch/tree/master/examples/02\_typescript)
[03](https://codesandbox.io/s/github/dai-shi/react-suspense-fetch/tree/master/examples/03\_props)
[04](https://codesandbox.io/s/github/dai-shi/react-suspense-fetch/tree/master/examples/04\_auth)
[05](https://codesandbox.io/s/github/dai-shi/react-suspense-fetch/tree/master/examples/05\_todolist)
[06](https://codesandbox.io/s/github/dai-shi/react-suspense-fetch/tree/master/examples/06\_reactlazy)
[07](https://codesandbox.io/s/github/dai-shi/react-suspense-fetch/tree/master/examples/07\_wasm)

## Blogs

*   [Diving Into React Suspense Render-as-You-Fetch for REST APIs](https://blog.axlight.com/posts/diving-into-react-suspense-render-as-you-fetch-for-rest-apis/)
