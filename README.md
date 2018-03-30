# React Relay:  An Example for Unlinking a Record

This repository contains React Relay app, which addresses an issue
posted on [a Stack Overflow].

`user` value will become `null` when you click a button at the
bottom of the application.


```javascript
const rootProxy = store.getRoot();
rootProxy.setValue(null, 'user');
// rootProxy.getLinkedRecord('user') === null
```

[a Stack Overflow]: https://stackoverflow.com/questions/46859833/
