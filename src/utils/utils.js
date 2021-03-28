export const retornaObj = (array, id, name) => {
  if (array) {
    return array.reduce(
      (obj, item) => Object.assign(obj, { [item[id]]: item[name] }),
      {}
    );
  }
};
