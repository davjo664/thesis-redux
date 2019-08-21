/*
 * Copyright (C) 2015 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {combineReducers} from 'redux'
import parseLinkHeader from 'parse-link-header'
import initialState from '../store/initialState'

const emailRegex = /([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})/i

/**
 * Handles setting the editUserDialogOpen state
 * state - the redux state
 * action - the redux action
 * visibility - boolean that editUserDialogOpen should be set to.
 */

const userListHandlers = {
  GOT_USERS(state, action) {
    return {
      ...state,
      users: action.payload.users,
      isLoading: false,
      links: parseLinkHeader(action.payload.xhr.getResponseHeader('Link'))
    }
  },
  GOT_USER_UPDATE(state, action) {
    return {
      ...state,
      users: state.users.map(user => (user.id === action.payload.id ? action.payload : user))
    }
  },
  UPDATE_SEARCH_FILTER(state, action) {
    return {
      ...state,
      errors: {
        search_term: ''
      },
      searchFilter: {
        ...state.searchFilter,
        ...action.payload
      }
    }
  },
  SEARCH_TERM_TOO_SHORT(state, action) {
    return {
      ...state,
      errors: {
        ...state.errors,
        search_term: action.errors.termTooShort
      }
    }
  },
  LOADING_USERS(state, _action) {
    return {
      ...state,
      isLoading: true
    }
  }
}

const makeReducer = handlerList => (state = initialState, action) => {
  const handler = handlerList[action.type]
  if (handler) return handler({...state}, action)
  return state
}

export default combineReducers({
  userList: makeReducer(userListHandlers)
})
