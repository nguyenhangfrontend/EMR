

export default {
  state: {
    url: null,
    isVisible: false,
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    initUrl(state, payload) {
      return {...state, url: payload};
    },
    openForm(state, payload) {
      return {...state, isVisible: payload};
    }
  },
}
