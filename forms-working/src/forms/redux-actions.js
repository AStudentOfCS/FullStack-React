const apiClient = {
  loadPeople: () => {
    return {
      then: (cb) => {
        setTimeout(() => {
          cb(JSON.parse(localStorage.people || '[]'))
        }, 1000);
      }
    }
  },

  savePeople: (people) => {
    const success = !!(this.count++ % 2);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!success) return reject({success});
        localStorage.people =JSON.stringify(people);
        resolve({success});
      }, 1000);
    });
  },

  count: 1
};

const FETCH_PEOPLE_REQUEST = 'FETCH_PEOPLE_REQUEST';
const fetchPeopleRequest = () => ({
  type: FETCH_PEOPLE_REQUEST,
});

const FETCH_PEOPLE_SUCCESS = 'FETCH_PEOPLE_SUCCESS';
const fetchPeopleSuccess = () => ({
  type: FETCH_PEOPLE_SUCCESS,
});

export function fetchPeople () {
  return function (dispatch) {
      dispatch(fetchPeopleRequest())
      apiClient.loadPeople().then((people) => {
        dispatch(fetchPeopleSuccess(people));
      })
  }
}

const SAVE_PEOPLE_REQUEST = 'SAVE_PEOPLE_REQUEST';
const savePeopleRequest = () => (
  {
    type: SAVE_PEOPLE_REQUEST,
  }
);

const SAVE_PEOPLE_FAILURE = 'SAVE_PEOPLE_FAILURE';
const savePeopleFailure = (error) => (
  {
    type: SAVE_PEOPLE_FAILURE,
    error,
  }
);

const SAVE_PEOPLE_SUCCESS = 'SAVE_PEOPLE_SUCCESS';
const savePeopleSuccess = (people) => (
  {
    type: SAVE_PEOPLE_SUCCESS,
    people,
  }
);

export function savePeople(people) {
  return function (dispatch) {
    dispatch(savePeopleRequest())
    apiClient.savePeople(people)
      .then((resp) => { dispatch(savePeopleSuccess(people)) })
      .catch((err) => { dispatch(savePeopleFailure(err)) });
  }
};

const initialState = {
  people: [],
  isLoading: false,
  saveStatus: 'READY',
  person: {
    name: '',
    email: '',
    course: null,
    department: null,
  },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PEOPLE_REQUEST:
      return Object.assign({}, state, {
        isLoading: true
      });
    case FETCH_PEOPLE_SUCCESS:
      return Object.assign({}, state, {
        people: action.people,
        isLoading: false
      });
    case SAVE_PEOPLE_REQUEST:
      return Object.assign({}, state, {
        saveStatus: 'SAVING'
      });
    case SAVE_PEOPLE_FAILURE:
      return Object.assign({}, state, {
        saveStatus: 'ERROR'
      });
    case SAVE_PEOPLE_SUCCESS:
      return Object.assign({}, state, {
        people: action.people,
        person: {},
        saveStatus: 'SUCCESS'
      });
    default:
      return state;
  }  
}
