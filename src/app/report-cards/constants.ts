/** Report Cards feature constants */
/** Maximum number of political actors that can be selected by the user */
export const MAX_ACTORS = 6;

/** Maximum number of political actors that can be selected by the user */
export const MIN_ACTORS = 1;

export const TOO_MANY_ACTORS_ERROR_MSG =
  'Cannot select more than ' + MAX_ACTORS + ' politicians.';
export const NO_ACTOR_SELECTED_ERROR_MSG =
  'Choose between ' + MIN_ACTORS + ' and ' + MAX_ACTORS + ' politicians.';

export const SPINNER_DIAMETER = 40;

export const FAKE_PERSON_ID = 'x';
export const FAKE_OFFICE_ID = 'x';
export const FAKE_SEARCH_STRING = 'fake_search_string';

export const NO_ACTOR_PANEL_EXPANDED_INDEX = -1;

export const MIN_SEARCH_STRING_LENGTH = 3;
export const SEARCH_INPUT_DEBOUNCE_MS = 700;
export const TOOLTIP_POSITION_BELOW = 'below';
