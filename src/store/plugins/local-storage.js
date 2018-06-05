export default (store) => {
  store.subscribe((mutation, data) => {
    window.localStorage.setItem('lift', JSON.stringify(data));
  });
}