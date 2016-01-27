function onlyKeys(t, keys, obj) {
  keys.every(key => {
    t.ok(obj.hasOwnProperty(key), `Object missing property ${key}`);
  });
  Object.keys(obj).forEach(key => {
    if (keys.indexOf(key) === -1) {
      t.fail(`Object has unwanted property ${key}`);
    }
  });
}

module.exports = {
  onlyKeys: onlyKeys
};
